import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter — 100 requests per 15 minutes per IP.
 * Applied to all routes.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      100,
  message:  { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

/**
 * Strict auth limiter — 5 attempts per 15 minutes.
 * Applied to /api/auth/login and /api/auth/signup only.
 * Prevents brute-force login attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      5,
  message:  { success: false, message: 'Too many login attempts. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders:   false,
});