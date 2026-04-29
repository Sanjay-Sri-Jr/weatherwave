import { formatTemperature } from "../../utils/weatherUtils";
import { createElement } from "react";

export default function WeatherPrimaryInfo({
  unit,
  icon: Icon,
  description,
  temp,
  tempMin,
  tempMax,
}) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div className="flex-1">
        <div className="text-7xl font-bold text-white mb-3 tracking-tight">
          {formatTemperature(temp, unit)}°
          <span className="text-4xl font-normal text-white/70">{unit}</span>
        </div>
        <div className="text-white/90 text-xl capitalize mb-2 font-medium">{description}</div>
        <div className="flex items-center space-x-4 text-white/60 text-sm">
          <span>H: {formatTemperature(tempMax, unit)}°</span>
          <span>L: {formatTemperature(tempMin, unit)}°</span>
        </div>
      </div>
      <div className="text-white/90 transform hover:scale-110 transition-transform duration-300">
        {createElement(Icon, { size: 80, className: "drop-shadow-2xl" })}
      </div>
    </div>
  );
}
