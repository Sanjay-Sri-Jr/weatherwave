// client/src/services/weatherService.js
import * as apiClient from "./apiClient";

// ─── Factory function — accepts a custom client for testing ───
export const createWeatherService = (client = apiClient) => ({

  // ─── Get current weather + forecast by city name ───
  // Backend returns BOTH in a single response: { currentWeather, forecast }
  // Old code made TWO separate API calls — now it's ONE
  async getWeatherData(city) {
    const data = await client.getCurrentWeather(city);
    return {
      currentWeather: data.currentWeather,
      forecast: data.forecast,
    };
  },

  // ─── Get current weather + forecast by GPS coordinates ───
  // Backend resolves city name from coords, then fetches both
  async getWeatherDataByCoords(latitude, longitude) {
    const data = await client.getCurrentWeatherByCoords(latitude, longitude);
    return {
      currentWeather: data.currentWeather,
      forecast: data.forecast,
    };
  },

  // ─── City autocomplete suggestions ───
  // Used by useCitySuggestions hook in SearchBar
  async searchCities(query) {
    return client.searchCities(query);
  },

  // ─── User's past search history from MongoDB ───
  // Optional — call this wherever you want to show history
  async getSearchHistory() {
    return client.getSearchHistory();
  },

});

// ─── Default singleton instance used across the whole app ───
const defaultWeatherService = createWeatherService();
export default defaultWeatherService;