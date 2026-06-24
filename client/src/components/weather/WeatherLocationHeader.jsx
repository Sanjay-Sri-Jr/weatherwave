import { createElement } from 'react';
import { getTimezoneAbbreviation } from '../../utils/timezone';

export default function WeatherLocationHeader({ locationLabel, country, timestamp, locationIcon: LocationIcon }) {
  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Unknown';
  const timezoneShort = getTimezoneAbbreviation(browserTimeZone, { fallback: browserTimeZone });

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white/10 rounded-full">
          {createElement(LocationIcon, { className: "w-5 h-5 text-white/80" })}
        </div>
        <div>
          <h2 className="text-white font-semibold text-lg">{locationLabel}</h2>
          <p className="text-white/60 text-sm">{country}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-white/70 text-sm">
          {new Date(timestamp * 1000).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="text-white/50 text-xs">
          {new Date(timestamp * 1000).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })} {timezoneShort}
        </div>
      </div>
    </div>
  );
}
