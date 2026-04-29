import { useWeather } from "./hooks/useWeather";
import TemperatureToggle from "./components/TemperatureToggle";
import SearchBar from "./components/SearchBar";
import WeatherContent from "./components/WeatherContent";

function App() {
  const {
    currentWeather,
    forecast,
    loading,
    error,
    unit,
    toggleUnit,
    fetchWeatherByCity,
    fetchWeatherByLocation,
  } = useWeather();

  const handleRetry = () => {
    if (currentWeather) {
      fetchWeatherByCity(currentWeather.name);
    } else {
      fetchWeatherByCity("Chennai");
    }
  };


  return (
    <div className="relative min-h-screen  overflow-hidden">
      {/* background image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
        <img
          src="/weather-bg.jpg"
          alt="Weather Background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      {/* headerSection */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto mb-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight">
            Weather <span className="text-blue-400">Wave</span>
          </h1>
          <p className="text-lg text-gray-400">
            Get real-time weather updates for any city
          </p>
        </div>
        {/* SearchBar  */}
        <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-6 mb-12">
          <SearchBar onSearch={fetchWeatherByCity}
            onLocationSearch={fetchWeatherByLocation}
            loading={loading} />
          <TemperatureToggle unit={unit} onToggle={toggleUnit} />
        </div>

        {/* Main content */}
        <div className="space-y-8">
          {/* SRP: App orchestrates state only, presentation is delegated. */}
          <WeatherContent
            loading={loading}
            error={error}
            weather={currentWeather}
            forecast={forecast}
            unit={unit}
            onRetry={handleRetry}
          />
        </div>
      </div>
    </div>
  );
}

export default App;