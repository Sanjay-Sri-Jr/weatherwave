import { Sunrise, Sunset } from "lucide-react";
import { formatTime } from "../../utils/weatherUtils";

export default function WeatherSunTimes({ sunrise, sunset }) {
  const cards = [
    {
      label: "Sunrise",
      value: formatTime(sunrise),
      icon: Sunrise,
      containerClass:
        "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-400/20",
      iconColor: "text-orange-300",
      iconContainerClass: "",
    },
    {
      label: "Sunset",
      value: formatTime(sunset),
      icon: Sunset,
      containerClass: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/20",
      iconColor: "text-purple-300",
      iconContainerClass: "p-2 bg-purple-400/20 rounded-full",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.containerClass} backdrop-blur-sm rounded-2xl p-4 border`}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className={card.iconContainerClass}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            <span className="text-white/80 text-sm font-medium">{card.label}</span>
          </div>
          <div className="text-white font-semibold text-lg pl-11">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
