class ApiError extends Error {

  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = 'ApiError';

    // Preserve the original stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  // ── Named constructors for common errors ──────────────────
  static badRequest(message) { return new ApiError(message, 400); }
  static unauthorized(message) { return new ApiError(message, 401); }
  static forbidden(message) { return new ApiError(message, 403); }
  static notFound(message) { return new ApiError(message, 404); }
  static tooMany(message) { return new ApiError(message, 429); }
  static internal(message) { return new ApiError(message, 500, false); }
}

export default ApiError;