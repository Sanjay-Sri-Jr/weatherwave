// server/controllers/weatherController.js
import * as weatherService from '../services/weatherService.js';

// GET /api/weather/city/:city  (protected)
export const getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city?.trim()) {
      return res.status(400).json({ success: false, message: 'City name is required.' });
    }

    const data = await weatherService.getWeatherByCity(city);

    // Save to history (non-blocking — don't fail weather fetch if history save fails)
    weatherService.saveSearchHistory(req.user._id, city).catch(console.error);

    return res.status(200).json({ success: true, ...data });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/weather/coords?lat=xx&lon=yy  (protected)
export const getWeatherByCoords = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required.' });
    }

    const data = await weatherService.getWeatherByCoords(lat, lon);

    weatherService.saveSearchHistory(req.user._id, data.currentWeather.name).catch(console.error);

    return res.status(200).json({ success: true, ...data });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/weather/search?q=london  (protected)
export const searchCities = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ success: false, message: 'Query must be at least 2 characters.' });
    }

    const suggestions = await weatherService.searchCitySuggestions(q);
    return res.status(200).json({ success: true, suggestions });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/weather/history  (protected)
export const getHistory = async (req, res) => {
  try {
    const history = await weatherService.getSearchHistory(req.user._id);
    return res.status(200).json({ success: true, history });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};