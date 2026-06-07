import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
  timeout: 10000, // 10 second timeout — prevents hanging requests
  headers: {
    'Content-Type': 'application/json',
  },
});

//  REQUEST INTERCEPTOR 
// Runs before every request is sent.
// Reads JWT from localStorage and attaches it automatically.
// This means NO other file needs to manually set the Authorization header.

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ww_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
// Runs after every response is received.
// Handles 401 globally — logs user out if token expired or invalid.
// Extracts the error message from the server's JSON response.

apiClient.interceptors.response.use(
  (response) => response.data,

  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong.';

    // 401 = token expired or invalid → force logout
    if (status === 401) {
      localStorage.removeItem('ww_token');
      localStorage.removeItem('ww_user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    const err = new Error(message);
    err.status  = status;
    err.data    = error.response?.data;
    return Promise.reject(err);
  }
);

export default apiClient;