// server/routes/weatherRoutes.js
import express from 'express';
import {
  getWeatherByCity,
  getWeatherByCoords,
  searchCities,
  getHistory,
} from '../controllers/weatherController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All weather routes require authentication
router.use(protect);

router.get('/city/:city', getWeatherByCity);
router.get('/coords', getWeatherByCoords);
router.get('/search', searchCities);
router.get('/history', getHistory);

export default router;