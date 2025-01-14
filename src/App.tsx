import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, X, Waves } from 'lucide-react';
import Map from './components/Map';
import EarthquakeList from './components/EarthquakeList';
import type { Earthquake } from './types/earthquake';

function App() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEarthquake, setSelectedEarthquake] = useState<string | null>(null);
  const [majorEarthquakeAlert, setMajorEarthquakeAlert] = useState<Earthquake | null>(null);
  const [tsunamiAlert, setTsunamiAlert] = useState<Earthquake | null>(null);

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
        if (!response.ok) throw new Error('Failed to fetch earthquake data');
        const data = await response.json();
        
        const majorEarthquake = data.features.find((eq: Earthquake) => eq.properties.mag >= 7);
        const tsunamiEarthquake = data.features.find((eq: Earthquake) => eq.properties.tsunami === 1);
        
        setMajorEarthquakeAlert(majorEarthquake || null);
        setTsunamiAlert(tsunamiEarthquake || null);
        
        setEarthquakes(data.features);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEarthquakes();
    const interval = setInterval(fetchEarthquakes, 300000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin mr-2">
          <Activity className="w-6 h-6" />
        </div>
        <p>Loading earthquake data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="space-y-1">
        {majorEarthquakeAlert && (
          <div className="bg-red-500 text-white px-4 py-3 relative">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  Major Earthquake Alert: Magnitude {majorEarthquakeAlert.properties.mag.toFixed(1)} near {majorEarthquakeAlert.properties.place}
                </span>
              </div>
              <button
                onClick={() => setMajorEarthquakeAlert(null)}
                className="text-white hover:text-red-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        
        {tsunamiAlert && (
          <div className="bg-orange-500 text-white px-4 py-3 relative">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center">
                <Waves className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  Tsunami Alert: Potential tsunami threat from M{tsunamiAlert.properties.mag.toFixed(1)} earthquake near {tsunamiAlert.properties.place}
                </span>
              </div>
              <button
                onClick={() => setTsunamiAlert(null)}
                className="text-white hover:text-orange-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-red-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Earthquake Monitor</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-lg shadow">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Major Earthquakes Map (M5.0+)</h2>
            </div>
            <div className="p-4">
              <Map 
                earthquakes={earthquakes} 
                selectedEarthquake={selectedEarthquake}
                onEarthquakeSelect={setSelectedEarthquake}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <EarthquakeList 
              earthquakes={earthquakes} 
              selectedEarthquake={selectedEarthquake}
              onEarthquakeSelect={setSelectedEarthquake}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;