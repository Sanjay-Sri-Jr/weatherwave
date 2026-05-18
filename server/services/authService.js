import bcrypt   from 'bcryptjs';
import jwt      from 'jsonwebtoken';
import User     from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import logger   from '../utils/logger.js';

// ── Private helper — not exported ─────────────────────────────
const generateToken = (userId) =>
  jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// ── Format user for API response ──────────────────────────────
const formatUser = (user) => ({
  id:    user._id,
  name:  user.name,
  email: user.email,
});

/**
 * Register a new user account.
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<{ token: string, user: Object }>}
 * @throws {ApiError} 400 if email already registered
 */
export const registerUser = async ({ name, email, password }) => {
  // Check for existing account
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.badRequest('An account with this email already exists.');
  }

  // Hash password — 12 rounds is strong and within acceptable time
  const hashedPassword = await bcrypt.hash(password, 12);

  const user  = await User.create({ name, email, password: hashedPassword });
  const token = generateToken(user._id);

  logger.info(`New user registered: ${email}`);

  return { token, user: formatUser(user) };
};

/**
 * Authenticate a user and return a JWT.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: Object }>}
 * @throws {ApiError} 401 for invalid credentials
 */
export const loginUser = async ({ email, password }) => {
  // Must select password explicitly (select: false on schema)
  const user = await User.findOne({ email }).select('+password');

  // Generic message — never reveal whether email exists or not
  const invalidCredentialsError = ApiError.unauthorized('Invalid email or password.');

  if (!user) throw invalidCredentialsError;

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw invalidCredentialsError;

  const token = generateToken(user._id);

  logger.info(`User logged in: ${email}`);

  return { token, user: formatUser(user) };
};

/**
 * Fetch a user's profile by ID.
 * @param {string} userId
 * @returns {Promise<Object>} User document (without password)
 * @throws {ApiError} 404 if not found
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw ApiError.notFound('User not found.');
  return user;
};