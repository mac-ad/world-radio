import { useState, useEffect, useRef } from 'react';
import type { RadioStation } from '../types/radio';

// Use multiple servers for reliability - de1 has better CORS support
const API_SERVERS = [
    'https://de1.api.radio-browser.info',
    'https://nl1.api.radio-browser.info',
    'https://at1.api.radio-browser.info',
];

async function fetchWithFallback(path: string, signal?: AbortSignal): Promise<Response> {
    for (const server of API_SERVERS) {
        try {
            const response = await fetch(`${server}${path}`, { signal });
            if (response.ok) return response;
        } catch (e) {
            if ((e as Error).name === 'AbortError') throw e;
            // Try next server
        }
    }
    throw new Error('All API servers failed');
}
// Progressive loading stages: 500 → 1000 → 3000 → 5000
const LOAD_STAGES = [500, 1000, 3000, 5000];
const CACHE_KEY = 'litverse_stations_cache';
const CACHE_EXPIRY = 1000 * 60 * 30; // 30 minutes

interface CacheData {
    stations: RadioStation[];
    timestamp: number;
}

function getCache(): RadioStation[] | null {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;
        const data: CacheData = JSON.parse(cached);
        if (Date.now() - data.timestamp > CACHE_EXPIRY) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
        return data.stations;
    } catch {
        return null;
    }
}

function setCache(stations: RadioStation[]) {
    try {
        const data: CacheData = { stations, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
        // localStorage full or unavailable
    }
}

export function useRadioStations() {
    const [stations, setStations] = useState<RadioStation[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const fetchStations = async () => {
            const finalLimit = LOAD_STAGES[LOAD_STAGES.length - 1];

            // Check cache first for instant load
            const cached = getCache();
            if (cached && cached.length >= finalLimit) {
                setStations(cached);
                setLoading(false);
                return;
            }

            // If partial cache exists, use it immediately
            if (cached && cached.length > 0) {
                setStations(cached);
            }

            abortRef.current = new AbortController();
            const signal = abortRef.current.signal;

            try {
                setLoading(true);
                let allStations: RadioStation[] = [];

                for (let i = 0; i < LOAD_STAGES.length; i++) {
                    const limit = LOAD_STAGES[i];
                    const offset = i === 0 ? 0 : LOAD_STAGES[i - 1];
                    const count = limit - offset;

                    const path = `/json/stations/search?offset=${offset}&limit=${count}&hidebroken=true&has_geo_info=true&order=clickcount&reverse=true`;

                    try {
                        const response = await fetchWithFallback(path, signal);
                        const data: RadioStation[] = await response.json();
                        allStations = [...allStations, ...data];
                        setStations(allStations);

                        // After first batch, hide main loader and show "loading more" indicator
                        if (i === 0) {
                            setLoading(false);
                            setError(null);
                            setLoadingMore(true);
                        }
                    } catch (err) {
                        if ((err as Error).name === 'AbortError') throw err;
                        // If a stage fails, continue with what we have
                        break;
                    }
                }

                // Cache the final result
                if (allStations.length > 0) {
                    setCache(allStations);
                }
                setLoadingMore(false);

            } catch (err) {
                if ((err as Error).name === 'AbortError') return;
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
                setLoading(false);
                setLoadingMore(false);
            }
        };

        fetchStations();

        return () => {
            abortRef.current?.abort();
        };
    }, []);

    return { stations, loading, loadingMore, error };
}

