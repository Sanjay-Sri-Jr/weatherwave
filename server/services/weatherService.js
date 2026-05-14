// server/services/weatherService.js
import axios from 'axios';
import User from '../models/User.js';

export const getWeatherByCity = async (city) => {
  try {
    const BASE_URL = process.env.WEATHER_BASE_URL;
    const API_KEY  = process.env.WEATHER_API_KEY;

    console.log('[weatherService] BASE_URL:', BASE_URL);
    console.log('[weatherService] API_KEY exists:', !!API_KEY);
    console.log('[weatherService] Fetching city:', city);

    const encodedCity = encodeURIComponent(city);

    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(`${BASE_URL}/weather?q=${encodedCity}&appid=${API_KEY}&units=metric`),
      axios.get(`${BASE_URL}/forecast?q=${encodedCity}&appid=${API_KEY}&units=metric`),
    ]);

    return {
      currentWeather: weatherRes.data,
      forecast:       forecastRes.data,
    };

  } catch (error) {
    console.error('[weatherService] Error:', error.response?.status, error.message);

    const status = error.response?.status;
    if (status === 404) throw new Error(`City "${city}" not found. Please check the name and try again.`);
    if (status === 401) throw new Error('Invalid Weather API key. Check WEATHER_API_KEY in .env');
    if (status === 400) throw new Error(`Bad request to weather API. City "${city}" may be invalid.`);
    if (status === 429) throw new Error('Weather API rate limit exceeded. Please try again later.');

    throw new Error('Failed to fetch weather data. Please try again later.');
  }
};

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const BASE_URL = process.env.WEATHER_BASE_URL;
    const API_KEY  = process.env.WEATHER_API_KEY;

    console.log('[weatherService] Fetching by coords:', lat, lon);

    const weatherRes = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const city = weatherRes.data.name;
    const forecastRes = await axios.get(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    return {
      currentWeather: weatherRes.data,
      forecast:       forecastRes.data,
    };

  } catch (error) {
    console.error('[weatherService] Coords error:', error.response?.status, error.message);
    const status = error.response?.status;
    if (status === 401) throw new Error('Invalid Weather API key.');
    if (status === 400) throw new Error('Invalid coordinates provided.');
    throw new Error('Failed to fetch weather data by location.');
  }
};

export const searchCitySuggestions = async (query) => {
  try {
    const API_KEY = process.env.WEATHER_API_KEY;
    const GEO_URL = process.env.GEO_URL;

    console.log('[weatherService] Searching cities for:', query);

    const res = await axios.get(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );

    return res.data.map((city) => ({
      name:    city.name,
      lat:     city.lat,
      lon:     city.lon,
      country: city.country,
      state:   city.state || '',
    }));

  } catch (error) {
    console.error('[weatherService] Search error:', error.response?.status, error.message);
    throw new Error('Failed to fetch city suggestions.');
  }
};

export const saveSearchHistory = async (userId, city) => {
  try {
    const user = await User.findById(userId);
    user.searchHistory = user.searchHistory.filter(
      (entry) => entry.city.toLowerCase() !== city.toLowerCase()
    );
    user.searchHistory.unshift({ city, searchedAt: new Date() });
    if (user.searchHistory.length > 10) {
      user.searchHistory = user.searchHistory.slice(0, 10);
    }
    await user.save();
    return user.searchHistory;
  } catch (error) {
    throw new Error('Failed to save search history.');
  }
};

export const getSearchHistory = async (userId) => {
  const user = await User.findById(userId).select('searchHistory');
  return user?.searchHistory || [];
};