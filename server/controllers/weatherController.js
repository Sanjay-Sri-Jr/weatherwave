// server/controllers/weatherController.js
import * as weatherService from '../services/weatherService.js';

// BEFORE — returned 400 for ALL errors
// AFTER  — 400 for client errors, 500 for server errors

export const getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.params;

    console.log('[weatherController] City received:', city);

    if (!city?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'City name is required.',
      });
    }

    const data = await weatherService.getWeatherByCity(city);

    // Save history — non-blocking
    weatherService.saveSearchHistory(req.user._id, city).catch(console.error);

    return res.status(200).json({ success: true, ...data });

  } catch (error) {
    console.error('[weatherController] Error:', error.message);

    // BEFORE
    // return res.status(400).json({ success: false, message: error.message });

    // AFTER — client error vs server error
    const isClientError =
      error.message.includes('not found') ||
      error.message.includes('invalid') ||
      error.message.includes('Invalid') ||
      error.message.includes('Bad request');

    const statusCode = isClientError ? 400 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWeatherByCoords = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    console.log('[weatherController] Coords received:', lat, lon);

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required.',
      });
    }

    const data = await weatherService.getWeatherByCoords(lat, lon);

    weatherService.saveSearchHistory(req.user._id, data.currentWeather.name).catch(console.error);

    return res.status(200).json({ success: true, ...data });

  } catch (error) {
    console.error('[weatherController] Coords error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const searchCities = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Query must be at least 2 characters.',
      });
    }

    const suggestions = await weatherService.searchCitySuggestions(q);
    return res.status(200).json({ success: true, suggestions });

  } catch (error) {
    console.error('[weatherController] Search error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await weatherService.getSearchHistory(req.user._id);
    return res.status(200).json({ success: true, history });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};