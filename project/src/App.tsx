import React, { useState, useCallback } from 'react';
import { Cloud, AlertCircle } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { SearchHistory } from './components/SearchHistory';
import type { WeatherData, SearchHistoryItem } from './types';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const addToHistory = (city: string) => {
    setSearchHistory((prev) => {
      const newHistory = [
        { city, timestamp: Date.now() },
        ...prev.filter((item) => item.city.toLowerCase() !== city.toLowerCase()),
      ].slice(0, 5);
      return newHistory;
    });
  };

  const fetchWeather = useCallback(async (city: string) => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weather?city=${encodeURIComponent(
          city.trim()
        )}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      console.log('Weather Data:', data);
      setWeather(data);
      addToHistory(city);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <div className="flex items-center gap-2 mb-8">
          <Cloud className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Weather Dashboard</h1>
        </div>

        <SearchBar onSearch={fetchWeather} isLoading={loading} />
        <SearchHistory history={searchHistory} onSelect={fetchWeather} />

        <div className="mt-8 w-full flex justify-center">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
              Loading...
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg">
              <AlertCircle size={20} />
              {error}
            </div>
          ) : weather ? (
            <WeatherCard data={weather} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;