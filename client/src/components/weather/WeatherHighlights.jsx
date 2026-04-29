import WeatherMetricItem from "./WeatherMetricItem";

export default function WeatherHighlights({ items }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {items.map((item) => (
        <WeatherMetricItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
          color={item.color}
        />
      ))}
    </div>
  );
}
