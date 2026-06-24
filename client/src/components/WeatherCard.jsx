import { MapPin } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { formatTemperature, getWeatherIcon } from '../utils/weatherUtils'
import WeatherHighlights from './weather/WeatherHighlights'
import WeatherLocationHeader from './weather/WeatherLocationHeader'
import WeatherPrimaryInfo from './weather/WeatherPrimaryInfo'
import WeatherSunTimes from './weather/WeatherSunTimes'

// converting the location object into a readable string format for display purposes
const formatLocationLabel = (location, fallbackName) => {
  if (typeof location === 'string') {
    return location.trim() || fallbackName;
  }

  if (location && typeof location === 'object') {
    const parts = [location.name, location.state].filter(Boolean);
    if (parts.length > 0) {
      return parts.join(', ');
    }
  } 

  return fallbackName;
};

function WeatherCard({ weather, selectedLocation, unit }) {
  const iconName = getWeatherIcon(weather.weather[0].main)
  const IconComponent = LucideIcons[iconName] || LucideIcons.Cloud;
  const locationLabel = formatLocationLabel(selectedLocation, weather.name);
  const countryLabel = selectedLocation?.country || weather.sys.country;

  const weatherStats = [

    {
      icon: LucideIcons.Eye,
      label: "Visibility",
      value: `${(weather.visibility / 1000).toFixed(1)} km`,
      color: "text-blue-300"
    },
    {
      icon: LucideIcons.Wind,
      label: "Wind Speed",
      value: `${weather.wind.speed.toFixed(1)} m/s`,
      color: "text-green-300"
    },
    {
      icon: LucideIcons.Droplets,
      label: "Humidity",
      value: `${weather.main.humidity}%`,
      color: "text-cyan-300"
    },
    {
      icon: LucideIcons.Gauge,
      label: "Pressure",
      value: `${weather.main.pressure} hPa`,
      color: "text-purple-300"
    },
    {
      icon: LucideIcons.Thermometer,
      label: "Feels Like",
      value: `${formatTemperature(weather.main.feels_like, unit)}°${unit}`,
      color: "text-orange-300"
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-500">
      <WeatherLocationHeader
        locationLabel={locationLabel}
        country={countryLabel}
        timestamp={weather.dt}
        locationIcon={MapPin}
      />

      <WeatherPrimaryInfo
        unit={unit}
        icon={IconComponent}
        description={weather.weather[0].description}
        temp={weather.main.temp}
        tempMin={weather.main.temp_min}
        tempMax={weather.main.temp_max}
      />

      <WeatherHighlights items={weatherStats} />

      <WeatherSunTimes sunrise={weather.sys.sunrise} sunset={weather.sys.sunset} />
    </div>
  )
}

export default WeatherCard