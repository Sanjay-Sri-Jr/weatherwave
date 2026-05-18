import apiClient from './apiClient';

/**
 * Fetch the current user's search history.
 * @returns {Promise<Array<{city, searchedAt}>>}
 */
export const fetchSearchHistory = () =>
  apiClient.get('/weather/history');

/**
 * Clear the current user's search history.
 * @returns {Promise<{success, message}>}
 */
export const clearSearchHistory = () =>
  apiClient.delete('/weather/history');