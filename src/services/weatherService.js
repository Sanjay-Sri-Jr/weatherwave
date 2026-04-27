import * as apiClient from "./apiClient";

export const createWeatherService = (client = apiClient) => ({
  async getWeatherData(city) {
    const [currentWeather, forecast] = await Promise.all([
      client.getCurrentWeather(city),
      client.getWeatherForecast(city),
    ]);

    return { currentWeather, forecast };
  },

  async getWeatherDataByCoords(latitude, longitude) {
    const currentWeather = await client.getCurrentWeatherByCoords(latitude, longitude);
    const forecast = await client.getWeatherForecast(currentWeather.name);

    return { currentWeather, forecast };
  },

  async searchCities(query) {
    return client.searchCities(query);
  },
});

const defaultWeatherService = createWeatherService();

export const getWeatherData = (city) => defaultWeatherService.getWeatherData(city);
export const getWeatherDataByCoords = (latitude, longitude) =>
  defaultWeatherService.getWeatherDataByCoords(latitude, longitude);
export const searchCities = (query) => defaultWeatherService.searchCities(query);

export default defaultWeatherService;
