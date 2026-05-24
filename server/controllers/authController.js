import asyncHandler from '../utils/asyncHandler.js';
import * as authService from '../services/authService.js';

// POST /api/auth/signup
// Register a new user account.
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const result = await authService.registerUser({ name, email, password });

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    ...result,
  });
});

// POST /api/auth/login
// Authenticate user and return JWT.
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    ...result,
  });
});

// GET /api/auth/me
// Return authenticated user's profile.
// req.user is attached by authMiddleware.
export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user._id);

  res.status(200).json({ success: true, user });
});