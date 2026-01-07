import { useState, useCallback } from 'react';
import { RadioMap } from './components/RadioMap';
import { RadioPlayer } from './components/RadioPlayer';
import { SearchBar } from './components/SearchBar';
import { useRadioStations } from './hooks/useRadioStations';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import type { RadioStation } from './types/radio';
import './App.css';
import { Radio } from 'lucide-react';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { stations, loading, error: fetchError } = useRadioStations();
  const {
    station: currentStation,
    isPlaying,
    isLoading: audioLoading,
    volume,
    error: audioError,
    analyserNode,
    playStation,
    togglePlay,
    setVolume,
    stop,
  } = useAudioPlayer();

  const handleStationSelect = useCallback((station: RadioStation) => {
    playStation(station);
  }, [playStation]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
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

      {/* Map */}
      <RadioMap
        stations={stations}
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
        analyserNode={analyserNode}
        onTogglePlay={togglePlay}
        onVolumeChange={setVolume}
        onStop={stop}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Station Count Badge */}
      {!loading && stations.length > 0 && (
        <div className="station-count">
          <Radio />
          <span>{stations.length} stations</span>
        </div>
      )}
    </div>
  );
}

export default App;
