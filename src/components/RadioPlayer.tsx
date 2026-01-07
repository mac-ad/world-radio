import { useState, useEffect, useCallback } from 'react';
import type { RadioStation } from '../types/radio';
import { GENRES } from '../types/radio';
import {
    Share2, ChevronUp, ChevronDown,
    Play, Pause, Square, Volume2, VolumeX, Volume1,
    DollarSign, Link
} from 'lucide-react';

interface RadioPlayerProps {
    station: RadioStation | null;
    isPlaying: boolean;
    isLoading: boolean;
    volume: number;
    error: string | null;
    onTogglePlay: () => void;
    onVolumeChange: (volume: number) => void;
    onStop: () => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
    selectedGenre: string;
    onGenreChange: (genre: string) => void;
}

export function RadioPlayer({
    station,
    isPlaying,
    isLoading,
    volume,
    error,
    onTogglePlay,
    onVolumeChange,
    onStop,
    selectedGenre,
    onGenreChange,
}: RadioPlayerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [copied, setCopied] = useState(false);

    const location = station
        ? [station.city, station.state, station.countrycode].filter(Boolean).join(', ')
        : '';

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Format time
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Copy station link
    const handleShare = useCallback(async () => {
        if (!station) return;

        const url = station.homepage || station.url_resolved || station.url;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [station]);

    // Support link
    const handleSupport = useCallback(() => {
        window.open('https://ko-fi.com/macad626', '_blank');
    }, []);

    return (
        <div className={`radio-player-wrapper ${isExpanded ? 'expanded' : ''}`}>
            {/* Genre Selector - Floating Island */}
            <div className={`genre-island ${isExpanded ? 'visible' : ''}`}>
                <div className="genre-island-content">
                    <h3 className="genre-title">Browse by Genre</h3>
                    <div className="genre-chips">
                        {GENRES.map((genre) => (
                            <button
                                key={genre.id}
                                className={`genre-chip ${selectedGenre === genre.id ? 'active' : ''}`}
                                onClick={() => onGenreChange(genre.id)}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Player */}
            <div className={`radio-player ${station ? 'has-station' : ''}`}>
                <div className="player-content">
                    {/* Header Bar */}
                    <div className="player-header">
                        <span className="player-time">{formatTime(currentTime)}</span>

                        <div className="player-header-actions">
                            {station && (
                                <button
                                    className="header-btn tooltip-btn"
                                    onClick={handleShare}
                                    aria-label="Share station"
                                    data-tooltip={copied ? 'Copied!' : 'Copy link'}
                                >
                                    <Share2 size={16} />
                                </button>
                            )}

                            <button
                                className="header-btn tooltip-btn"
                                onClick={handleSupport}
                                aria-label="Visit website"
                                data-tooltip="Website"
                            >
                                <Link size={16} />
                            </button>

                            <button
                                className="header-btn support-btn tooltip-btn"
                                onClick={handleSupport}
                                aria-label="Support us"
                                data-tooltip="Support"
                            >
                                <DollarSign size={16} />
                            </button>

                            {/* <button
                                className="header-btn tooltip-btn"
                                onClick={onToggleTheme}
                                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                data-tooltip={isDarkMode ? 'Light mode' : 'Dark mode'}
                            >
                                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                            </button> */}

                            <button
                                className="header-btn expand-btn tooltip-btn"
                                onClick={() => setIsExpanded(!isExpanded)}
                                aria-label={isExpanded ? 'Minimize' : 'Expand'}
                                data-tooltip={isExpanded ? 'Minimize' : 'Genres'}
                            >
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Main Player Content */}
                    <div className="player-main">
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
                                    <h2 className="station-name">World Radio</h2>
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
                                        className="control-btn stop-btn tooltip-btn"
                                        onClick={onStop}
                                        aria-label="Stop"
                                        data-tooltip="Stop"
                                    >
                                        <Square size={18} />
                                    </button>

                                    <button
                                        className={`control-btn play-btn tooltip-btn ${isLoading ? 'loading' : ''}`}
                                        onClick={onTogglePlay}
                                        disabled={isLoading}
                                        aria-label={isPlaying ? 'Pause' : 'Play'}
                                        data-tooltip={isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
                                    >
                                        {isLoading ? (
                                            <div className="spinner" />
                                        ) : isPlaying ? (
                                            <Pause size={10} />
                                        ) : (
                                            <Play size={10} />
                                        )}
                                    </button>
                                </>
                            )}

                            {/* Volume Control */}
                            <div className="volume-control">
                                <button
                                    className="control-btn volume-btn tooltip-btn"
                                    onClick={() => onVolumeChange(volume > 0 ? 0 : 0.7)}
                                    aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                                    data-tooltip={volume === 0 ? 'Unmute' : 'Mute'}
                                >
                                    {volume === 0 ? (
                                        <VolumeX size={10} />
                                    ) : volume < 0.5 ? (
                                        <Volume1 size={10} />
                                    ) : (
                                        <Volume2 size={10} />
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

                    {/* Expanded Content - Station Tags */}
                    {station && station.tags && (
                        <div className="player-expanded-content">
                            <div className="station-tags">
                                <h3 className="tags-title">Station Tags</h3>
                                <div className="tags-list">
                                    {station.tags.split(',').slice(0, 6).map((tag, i) => (
                                        <span key={i} className="tag-chip">{tag.trim()}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
