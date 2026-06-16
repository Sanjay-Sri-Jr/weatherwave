import axios    from 'axios';
import ApiError from '../utils/ApiError.js';
import logger   from '../utils/logger.js';

// Private helper — build OWM base URL 
const owmUrl    = (path) => `${process.env.WEATHER_BASE_URL}${path}`;
const geoUrl    = (path) => `${process.env.GEO_URL}${path}`;
const apiKey    = ()     => process.env.WEATHER_API_KEY;

export const getWeatherByCity = async (city) => {
  logger.info(`[WeatherService] Fetching weather for city: ${city}`);

  try {
    const params = { q: city, appid: apiKey(), units: 'metric' };

    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(owmUrl('/weather'),  { params }),
      axios.get(owmUrl('/forecast'), { params }),
    ]);

    return {
      currentWeather: weatherRes.data,
      forecast: forecastRes.data,
    };
  } catch (error) {
    _handleOwmError(error, city);
  }
};

export const getWeatherByCoords = async (lat, lon) => {
  logger.info(`[WeatherService] Fetching weather for coords: ${lat}, ${lon}`);

  try {
    const params = { lat, lon, appid: apiKey(), units: 'metric' };

    const weatherRes = await axios.get(owmUrl('/weather'), { params });

    const forecastRes = await axios.get(owmUrl('/forecast'), {
      params,
    });

    return {
      currentWeather: weatherRes.data,
      forecast: forecastRes.data,
    };
  } catch (error) {
    _handleOwmError(error);
  }
};

export const searchCitySuggestions = async (query) => {
  logger.info(`[WeatherService] Searching cities: ${query}`);

  try {
    const res = await axios.get(geoUrl('/direct'), {
      params: { q: query, limit: 5, appid: apiKey() },
    });

    return res.data.map(({ name, lat, lon, country, state }) => ({
      name, lat, lon, country, state: state || '',
    }));
  } catch (error) {
    logger.error('[WeatherService] Search error:', error.message);
    throw ApiError.internal('Failed to fetch city suggestions.');
  }
};

// Private: Map OWM error codes to ApiError 
const _handleOwmError = (error, city = '') => {
  const status = error.response?.status;
  logger.error(`[WeatherService] OWM error ${status}:`, error.message);

  if (status === 404) throw ApiError.notFound(
    city ? `City "${city}" not found. Please check the name.` : 'Location not found.'
  );
  if (status === 401) throw ApiError.unauthorized('Invalid Weather API key.');
  if (status === 400) throw ApiError.badRequest('Invalid request to weather API.');
  if (status === 429) throw ApiError.tooMany('Weather API rate limit exceeded. Please retry later.');

  throw ApiError.internal('Failed to fetch weather data. Please try again.');
};