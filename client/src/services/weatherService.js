import * as weatherApi from '../api/weatherApi';

const formatForecastLabel = (forecastItem) => {
  if (typeof forecastItem?.dt_txt === 'string' && forecastItem.dt_txt.includes(' ')) {
    return forecastItem.dt_txt.split(' ')[1].slice(0, 5);
  }

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
  const forecastEntries = forecast?.list?.slice(0, limit) ?? [];

  return {
    labels: forecastEntries.map(formatForecastLabel),
    temperatures: forecastEntries.map((entry) => Math.round(entry?.main?.temp ?? 0)),
  };
};

export const createWeatherService = (api = weatherApi) => ({

  async getWeatherData(city) {
    const data = await api.getWeatherByCity(city);
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