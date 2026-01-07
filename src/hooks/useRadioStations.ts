import { useState, useEffect } from 'react';
import type { RadioStation } from '../types/radio';

const API_URL = 'https://de2.api.radio-browser.info/json/stations/search?offset=0&limit=5000&hidebroken=true&has_geo_info=true&order=clickcount&reverse=true';

export function useRadioStations() {
    const [stations, setStations] = useState<RadioStation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStations = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Failed to fetch radio stations');
                }
                const data: RadioStation[] = await response.json();
                // Filter out stations with invalid coordinates
                const validStations = data.filter(
                    station =>
                        station.geo_lat !== 0 &&
                        station.geo_long !== 0 &&
                        station.geo_lat >= -90 &&
                        station.geo_lat <= 90 &&
                        station.geo_long >= -180 &&
                        station.geo_long <= 180
                );

                setStations(validStations);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchStations();
    }, []);

    return { stations, loading, error };
}

