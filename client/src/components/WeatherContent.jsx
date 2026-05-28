import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";
import WeatherCard from "./WeatherCard";
import WeatherForecast from "./WeatherForecast";
import WeatherChart from "./charts/WeatherChart";

export default function WeatherContent({ loading, error, weather, forecast, forecastChartData, unit, onRetry }) {
  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <LoadingSpinner />
          <p className="text-white/80 text-center mt-4 font-medium">Fetching weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2">
        <div className="space-y-8">
          <WeatherCard weather={weather} unit={unit} />
          <WeatherChart chartData={forecastChartData} />
        </div>
      </div>
      <div className="xl:col-span-1">
        <WeatherForecast forecast={forecast} unit={unit} />
      </div>
    </div>
  );
}
