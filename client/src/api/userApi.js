import apiClient from './apiClient';

export const fetchSearchHistory = () =>
  apiClient.get('/weather/history');

export const clearSearchHistory = () =>
  apiClient.delete('/weather/history');