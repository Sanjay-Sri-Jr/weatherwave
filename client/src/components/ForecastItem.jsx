import * as LucideIcons from "lucide-react";
import { Droplets } from "lucide-react";
import { formatDate, formatTemperature, getWeatherIcon } from "../utils/weatherUtils";

export default function ForecastItem({ item, unit, dayLabel }) {
  const iconName = getWeatherIcon(item.weather[0].main);
  const IconComponent = LucideIcons[iconName] || LucideIcons.Cloud;

  return (
    <div className="flex items-center justify-between p-5 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-300 group border border-white/10">
      <div className="flex items-center space-x-5 flex-1">
        <div className="text-white/90 group-hover:text-white transition-all transform group-hover:scale-110 duration-300">
          <IconComponent size={40} />
        </div>
        <div className="flex-1">
          <div className="text-white font-semibold text-lg">{dayLabel ?? formatDate(item.dt)}</div>
          <div className="text-white/70 text-sm capitalize font-medium">{item.weather[0].description}</div>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-white/60">
          <Droplets className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium">{Math.round(item.pop * 100)}%</span>
        </div>
        <div className="text-right">
          <div className="text-white font-bold text-xl">{formatTemperature(item.main.temp_min, unit)}°</div>
          <div className="text-white text-sm font-medium">{formatTemperature(item.main.temp_max, unit)}°</div>
        </div>
      </div>
    </div>
  );
}
