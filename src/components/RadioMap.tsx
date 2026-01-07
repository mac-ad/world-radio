
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { RadioStation } from '../types/radio';

interface RadioMapProps {
    stations: RadioStation[];
    isDarkMode: boolean;
    onStationSelect: (station: RadioStation) => void;
    selectedStation: RadioStation | null;
}

// Free map styles
const MAP_STYLES = {
    light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
};

export function RadioMap({ stations, isDarkMode, onStationSelect, selectedStation }: RadioMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    // const markersRef = useRef<maplibregl.Marker[]>([]);
    const popupRef = useRef<maplibregl.Popup | null>(null);

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light,
            center: [0, 20],
            zoom: 2,
            attributionControl: false,
        });

        map.current.addControl(
            new maplibregl.NavigationControl({ showCompass: false }),
            'top-right'
        );

        map.current.addControl(
            new maplibregl.AttributionControl({ compact: true }),
            'bottom-right'
        );

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    useEffect(() => {
        if (!map.current) return;

        map.current.setStyle(isDarkMode ? MAP_STYLES.dark : MAP_STYLES.light);
    }, [isDarkMode])



    useEffect(() => {
        if (!map || !map.current || stations.length === 0) return;

        const source = map.current.getSource("stations");

        const data: GeoJSON.FeatureCollection<GeoJSON.Point, RadioStation> = {
            type: "FeatureCollection",
            features: stations.map(station => ({
                type: "Feature",
                id: station.stationuuid,
                geometry: {
                    type: "Point",
                    coordinates: [station.geo_long, station.geo_lat],
                },
                properties: station,
            })),
        };

        const addStations = () => {
            map.current?.addSource("stations", {
                type: 'geojson',
                data,
            });

            map.current?.addLayer({
                id: 'stations',
                type: 'circle',
                source: 'stations',
                paint: {
                    'circle-color': '#fff',
                    'circle-radius': 6,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#000',
                },
            });

            map.current?.on("click", "stations", (e) => {
                const feature = e.features?.[0];

                console.log("feature", feature);

                if (!feature) return;

                onStationSelect(feature.properties as RadioStation);
            })
        }

        if (!source) {
            addStations();
        }
    }, [stations]);

    // Show popup for selected station
    useEffect(() => {
        if (!map.current) return;

        // Remove existing popup
        if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
        }

        if (selectedStation) {
            const tags = selectedStation.tags?.split(',').slice(0, 3).join(', ') || 'Radio';
            const location = [selectedStation.city, selectedStation.state, selectedStation.countrycode]
                .filter(Boolean)
                .join(', ');

            popupRef.current = new maplibregl.Popup({
                closeButton: true,
                closeOnClick: false,
                offset: 25,
                className: 'station-popup',
            })
                .setLngLat([selectedStation.geo_long, selectedStation.geo_lat])
                .setHTML(`
          <div class="popup-content">
            ${selectedStation.favicon ? `<img src="${selectedStation.favicon}" alt="" class="popup-favicon" onerror="this.style.display='none'" />` : ''}
            <div class="popup-info">
              <h3>${selectedStation.name}</h3>
              <p class="popup-location">${location || 'Unknown location'}</p>
              <p class="popup-tags">${tags}</p>
            </div>
          </div>
        `)
                .addTo(map.current);

            // Pan to selected station
            map.current.flyTo({
                center: [selectedStation.geo_long, selectedStation.geo_lat],
                zoom: Math.max(map.current.getZoom(), 5),
                duration: 1000,
            });
        }
    }, [selectedStation]);

    return <div ref={mapContainer} className="map-container" />;
}

