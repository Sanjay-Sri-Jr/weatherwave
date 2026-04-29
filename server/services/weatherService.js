// server/services/weatherService.js
import axios from 'axios';
import User from '../models/User.js';

const BASE_URL = process.env.WEATHER_BASE_URL;
const API_KEY = process.env.WEATHER_API_KEY;
const GEO_URL = process.env.GEO_URL;

// Fetch current weather + forecast for a city
export const getWeatherByCity = async (city) => {
  try {
    const encodedCity = encodeURIComponent(city);

    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(`${BASE_URL}/weather?q=${encodedCity}&appid=${API_KEY}&units=metric`),
      axios.get(`${BASE_URL}/forecast?q=${encodedCity}&appid=${API_KEY}&units=metric`),
    ]);

    return {
      currentWeather: weatherRes.data,
      forecast: forecastRes.data,
    };
  } catch (error) {
    // Translate Axios errors into clean messages
    if (error.response?.status === 404) {
      throw new Error(`City "${city}" not found. Please check the name and try again.`);
    }
    if (error.response?.status === 401) {
      throw new Error('Weather API key is invalid.');
    }
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
};

// Fetch weather by coordinates
export const getWeatherByCoords = async (lat, lon) => {
  try {
    const weatherRes = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const city = weatherRes.data.name;
    const forecastRes = await axios.get(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    return {
      currentWeather: weatherRes.data,
      forecast: forecastRes.data,
    };
  } catch (error) {
    if (error.response?.status === 401) throw new Error('Weather API key is invalid.');
    throw new Error('Failed to fetch weather data by location.');
  }
};

// Search city suggestions
export const searchCitySuggestions = async (query) => {
  try {
    const res = await axios.get(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );

    return res.data.map((city) => ({
      name: city.name,
      lat: city.lat,
      lon: city.lon,
      country: city.country,
      state: city.state || '',
    }));
  } catch (error) {
    throw new Error('Failed to fetch city suggestions.');
  }
};

// Save city to user's search history
export const saveSearchHistory = async (userId, city) => {
  try {
    // Keep only last 10 searches, avoid duplicates
    const user = await User.findById(userId);

    // Remove existing entry if city was searched before
    user.searchHistory = user.searchHistory.filter(
      (entry) => entry.city.toLowerCase() !== city.toLowerCase()
    );

    // Add new entry at the beginning
    user.searchHistory.unshift({ city, searchedAt: new Date() });

    // Keep max 10 searches
    if (user.searchHistory.length > 10) {
      user.searchHistory = user.searchHistory.slice(0, 10);
    }

    await user.save();
    return user.searchHistory;
  } catch (error) {
    throw new Error('Failed to save search history.');
  }
};

// Get user's search history
export const getSearchHistory = async (userId) => {
  const user = await User.findById(userId).select('searchHistory');
  return user?.searchHistory || [];
};