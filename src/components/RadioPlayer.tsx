import type { RadioStation } from '../types/radio';
// import { AudioWave } from './AudioWave';

interface RadioPlayerProps {
    station: RadioStation | null;
    isPlaying: boolean;
    isLoading: boolean;
    volume: number;
    error: string | null;
    analyserNode: AnalyserNode | null;
    onTogglePlay: () => void;
    onVolumeChange: (volume: number) => void;
    onStop: () => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

export function RadioPlayer({
    station,
    isPlaying,
    isLoading,
    volume,
    error,
    // analyserNode,
    onTogglePlay,
    onVolumeChange,
    onStop,
    isDarkMode,
    onToggleTheme,
}: RadioPlayerProps) {
    const location = station
        ? [station.city, station.state, station.countrycode].filter(Boolean).join(', ')
        : '';

    return (
        <div className={`radio-player ${station ? 'has-station' : ''}`}>
            {/* Audio Wave Visualization */}
            {/* {isPlaying && (
                <div className="audio-wave-container">
                    <AudioWave isPlaying={isPlaying} analyserNode={analyserNode} />
                </div>
            )} */}
            <div className="player-content">
                {/* Theme Toggle */}
                <button
                    className="theme-toggle"
                    onClick={onToggleTheme}
                    aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDarkMode ? (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
                        </svg>
                    )}
                </button>

                {/* Station Info */}
                <div className="station-info">
                    {station ? (
                        <>
                            {station.favicon && (
                                <img
                                    src={station.favicon}
                                    alt=""
                                    className="station-favicon"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            )}
                            <div className="station-details">
                                <h2 className="station-name">{station.name}</h2>
                                <p className="station-location">{location || 'Unknown location'}</p>
                            </div>
                        </>
                    ) : (
                        <div className="station-details">
                            <h2 className="station-name">LitVerse Radio</h2>
                            <p className="station-location">Select a station on the map to begin</p>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && <p className="player-error">{error}</p>}

                {/* Controls */}
                <div className="player-controls">
                    {station && (
                        <>
                            <button
                                className="control-btn stop-btn"
                                onClick={onStop}
                                aria-label="Stop"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="6" y="6" width="12" height="12" rx="1" />
                                </svg>
                            </button>

                            <button
                                className={`control-btn play-btn ${isLoading ? 'loading' : ''}`}
                                onClick={onTogglePlay}
                                disabled={isLoading}
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isLoading ? (
                                    <div className="spinner" />
                                ) : isPlaying ? (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>
                        </>
                    )}

                    {/* Volume Control */}
                    <div className="volume-control">
                        <button
                            className="control-btn volume-btn"
                            onClick={() => onVolumeChange(volume > 0 ? 0 : 0.7)}
                            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                        >
                            {volume === 0 ? (
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
                                </svg>
                            ) : volume < 0.5 ? (
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                </svg>
                            )}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                            className="volume-slider"
                            aria-label="Volume"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

