import { Line } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip, } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function WeatherChart({ chartData, title = 'Forecast Temperature Trend' }) {
  const labels = chartData?.labels ?? [];
  const temperatures = chartData?.temperatures ?? [];

  if (!labels.length || !temperatures.length) {
    return null;
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temperatures,
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
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
          color: 'rgba(255, 255, 255, 0.78)',
          font: { weight: '600' }
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
          text: 'Temperature (°C)',
          color: 'rgba(255, 255, 255, 0.78)',
          font: { weight: '600' }
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.78)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-200/80">Forecast Chart</p>
        <h2 className="text-2xl font-semibold text-white mt-2">{title}</h2>
      </div>

      <div className="h-72 md:h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}