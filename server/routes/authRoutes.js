import express from 'express';
import { signup, login, getMe }           from '../controllers/authController.js';
import { validateSignup, validateLogin }  from '../validators/authValidator.js';
import protect                            from '../middleware/authMiddleware.js';
import { authLimiter }                    from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Public routes — strict rate limit applied
router.post('/signup', authLimiter, validateSignup, signup);
router.post('/login',  authLimiter, validateLogin,  login);

// Protected route
router.get('/me', protect, getMe);

export default router;