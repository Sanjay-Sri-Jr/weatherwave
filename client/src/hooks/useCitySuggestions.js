import { useEffect, useState } from "react";
import defaultWeatherService from "../services/weatherService";

export const useCitySuggestions = ({
  service = defaultWeatherService,
  debounceMs = 300,
  minQueryLength = 3,
} = {}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < minQueryLength) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSearchLoading(true);
      setShowSuggestions(true);

      try {
        const result = await service.searchCities(query);
        const safeSuggestions = Array.isArray(result) ? result : [];

        setSuggestions(safeSuggestions);
        setShowSuggestions(safeSuggestions.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSearchLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [debounceMs, minQueryLength, query, service]);

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
