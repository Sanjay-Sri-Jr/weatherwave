// server/controllers/authController.js
import * as authService from '../services/authService.js';

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic input validation at controller level
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    const result = await authService.registerUser({ name, email, password });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      ...result,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const result = await authService.loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      ...result,
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user._id);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};