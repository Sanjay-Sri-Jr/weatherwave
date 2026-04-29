import { useCallback, useEffect, useState } from "react";
import defaultWeatherService from "../services/weatherService";

export const useWeather = ({
  initialCity = "Chennai",
  service = defaultWeatherService,
} = {}) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C");

  const setWeatherState = ({ currentWeather: nextWeather, forecast: nextForecast }) => {
    setCurrentWeather(nextWeather);
    setForecast(nextForecast);
  };

  const fetchWeatherByCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);

    try {
      const data = await service.getWeatherData(city);
      setWeatherState(data);
    } catch (err) {
      setError(err.message || "Failed to load weather data");
    } finally {
      setLoading(false);
    }
  }, [service]);

  const fetchWeatherByLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await service.getWeatherDataByCoords(latitude, longitude);
          setWeatherState(data);
        } catch (err) {
          setError(err.message || "Failed to load weather data");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Failed to get your location. Please allow location access and try again.");
        setLoading(false);
      }
    );
  }, [service]);

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  useEffect(() => {
    fetchWeatherByCity(initialCity);
  }, [fetchWeatherByCity, initialCity]);

  return { currentWeather, forecast, loading, error, unit, toggleUnit, fetchWeatherByCity, fetchWeatherByLocation };
};