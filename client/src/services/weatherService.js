import * as weatherApi from '../api/weatherApi';

const formatForecastLabel = (forecastItem) => {

  if (forecastItem?.dt) {
    return new Date(forecastItem.dt * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  return '';
};

export const transformForecastChartData = (forecast, limit = 8) => {
  
  const now = Math.floor(Date.now() / 1000);

  const forecastEntries = forecast.list
    .filter(item => item.dt >= now)
    .slice(0, 8);

  return {
    labels: forecastEntries.map(formatForecastLabel),
    temperatures: forecastEntries.map((entry) => Math.round(entry?.main?.temp ?? 0)),
    timestamps: forecastEntries.map((entry) => entry?.dt ?? 0),
  };
};

export const createWeatherService = (api = weatherApi) => ({

  async getWeatherData(cityOrLocation) {
    const hasCoordinates =
      cityOrLocation && typeof cityOrLocation === 'object' &&
      cityOrLocation.lat != null && cityOrLocation.lon != null;

    const data = hasCoordinates
      ? await api.getWeatherByCoords(cityOrLocation.lat, cityOrLocation.lon, cityOrLocation)
      : await api.getWeatherByCity(cityOrLocation);

    return {
      currentWeather: data.currentWeather,
      forecast: data.forecast,
      forecastChartData: transformForecastChartData(data.forecast),
    };
  },

  async getWeatherDataByCoords(latitude, longitude) {
    const data = await api.getWeatherByCoords(latitude, longitude);
    return {
      currentWeather: data.currentWeather,
      forecast: data.forecast,
      forecastChartData: transformForecastChartData(data.forecast),
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