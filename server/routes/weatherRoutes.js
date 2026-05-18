import express from 'express';
import {getWeatherByCity, getWeatherByCoords,searchCities, getHistory, clearHistory,} from '../controllers/weatherController.js';
import {validateCity, validateCoords, validateSearchQuery,} from '../validators/weatherValidator.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All weather routes require authentication
router.use(protect);

router.get('/city/:city',validateCity, getWeatherByCity);
router.get('/coords',validateCoords,getWeatherByCoords);
router.get('/search', validateSearchQuery,searchCities);
router.get('/history', getHistory);
router.delete('/history', clearHistory);

export default router;