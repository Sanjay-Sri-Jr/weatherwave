import * as weatherApi from '../api/weatherApi';

export const createWeatherService = (api = weatherApi) => ({

  async getWeatherData(city) {
    const data = await api.getWeatherByCity(city);
    return {
      currentWeather: data.currentWeather,
      forecast:       data.forecast,
    };
  },

  async getWeatherDataByCoords(latitude, longitude) {
    const data = await api.getWeatherByCoords(latitude, longitude);
    return {
      currentWeather: data.currentWeather,
      forecast:       data.forecast,
    };
  },

  async searchCities(query) {
    const data = await api.searchCities(query);
    // unwrap suggestions array from { success, suggestions: [] }
    return Array.isArray(data?.suggestions) ? data.suggestions : [];
  },

  async getSearchHistory() {
    const data = await api.getSearchHistory();
    return data?.history || [];
  },

});

const defaultWeatherService = createWeatherService();
export default defaultWeatherService;