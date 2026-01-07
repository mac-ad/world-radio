import { useState, useRef, useEffect } from 'react';
import type { RadioStation } from '../types/radio';

interface SearchBarProps {
    stations: RadioStation[];
    onStationSelect: (station: RadioStation) => void;
}

export function SearchBar({ stations, onStationSelect }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const filteredStations = query.length >= 2
        ? stations.filter(station => {
            const searchTerm = query.toLowerCase();
            return (
                station.name.toLowerCase().includes(searchTerm) ||
                station.city?.toLowerCase().includes(searchTerm) ||
                station.state?.toLowerCase().includes(searchTerm) ||
                station.countrycode?.toLowerCase().includes(searchTerm) ||
                station.tags?.toLowerCase().includes(searchTerm)
            );
        }).slice(0, 8)
        : [];

    useEffect(() => {
        setHighlightedIndex(-1);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                resultsRef.current &&
                !resultsRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (station: RadioStation) => {
        onStationSelect(station);
        setQuery('');
        setIsOpen(false);
        inputRef.current?.blur();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev =>
                prev < filteredStations.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            handleSelect(filteredStations[highlightedIndex]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    const getLocation = (station: RadioStation) => {
        return [station.city, station.state, station.countrycode]
            .filter(Boolean)
            .join(', ');
    };

    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    placeholder="Search stations, cities, countries..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                />
                {query && (
                    <button
                        className="search-clear"
                        onClick={() => {
                            setQuery('');
                            inputRef.current?.focus();
                        }}
                        aria-label="Clear search"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                )}
            </div>

            {isOpen && filteredStations.length > 0 && (
                <div ref={resultsRef} className="search-results">
                    {filteredStations.map((station, index) => (
                        <button
                            key={station.stationuuid}
                            className={`search-result-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                            onClick={() => handleSelect(station)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            {station.favicon && (
                                <img
                                    src={station.favicon}
                                    alt=""
                                    className="result-favicon"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            )}
                            <div className="result-info">
                                <span className="result-name">{station.name}</span>
                                <span className="result-location">{getLocation(station) || 'Unknown location'}</span>
                            </div>
                            <svg className="result-play-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                    ))}
                </div>
            )}

            {isOpen && query.length >= 2 && filteredStations.length === 0 && (
                <div ref={resultsRef} className="search-results">
                    <div className="search-no-results">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <span>No stations found for "{query}"</span>
                    </div>
                </div>
            )}
        </div>
    );
}

