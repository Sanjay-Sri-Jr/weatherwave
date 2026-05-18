import ApiError from '../utils/ApiError.js';

/**
 * Validate signup request body.
 * Rules: name required, valid email, password >= 6 chars.
 */
export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name?.trim())
    errors.push('Name is required.');

  if (!email?.trim())
    errors.push('Email is required.');
  else if (!/^\S+@\S+\.\S+$/.test(email))
    errors.push('Please enter a valid email address.');

  if (!password)
    errors.push('Password is required.');
  else if (password.length < 6)
    errors.push('Password must be at least 6 characters.');

  if (errors.length > 0) {
    return next(ApiError.badRequest(errors.join(' ')));
  }

  next();
};

/**
 * Validate login request body.
 * Rules: email and password both required.
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email?.trim())    errors.push('Email is required.');
  if (!password?.trim()) errors.push('Password is required.');

  if (errors.length > 0) {
    return next(ApiError.badRequest(errors.join(' ')));
  }

  next();
};
