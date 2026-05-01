// client/src/services/apiClient.js

// ─── Helper: get token from localStorage and build auth headers ───
const getAuthHeaders = () => {
  const token = localStorage.getItem('ww_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ─── Helper: parse response and throw clean errors ───
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }
  return data;
};

// ════════════════════════════════════════
//  AUTH CALLS  (no token needed)
// ════════════════════════════════════════

export const signupApi = async ({ name, email, password }) => {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
};

export const loginApi = async ({ email, password }) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

// ════════════════════════════════════════
//  WEATHER CALLS  (token required)
// ════════════════════════════════════════

// Called by weatherService.getWeatherData(city)
// Returns { currentWeather, forecast } — both in one call
export const getCurrentWeather = async (city) => {
  const res = await fetch(`/api/weather/city/${encodeURIComponent(city)}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// Called by weatherService.getWeatherDataByCoords(lat, lon)
// Returns { currentWeather, forecast }
export const getCurrentWeatherByCoords = async (lat, lon) => {
  const res = await fetch(`/api/weather/coords?lat=${lat}&lon=${lon}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// Called by useCitySuggestions hook via weatherService.searchCities(query)
// Returns array of city suggestions
export const searchCities = async (query) => {
  const res = await fetch(`/api/weather/search?q=${encodeURIComponent(query)}`, {
    headers: getAuthHeaders(),
  });
  const data = await handleResponse(res);
  return data.suggestions; // unwrap from { success, suggestions: [...] }
};

// Optional: fetch user's past search history
export const getSearchHistory = async () => {
  const res = await fetch('/api/weather/history', {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};