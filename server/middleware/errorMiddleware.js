import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/**
 * Global error handling middleware.
 * Must be registered LAST in server/index.js after all routes.
 */
const errorMiddleware = (err, req, res, next) => {
  // Default to 500 if no statusCode on error
  const statusCode = err.statusCode || 500;
  const isApiError = err.name === 'ApiError';

  // Log all errors 
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.path} — ${err.message}`, err.stack);
  } else {
    logger.warn(`[${req.method}] ${req.path} — ${statusCode} ${err.message}`);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message).join(' ');
    return res.status(400).json({ success: false, message: messages });
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `An account with this ${field} already exists.`,
    });
  }

  // Standard response for all other errors
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred.',
    // Only include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorMiddleware;