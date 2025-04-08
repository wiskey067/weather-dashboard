import React from 'react';
import { Cloud, Droplets, Wind } from 'lucide-react';
import type { WeatherData } from '../types';

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{data.name}</h2>
        <img
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
          alt={data.weather[0].description}
          className="w-16 h-16"
        />
      </div>
      
      <div className="mb-4">
        <div className="text-5xl font-bold text-gray-900 mb-2">
          {Math.round(data.main.temp)}°C
        </div>
        <div className="text-gray-600 capitalize">
          {data.weather[0].description}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Droplets size={20} />
          <span>Humidity: {data.main.humidity}%</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Wind size={20} />
          <span>Wind: {Math.round(data.wind.speed)} km/h</span>
        </div>
      </div>
    </div>
  );
}