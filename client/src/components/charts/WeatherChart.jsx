import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { formatTemperature } from '../../utils/weatherUtils';
import { getTimezoneAbbreviation } from '../../utils/timezone';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

function buildDateRangeLabel(timestamps) {
  if (!timestamps?.length) return null;
  const fmt = (ts) =>
    new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const first = fmt(timestamps[0]);
  const last  = fmt(timestamps[timestamps.length - 1]);
  return first === last ? `Forecast: ${first}` : `Forecast: ${first} – ${last}`;
}


function getBrowserTimezone() {
  
  const ianaName = Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Unknown';
  const abbr = getTimezoneAbbreviation(ianaName, { fallback: ianaName });

  const rawOffset = new Date().getTimezoneOffset();
  const totalMinutes = -rawOffset;
  const sign = totalMinutes >= 0 ? '+' : '-';
  const absMinutes = Math.abs(totalMinutes);
  const hh = String(Math.floor(absMinutes / 60)).padStart(2, '0');
  const mm = String(absMinutes % 60).padStart(2, '0');
  const utcOffset = `UTC${sign}${hh}:${mm}`;

  return { ianaName, abbr, utcOffset };
}

// Component

export default function WeatherChart({
  chartData,
  unit = 'C',
  title = 'Forecast Temperature Trend',
}) {
  const labels = chartData?.labels       ?? [];
  const rawTemps = chartData?.temperatures ?? [];  
  const timestamps = chartData?.timestamps   ?? [];  

  if (!labels.length || !rawTemps.length) return null;

  //  Unit conversion
  const displayTemps = rawTemps.map((t) => formatTemperature(t, unit));

  const yAxisLabel = `Temperature (°${unit})`;
  const unitSuffix = `°${unit}`;
  const { ianaName, abbr, utcOffset } = getBrowserTimezone();

  // Date range label 
  const dateRangeLabel = buildDateRangeLabel(timestamps);

  // Chart.js data / options 
  const data = {
    labels,
    datasets: [
      {
        label: `Temperature (°${unit})`,
        data: displayTemps,
        borderColor: 'rgba(96, 165, 250, 1)',
        backgroundColor: 'rgba(96, 165, 250, 0.14)',
        fill: true,
        tension: 0.45,
        cubicInterpolationMode: 'monotone',
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointBorderColor: 'rgba(96, 165, 250, 1)',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        padding: 12,
        displayColors: false,
        callbacks: {
          title(ctx) {
            return ctx[0]?.label ?? '';
          },
          label(ctx) {
            return `${ctx.parsed.y}${unitSuffix}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
          color: 'rgba(255, 255, 255, 0.78)',
          font: { weight: '600' },
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.78)',
          maxRotation: 0,
          autoSkip: true,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          color: 'rgba(255, 255, 255, 0.78)',
          font: { weight: '600' },
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.78)',
          callback(value) {
            return `${value}${unitSuffix}`;
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
      {/* ── Header ── */}
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-200/80">Forecast Chart</p>
        <h2 className="text-2xl font-semibold text-white mt-2">{title}</h2>

        {/* ── Date range + timezone row ── */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {dateRangeLabel && (
            <span className="text-xs font-medium text-white/50 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1">
              {dateRangeLabel}
            </span>
          )}
         
          <span
            title={`Times shown in your browser timezone: ${ianaName}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 cursor-default"
          >
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Time Zone: 
            <span className="opacity-80">{abbr}</span>
            <span className="opacity-40">·</span>
            <span className="opacity-60">{utcOffset}</span>
          </span>
        </div>
      </div>

      {/* ── Chart canvas ── */}
      <div className="h-72 md:h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}