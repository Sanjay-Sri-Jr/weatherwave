import { useCallback, useEffect, useState } from 'react';
import defaultWeatherService from '../services/weatherService';

const LAST_LOCATION_KEY = 'ww_lastLocation';
const LAST_CITY_KEY = 'ww_lastCity';

// Converts stored string data from localStorage back into a JSON object.
const deserializeLocation = (storedValue) => {
  if (!storedValue) return 'Chennai';

  try {
    const parsed = JSON.parse(storedValue);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {
    // Backward compatibility with the old string-only storage format.
  }

  return storedValue;
};

// Retrieves the last saved location from localStorage.
const getInitialLocation = () =>
  deserializeLocation(
    localStorage.getItem(LAST_LOCATION_KEY) || localStorage.getItem(LAST_CITY_KEY)
  );

// Converts location data into a storable string format
const serializeLocation = (location) =>
  typeof location === 'string' ? location : JSON.stringify(location);

export const useWeather = ({
  service = defaultWeatherService,
} = {}) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [forecastChartData, setForecastChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C');
  const [lastLocation, setLastLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Internal state setter for weather data to avoid repetition in fetch functions  
  const _applyWeatherData = ({ currentWeather: cw, forecast: fc, forecastChartData: chartData }) => {
    setCurrentWeather(cw);
    setForecast(fc);
    setForecastChartData(chartData);
  };

  // Fetch by city name
  const fetchWeatherByCity = useCallback(async (cityOrLocation) => {
    setLoading(true);
    setError(null);
    setLastLocation(cityOrLocation);
    setSelectedLocation(cityOrLocation);

    try {
      const data = await service.getWeatherData(cityOrLocation);
      _applyWeatherData(data);
      localStorage.setItem(LAST_LOCATION_KEY, serializeLocation(cityOrLocation));
      if (typeof cityOrLocation === 'string') {
        localStorage.setItem(LAST_CITY_KEY, cityOrLocation);
      } else if (cityOrLocation?.name) {
        localStorage.setItem(LAST_CITY_KEY, cityOrLocation.name);
      }
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
          const location = { lat: latitude, lon: longitude };
          const data = await service.getWeatherData(location);
          _applyWeatherData(data);
          setLastLocation(location);
          setSelectedLocation({
            name: data.currentWeather?.name || '',
            state: '',
            country: data.currentWeather?.sys?.country || '',
            lat: latitude,
            lon: longitude,
          });
          // Save detected city name for next session
          if (data.currentWeather?.name) {
            localStorage.setItem(LAST_LOCATION_KEY, serializeLocation(location));
            localStorage.setItem(LAST_CITY_KEY, data.currentWeather.name);
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

  const refreshWeather = useCallback(() => {
    fetchWeatherByCity(lastLocation || getInitialLocation());
  }, [fetchWeatherByCity, lastLocation]);

  // Load initial city on mount 
  useEffect(() => {
    fetchWeatherByCity(getInitialLocation());
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
    refreshWeather,
    forecastChartData,
    selectedLocation,
  };
};