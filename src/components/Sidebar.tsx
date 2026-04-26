"use client";

import { useState } from 'react';
import { COUNTRIES, CITIES } from '@/lib/data';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  selectedCities: string[];
  onCityToggle: (city: string) => void;
  onStart: () => void;
  isReady?: boolean;
}

export function Sidebar({ selectedCities, onCityToggle, onStart, isReady = true }: SidebarProps) {
  const [expandedCountries, setExpandedCountries] = useState<string[]>(['KR']);

  const toggleCountry = (countryId: string) => {
    setExpandedCountries((prev) =>
      prev.includes(countryId)
        ? prev.filter((id) => id !== countryId)
        : [...prev, countryId]
    );
  };

  return (
    <aside className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 text-gray-200 z-10">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Job Aggregator
        </h1>
        <p className="text-sm text-gray-500 mt-1">Select cities to search</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {COUNTRIES.map((country) => {
          const isExpanded = expandedCountries.includes(country.id);
          const cities = CITIES[country.id];

          return (
            <div key={country.id} className="rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCountry(country.id)}
                className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-750 transition-colors text-sm font-semibold rounded-lg"
              >
                <span>{country.name}</span>
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {isExpanded && (
                <div className="mt-1 space-y-1 pl-2">
                  {cities.map((city) => {
                    const isSelected = selectedCities.includes(city);
                    return (
                      <button
                        key={city}
                        onClick={() => onCityToggle(city)}
                        className={clsx(
                          "w-full flex items-center p-2 rounded-md text-sm transition-all duration-200",
                          isSelected
                            ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                            : "hover:bg-gray-800 text-gray-400 border border-transparent"
                        )}
                      >
                        <div className={clsx(
                          "w-4 h-4 rounded-sm border flex items-center justify-center mr-3 transition-colors",
                          isSelected ? "bg-indigo-500 border-indigo-500" : "border-gray-600"
                        )}>
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                        {city}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onStart}
          disabled={!isReady}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg font-medium shadow-lg transition-all transform active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {isReady ? `Start Search (${selectedCities.length})` : 'Enter API Key & Select Cities'}
        </button>
      </div>
    </aside>
  );
}
