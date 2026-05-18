import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Protect middleware — must be applied to any route
 * that requires authentication.
 *
 * Usage in routes:
 *   router.use(protect);
 *   or
 *   router.get('/path', protect, controller);
 */
const protect = asyncHandler(async (req, res, next) => {
  // 1. Extract token from header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  // 2. Verify signature and expiry
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Session expired. Please log in again.');
    }
    throw ApiError.unauthorized('Invalid token. Please log in again.');
  }

  // 3. Confirm user still exists in DB
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    throw ApiError.unauthorized('User account no longer exists.');
  }

  // 4. Attach user to request for controllers/services
  req.user = user;
  next();
});

export default protect;