// server/services/authService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate a JWT token for a user
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register a new user
export const registerUser = async ({ name, email, password }) => {
  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  // 2. Hash the password (never store plain text)
  const saltRounds = 12; // Higher = more secure but slower. 12 is a good balance.
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 3. Create user in database
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // 4. Generate token
  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

// Login an existing user
export const loginUser = async ({ email, password }) => {
  // 1. Find user WITH password (select: false means we must explicitly request it)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    // Use a generic message — don't reveal whether email exists
    throw new Error('Invalid email or password.');
  }

  // 2. Compare provided password with hashed password in DB
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error('Invalid email or password.');
  }

  // 3. Generate token
  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

// Get user profile
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found.');
  }
  return user;
};