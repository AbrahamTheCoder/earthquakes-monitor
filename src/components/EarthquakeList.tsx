import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import type { Earthquake } from '../types/earthquake';

interface EarthquakeListProps {
  earthquakes: Earthquake[];
  selectedEarthquake: string | null;
  onEarthquakeSelect: (id: string | null) => void;
}

type SortField = 'time' | 'place' | 'mag';
type SortDirection = 'asc' | 'desc';

export default function EarthquakeList({ earthquakes, selectedEarthquake, onEarthquakeSelect }: EarthquakeListProps) {
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedEarthquakes = earthquakes
    .filter(eq => eq.properties.mag < 5)
    .sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      
      switch (sortField) {
        case 'time':
          return (a.properties.time - b.properties.time) * multiplier;
        case 'place':
          return a.properties.place.localeCompare(b.properties.place) * multiplier;
        case 'mag':
          return (a.properties.mag - b.properties.mag) * multiplier;
        default:
          return 0;
      }
    })
    .slice(0, 100);

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <ArrowUpDown className={`w-4 h-4 transition-opacity ${
          sortField === field ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        }`} />
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-full">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Recent Minor Earthquakes</h2>
      </div>
      <div className="overflow-auto max-h-[calc(100vh-200px)]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <SortHeader field="time" label="Time" />
              <SortHeader field="place" label="Location" />
              <SortHeader field="mag" label="Magnitude" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEarthquakes.map((earthquake) => (
              <tr 
                key={earthquake.id} 
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedEarthquake === earthquake.id ? 'bg-green-50' : ''
                }`}
                onClick={() => onEarthquakeSelect(
                  selectedEarthquake === earthquake.id ? null : earthquake.id
                )}
              >
                <td className="px-6 py-4 text-sm text-gray-500 w-[180px]">
                  {format(new Date(earthquake.properties.time), 'PPp')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {earthquake.properties.place}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 w-[100px] text-center">
                  {earthquake.properties.mag.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}