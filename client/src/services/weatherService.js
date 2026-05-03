// client/src/services/weatherService.js
import * as apiClient from "./apiClient";

export const createWeatherService = (client = apiClient) => ({

  // ✅ Single call — backend returns currentWeather + forecast together
  async getWeatherData(city) {
    const data = await client.getCurrentWeather(city);
    return {
      currentWeather: data.currentWeather,
      forecast: data.forecast,
    };
  },

  // ✅ Coords — backend returns both together
  async getWeatherDataByCoords(latitude, longitude) {
    const data = await client.getCurrentWeatherByCoords(latitude, longitude);
    return {
      currentWeather: data.currentWeather,
      forecast: data.forecast,
    };
  },

  // ✅ City autocomplete
  async searchCities(query) {
    return client.searchCities(query);
  },

  // ✅ Search history from MongoDB
  async getSearchHistory() {
    return client.getSearchHistory();
  },

});

const defaultWeatherService = createWeatherService();
export default defaultWeatherService;