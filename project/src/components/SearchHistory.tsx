import React from 'react';
import { Clock } from 'lucide-react';
import type { SearchHistoryItem } from '../types';

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelect: (city: string) => void;
}

export function SearchHistory({ history, onSelect }: SearchHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-md mt-4">
      <h3 className="text-gray-600 mb-2 flex items-center gap-2">
        <Clock size={16} />
        Recent Searches
      </h3>
      <div className="flex flex-wrap gap-2">
        {history.map((item) => (
          <button
            key={item.timestamp}
            onClick={() => onSelect(item.city)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600"
          >
            {item.city}
          </button>
        ))}
      </div>
    </div>
  );
}