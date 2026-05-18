import { useEffect, useState } from 'react';
import defaultWeatherService from '../services/weatherService';

export const useCitySuggestions = ({
  service      = defaultWeatherService,
  debounceMs   = 300,
  minQueryLen  = 3,
} = {}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Skip API call if query too short
    if (query.length < minQueryLen) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setShowSuggestions(true);

      try {
        const results = await service.searchCities(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSearchLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, service, debounceMs, minQueryLen]);

  const clearSuggestions = () => {
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return {
    query,
    setQuery,
    suggestions,
    searchLoading,
    showSuggestions,
    setShowSuggestions,
    clearSuggestions,
  };
};