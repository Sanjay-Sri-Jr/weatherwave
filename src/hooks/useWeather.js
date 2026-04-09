import { useState, useEffect } from "react";
import { getCurrentWeather, getCurrentWeatherByCoords, getWeatherForecast } from "../services/apiClient";

export const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C");

  const fetchWeatherByCity = async (city) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecast] = await Promise.all(
        [
          getCurrentWeather(city),
          getWeatherForecast(city)
        ]);
      setCurrentWeather(weatherData);
      setForecast(forecast);
    } catch (err) {
      setError(err.message || "Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };


  const fetchWeatherByLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const weatherData = await getCurrentWeatherByCoords(latitude, longitude);
        setCurrentWeather(weatherData); 

        const forecastData = await getWeatherForecast(weatherData.name);
        setForecast(forecastData);
      } catch (err) {
        setError(err.message || "Failed to load weather data");
      }
      finally {
        setLoading(false);
      }
    }, (error) => {
      setError("Failed to get your location. Please allow location access and try again.");
      setLoading(false);
    }
  );
  };
  const toggleUnit = () => {
    setUnit(unit === "C" ? "F" : "C"); 
  };

  useEffect(() => {
    fetchWeatherByCity("Chennai");
  }, []);

  return { currentWeather, forecast, loading, error, unit, toggleUnit, fetchWeatherByCity, fetchWeatherByLocation };
  
}; 