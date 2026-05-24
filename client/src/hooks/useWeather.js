import { useCallback, useEffect, useState } from 'react';
import defaultWeatherService from '../services/weatherService';

// Restore last city from localStorage or default to 'Chennai' if not available
const getInitialCity = () =>
  localStorage.getItem('ww_lastCity') || 'Chennai';

export const useWeather = ({
  service = defaultWeatherService,
} = {}) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C');

  // Internal state setter for weather data to avoid repetition in fetch functions  
  const _applyWeatherData = ({ currentWeather: cw, forecast: fc }) => {
    setCurrentWeather(cw);
    setForecast(fc);
  };

  // Fetch by city name
  const fetchWeatherByCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);

    try {
      const data = await service.getWeatherData(city);
      _applyWeatherData(data);
      // save last searched city across sessions
      localStorage.setItem('ww_lastCity', city);
    } catch (err) {
      setError(err.message || 'Failed to load weather data.');
    } finally {
      setLoading(false);
    }
  }, [service]);

  // Fetch by geolocation 
  const fetchWeatherByLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const data = await service.getWeatherDataByCoords(latitude, longitude);
          _applyWeatherData(data);
          // Save detected city name for next session
          if (data.currentWeather?.name) {
            localStorage.setItem('ww_lastCity', data.currentWeather.name);
          }
        } catch (err) {
          setError(err.message || 'Failed to load location weather.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location access denied. Please allow location and retry.');
        setLoading(false);
      }
    );
  }, [service]);

  // Toggle temperature unit
  const toggleUnit = () =>
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));

  // Load initial city on mount 
  useEffect(() => {
    fetchWeatherByCity(getInitialCity());
  }, [fetchWeatherByCity]);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    unit,
    toggleUnit,
    fetchWeatherByCity,
    fetchWeatherByLocation,
  };
};