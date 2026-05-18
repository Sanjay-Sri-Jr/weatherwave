import ApiError from '../utils/ApiError.js';

/**
 * Validate city name param.
 * Rules: must be a non-empty string, max 100 chars.
 */
export const validateCity = (req, res, next) => {
  const { city } = req.params;

  if (!city?.trim()) {
    return next(ApiError.badRequest('City name is required.'));
  }
  if (city.trim().length > 100) {
    return next(ApiError.badRequest('City name is too long.'));
  }

  // Sanitize — trim whitespace
  req.params.city = city.trim();
  next();
};

/**
 * Validate coordinates query params.
 * Rules: lat and lon must be valid numbers in correct range.
 */
export const validateCoords = (req, res, next) => {
  const { lat, lon } = req.query;
  const errors = [];

  if (!lat || !lon) {
    return next(ApiError.badRequest('Latitude and longitude are required.'));
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (isNaN(latNum) || latNum < -90  || latNum > 90)
    errors.push('Latitude must be between -90 and 90.');
  if (isNaN(lonNum) || lonNum < -180 || lonNum > 180)
    errors.push('Longitude must be between -180 and 180.');

  if (errors.length > 0) {
    return next(ApiError.badRequest(errors.join(' ')));
  }

  next();
};
/**
 * Validate city search query param.
 * Rules: q must be at least 2 characters.
 */
export const validateSearchQuery = (req, res, next) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return next(ApiError.badRequest('Search query must be at least 2 characters.'));
  }

  next();
};