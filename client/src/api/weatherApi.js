import apiClient from './apiClient';

export const getWeatherByCity = (city) =>
  apiClient.get(`/weather/city/${encodeURIComponent(city)}`);

export const getWeatherByCoords = (lat, lon, meta = {}) =>
  apiClient.get('/weather/coords', {
    params: {
      lat,
      lon,
      city: meta.city,
      state: meta.state,
      country: meta.country,
    },
  });

export const searchCities = (query) =>
  apiClient.get('/weather/search', { params: { q: query } });

export const getSearchHistory = () =>
  apiClient.get('/weather/history');