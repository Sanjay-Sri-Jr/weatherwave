import { useState } from "react";
import { useWeather } from "./hooks/useWeather";
import WeatherCard from "./components/WeatherCard";
import TemperatureToggle from "./components/TemperatureToggle";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import WeatherForecast from "./components/WeatherForecast";
import { getCurrentWeather } from "./services/apiClient";
import SearchBar from "./components/searchBar";
import { getWeatherIcon } from "./utils/weatherUtils";

function App() {

  
  const { currentWeather, forecast, loading, error, unit, toggleUnit, fetchWeatherByCity, fetchWeatherByLocation} = useWeather();

  const  handleRetry=()=>{
    if(currentWeather){
      fetchWeatherByCity(currentWeather.name);
    }else{
      fetchWeatherByCity("Chennai");
    }
  }


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
          {loading && (
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <LoadingSpinner />
                <p className="text-white/80 text-center mt-4 font-medium">Fetching weather data...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="max-w-2xl mx-auto">
              <ErrorMessage message={error} onRetry={handleRetry} />
            </div>
          )}

          {!loading && currentWeather && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <WeatherCard weather={currentWeather} unit={unit} />
              </div>
              <div className="xl:col-span-1">
                {forecast && <WeatherForecast forecast={forecast} unit={unit}  />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;