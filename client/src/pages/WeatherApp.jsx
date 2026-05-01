// client/src/pages/WeatherApp.jsx
import { useWeather } from "../hooks/useWeather";
import TemperatureToggle from "../components/TemperatureToggle";
import SearchBar from "../components/SearchBar";
import WeatherContent from "../components/WeatherContent";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

function WeatherApp() {
  const { currentWeather, forecast, loading, error, unit, toggleUnit, fetchWeatherByCity, fetchWeatherByLocation } = useWeather();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRetry = () => {
    fetchWeatherByCity(currentWeather?.name || "Chennai");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
        <img src="/weather-bg.jpg" alt="Weather Background" className="w-full h-full object-cover opacity-50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with user info + logout */}
        <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl tracking-tight">
              Weather <span className="text-blue-400">Wave</span>
            </h1>
            <p className="text-white/60 mt-2">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl px-4 py-2 text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-6 mb-12">
          <SearchBar onSearch={fetchWeatherByCity} onLocationSearch={fetchWeatherByLocation} loading={loading} />
          <TemperatureToggle unit={unit} onToggle={toggleUnit} />
        </div>

        <div className="space-y-8">
          <WeatherContent loading={loading} error={error} weather={currentWeather} forecast={forecast} unit={unit} onRetry={handleRetry} />
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;