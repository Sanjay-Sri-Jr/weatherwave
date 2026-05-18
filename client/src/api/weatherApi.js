import apiClient from './apiClient';

export const getWeatherByCity = (city) =>
  apiClient.get(`/weather/city/${encodeURIComponent(city)}`);

export const getWeatherByCoords = (lat, lon) =>
  apiClient.get('/weather/coords', { params: { lat, lon } });

export const searchCities = (query) =>
  apiClient.get('/weather/search', { params: { q: query } });

export const getSearchHistory = () =>
  apiClient.get('/weather/history');