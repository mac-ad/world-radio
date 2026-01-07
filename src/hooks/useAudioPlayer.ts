import { useState, useRef, useCallback, useEffect } from 'react';
import type { RadioStation, RadioPlayerState } from '../types/radio';

export function useAudioPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
    const [state, setState] = useState<RadioPlayerState>({
        station: null,
        isPlaying: false,
        volume: 0.7,
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        if (state.station && state.station.favicon) {
            document.title = `${state.station.name} - ${state.station.city}, ${state.station.state}, ${state.station.countrycode}`;
            const link = document.querySelector("link[rel~='icon']");
            const favicon = state.station.favicon !== "" ? state.station.favicon : '/radio.svg';
            if (link && link instanceof HTMLLinkElement) {
                link.href = favicon;
            } else {
                const newLink = document.createElement('link');
                newLink.rel = 'icon';
                newLink.href = favicon;
                document.head.appendChild(newLink);
            }
        } else {
            document.title = 'LitVerse Radio';
        }
    }, [state.station])

    // Setup audio context and analyser for visualization
    const setupAudioContext = useCallback(() => {
        if (!audioRef.current || audioContextRef.current) return;

        try {
            const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;
            analyserRef.current = analyser;

            const source = audioContext.createMediaElementSource(audioRef.current);
            sourceRef.current = source;

            source.connect(analyser);
            analyser.connect(audioContext.destination);

            setAnalyserNode(analyser);
        } catch (e) {
            console.warn('Failed to create audio context for visualization:', e);
        }
    }, []);

    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.volume = 0.7; // Default volume
        audioRef.current.crossOrigin = 'anonymous';

        const audio = audioRef.current;

        const handleCanPlay = () => {
            setState(prev => ({ ...prev, isLoading: false }));
        };

        const handleError = () => {
            setState(prev => ({
                ...prev,
                isLoading: false,
                isPlaying: false,
                error: 'Failed to load audio stream',
            }));
        };

        const handlePlaying = () => {
            setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
            // Setup audio context on first play (requires user gesture)
            setupAudioContext();
            // Resume audio context if suspended
            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
            }
        };

        const handleWaiting = () => {
            setState(prev => ({ ...prev, isLoading: true }));
        };

        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.addEventListener('playing', handlePlaying);
        audio.addEventListener('waiting', handleWaiting);

        return () => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('playing', handlePlaying);
            audio.removeEventListener('waiting', handleWaiting);
            audio.pause();
            audio.src = '';
            // Cleanup audio context
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [setupAudioContext]);

    const playStation = useCallback((station: RadioStation) => {
        if (!audioRef.current) return;

        const streamUrl = station.url_resolved || station.url;

        if (state.station?.stationuuid === station.stationuuid && state.isPlaying) {
            audioRef.current.pause();
            setState(prev => ({ ...prev, isPlaying: false }));
            return;
        }

        setState(prev => ({
            ...prev,
            station,
            isLoading: true,
            error: null,
        }));

        audioRef.current.src = streamUrl;
        audioRef.current.play().catch(() => {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Failed to play audio',
            }));
        });
    }, [state.station, state.isPlaying]);

    const togglePlay = useCallback(() => {
        if (!audioRef.current || !state.station) return;

        if (state.isPlaying) {
            audioRef.current.pause();
            setState(prev => ({ ...prev, isPlaying: false }));
        } else {
            audioRef.current.play().catch(() => {
                setState(prev => ({
                    ...prev,
                    error: 'Failed to resume playback',
                }));
            });
        }
    }, [state.isPlaying, state.station]);

    const setVolume = useCallback((volume: number) => {
        if (!audioRef.current) return;
        const clampedVolume = Math.max(0, Math.min(1, volume));
        audioRef.current.volume = clampedVolume;
        setState(prev => ({ ...prev, volume: clampedVolume }));
    }, []);

    const stop = useCallback(() => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.src = '';
        setState(prev => ({
            ...prev,
            station: null,
            isPlaying: false,
            isLoading: false,
            error: null,
        }));
    }, []);

    return {
        ...state,
        analyserNode,
        playStation,
        togglePlay,
        setVolume,
        stop,
    };
}

