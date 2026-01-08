import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { RadioMap } from './components/RadioMap';
import { RadioPlayer } from './components/RadioPlayer';
import { SearchBar } from './components/SearchBar';
import { SocialFloat } from './components/SocialFloat';
import { useRadioStations } from './hooks/useRadioStations';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import type { RadioStation } from './types/radio';
import { GENRES } from './types/radio';
import './App.css';
import { Radio, Loader2 } from 'lucide-react';
import { useCloudflare } from './hooks/useCloudflare';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const { stations, loading, loadingMore, error: fetchError } = useRadioStations();
  const {
    station: currentStation,
    isPlaying,
    isLoading: audioLoading,
    volume,
    error: audioError,
    playStation,
    togglePlay,
    setVolume,
    stop,
  } = useAudioPlayer();

  useCloudflare();

  // Track if we've successfully loaded the station from URL
  const hasFoundStationFromUrl = useRef(false);
  const initialStationUuid = useRef<string | null>(null);

  // Capture the initial station UUID from URL on first render
  useEffect(() => {
    if (initialStationUuid.current === null) {
      const urlParams = new URLSearchParams(window.location.search);
      initialStationUuid.current = urlParams.get('station_uuid') || '';
    }
  }, []);

  // Load station from URL parameter - keep trying as more batches load
  useEffect(() => {
    // Skip if no UUID in URL, or if we already found and played the station
    if (!initialStationUuid.current || hasFoundStationFromUrl.current) return;

    // Wait for at least some stations to be available
    if (stations.length === 0) return;

    const stationUuid = initialStationUuid.current;
    const station = stations.find(s => s.stationuuid === stationUuid);

    if (station) {
      // Found the station! Play it and stop searching
      playStation(station);
      hasFoundStationFromUrl.current = true;
    }
    // If not found, we'll keep trying as more stations load (loadingMore changes)
  }, [stations, playStation]);

  // Mark as done searching when all loading completes (even if station not found)
  useEffect(() => {
    if (!loading && !loadingMore && initialStationUuid.current) {
      hasFoundStationFromUrl.current = true;
    }
  }, [loading, loadingMore]);

  // Update URL when station changes (but only after initial URL processing is done)
  useEffect(() => {
    // Don't update URL until we've finished processing initial URL
    if (!hasFoundStationFromUrl.current && initialStationUuid.current) return;

    const url = new URL(window.location.href);

    if (currentStation) {
      url.searchParams.set('station_uuid', currentStation.stationuuid);
    } else {
      url.searchParams.delete('station_uuid');
    }

    // Update URL without triggering a page reload
    window.history.replaceState({}, '', url.toString());
  }, [currentStation]);

  // Filter stations by selected genre
  const filteredStations = useMemo(() => {
    if (selectedGenre === 'all') return stations;

    const genre = GENRES.find(g => g.id === selectedGenre);
    if (!genre || genre.tags.length === 0) return stations;

    return stations.filter(station => {
      const stationTags = (station.tags || '').toLowerCase();
      return genre.tags.some(tag => stationTags.includes(tag.toLowerCase()));
    });
  }, [stations, selectedGenre]);

  const handleStationSelect = useCallback((station: RadioStation) => {
    playStation(station);
  }, [playStation]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleGenreChange = useCallback((genre: string) => {
    setSelectedGenre(genre);
  }, []);

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner" />
            <p>Tuning into the world...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {fetchError && (
        <div className="error-toast">
          <p>Failed to load radio stations. Please refresh the page.</p>
        </div>
      )}

      {/* Search Bar */}
      {!loading && (
        <SearchBar
          stations={stations}
          onStationSelect={handleStationSelect}
        />
      )}

      {/* Map - uses filtered stations */}
      <RadioMap
        stations={filteredStations}
        isDarkMode={isDarkMode}
        onStationSelect={handleStationSelect}
        selectedStation={currentStation}
      />

      {/* Radio Player Panel */}
      <RadioPlayer
        station={currentStation}
        isPlaying={isPlaying}
        isLoading={audioLoading}
        volume={volume}
        error={audioError}
        onTogglePlay={togglePlay}
        onVolumeChange={setVolume}
        onStop={stop}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        selectedGenre={selectedGenre}
        onGenreChange={handleGenreChange}
      />

      {/* Station Count Badge */}
      {!loading && filteredStations.length > 0 && (
        <div className={`station-count ${loadingMore ? 'loading-more' : ''}`}>
          {loadingMore ? (
            <Loader2 size={16} className="spin-icon" />
          ) : (
            <Radio size={16} />
          )}
          <span>
            {selectedGenre !== 'all'
              ? `${filteredStations.length} ${GENRES.find(g => g.id === selectedGenre)?.name || ''} stations`
              : `${stations.length} stations`
            }
            {loadingMore && '...'}
          </span>
        </div>
      )}

      {/* Social Links & Support */}
      <SocialFloat isDarkMode={isDarkMode} />
    </div>
  );
}

export default App;
