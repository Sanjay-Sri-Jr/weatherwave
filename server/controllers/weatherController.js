import asyncHandler     from '../utils/asyncHandler.js';
import * as weatherService from '../services/weatherService.js';
import * as userService    from '../services/userService.js';

/**
 * GET /api/weather/city/:city
 * Fetch current weather + forecast for a city name.
 */
export const getWeatherByCity = asyncHandler(async (req, res) => {
  const { city } = req.params; // already sanitized by validator

  const data = await weatherService.getWeatherByCity(city);

  // Fire-and-forget: save history without blocking the response
  userService.saveSearchHistory(req.user._id, {
    city,
    country: data.currentWeather?.sys?.country || '',
    state: '',
    lat: data.currentWeather?.coord?.lat,
    lon: data.currentWeather?.coord?.lon,
  }).catch(() => {});

  res.status(200).json({ success: true, ...data });
});

/**
 * GET /api/weather/coords?lat=&lon=
 * Fetch weather by geographic coordinates.
 */
export const getWeatherByCoords = asyncHandler(async (req, res) => {
  const { lat, lon, city, state, country } = req.query;

  const data = await weatherService.getWeatherByCoords(lat, lon);
  // Ensure `state` (if provided by the client) is attached to the weather payload
  // so the frontend can display the state next to the city when available.
  data.currentWeather = data.currentWeather || {};
  data.currentWeather.sys = data.currentWeather.sys || {};
  data.currentWeather.sys.state = state || data.currentWeather.sys.state || '';

  // Save city name from coords result to history
  userService.saveSearchHistory(req.user._id, {
    city: city || data.currentWeather?.name || '',
    country: country || data.currentWeather?.sys?.country || '',
    state: state || data.currentWeather?.sys?.state || '',
    lat: data.currentWeather?.coord?.lat ?? Number(lat),
    lon: data.currentWeather?.coord?.lon ?? Number(lon),
  }).catch(() => {});

  res.status(200).json({ success: true, ...data });
});

/**
 * GET /api/weather/search?q=
 * Return city name autocomplete suggestions.
 */
export const searchCities = asyncHandler(async (req, res) => {
  const { q } = req.query;

  const suggestions = await weatherService.searchCitySuggestions(q);

  res.status(200).json({ success: true, suggestions });
});

/**
 * GET /api/weather/history
 * Return authenticated user's search history.
 */
export const getHistory = asyncHandler(async (req, res) => {
  const history = await userService.getSearchHistory(req.user._id);

  res.status(200).json({ success: true, history });
});

/**
 * DELETE /api/weather/history
 * Clear authenticated user's search history.
 */
export const clearHistory = asyncHandler(async (req, res) => {
  await userService.clearSearchHistory(req.user._id);

  res.status(200).json({ success: true, message: 'Search history cleared.' });
});