import { useState, useEffect } from "react";
import { fetchCurrentWeather } from "../services/apiClient";

export const useWeather = (city) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;
    const getWeather = async () => {
      try {
        setLoading(true);
        const res = await fetchCurrentWeather(city);
        setData(res);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };
    getWeather();
  }, [city]);

  return { data, loading, error };
};