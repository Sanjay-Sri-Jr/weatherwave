import apiClient from './apiClient';

// Register a new user account.
export const signup = (credentials) =>
  apiClient.post('/auth/signup', credentials);

// Authenticate an existing user.

export const login = (credentials) =>
  apiClient.post('/auth/login', credentials);

// Fetch the currently authenticated user's profile.
// JWT is attached automatically by the request interceptor.
export const getMe = () =>
  apiClient.get('/auth/me');