import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Earthquake } from '../types/earthquake';

interface MapProps {
  earthquakes: Earthquake[];
  selectedEarthquake: string | null;
  onEarthquakeSelect: (id: string | null) => void;
}

// Helper component to handle map center updates
function MapUpdater({ earthquake }: { earthquake: Earthquake | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (earthquake) {
      const [lng, lat] = earthquake.geometry.coordinates;
      map.setView([lat, lng], 6, { animate: true });
    }
  }, [earthquake, map]);

  return null;
}

export default function Map({ earthquakes, selectedEarthquake, onEarthquakeSelect }: MapProps) {
  const selectedEarthquakeData = earthquakes.find(eq => eq.id === selectedEarthquake);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="w-full h-full"
      style={{ minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater earthquake={selectedEarthquakeData} />
      {earthquakes.map((earthquake) => {
        const isSelected = earthquake.id === selectedEarthquake;
        const isMajor = earthquake.properties.mag >= 5;
        
        return (
          <CircleMarker
            key={earthquake.id}
            center={[
              earthquake.geometry.coordinates[1],
              earthquake.geometry.coordinates[0],
            ]}
            radius={Math.pow(2, earthquake.properties.mag) / 2}
            fillColor={isSelected ? '#4ade80' : (isMajor ? '#ff4444' : '#6366f1')}
            color={isSelected ? '#22c55e' : (isMajor ? '#ff0000' : '#4f46e5')}
            weight={isSelected ? 3 : 1}
            opacity={0.8}
            fillOpacity={0.5}
            eventHandlers={{
              click: () => onEarthquakeSelect(earthquake.id)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{earthquake.properties.title}</h3>
                <p>Magnitude: {earthquake.properties.mag}</p>
                <p>Depth: {earthquake.geometry.coordinates[2]} km</p>
                <a
                  href={earthquake.properties.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  More info
                </a>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}