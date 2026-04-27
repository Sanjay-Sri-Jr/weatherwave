import { createElement } from "react";

export default function WeatherMetricItem({ icon: Icon, label, value, color = "text-white" }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
          {createElement(Icon, { className: `w-4 h-4 ${color}` })}
        </div>
        <span className="text-white/70 text-sm font-medium">{label}</span>
      </div>
      <div className="text-white font-semibold text-lg pl-11">{value}</div>
    </div>
  );
}
