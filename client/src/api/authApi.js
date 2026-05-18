import apiClient from './apiClient';

/**
 * Register a new user account.
 * @param {Object} credentials - { name, email, password }
 * @returns {Promise<{token, user}>}
 */
export const signup = (credentials) =>
  apiClient.post('/auth/signup', credentials);

/**
 * Authenticate an existing user.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{token, user}>}
 */
export const login = (credentials) =>
  apiClient.post('/auth/login', credentials);

/**
 * Fetch the currently authenticated user's profile.
 * JWT is attached automatically by the request interceptor.
 * @returns {Promise<{user}>}
 */
export const getMe = () =>
  apiClient.get('/auth/me');