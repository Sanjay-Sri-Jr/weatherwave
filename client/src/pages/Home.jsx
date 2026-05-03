// client/src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  ArrowRight,
  MapPin,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Thermometer,
      title: 'Real-Time Temperature',
      desc: 'Get accurate current temperature and feels-like data instantly.',
      color: 'text-orange-300',
      bg: 'bg-orange-500/10',
    },
    {
      icon: Wind,
      title: 'Wind & Pressure',
      desc: 'Monitor wind speed, direction, and atmospheric pressure.',
      color: 'text-green-300',
      bg: 'bg-green-500/10',
    },
    {
      icon: Droplets,
      title: 'Humidity Tracking',
      desc: 'Stay updated with real-time humidity levels for any city.',
      color: 'text-cyan-300',
      bg: 'bg-cyan-500/10',
    },
    {
      icon: MapPin,
      title: '5-Day Forecast',
      desc: 'Plan ahead with a detailed 5-day weather forecast.',
      color: 'text-purple-300',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#09599e] to-[#0c2425] overflow-x-hidden">

      {/* ── Hero Section ── */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">

        {/* Background blur circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="relative mb-6">
          <div className="p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
            <CloudSun className="w-16 h-16 text-blue-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl">
          Weather
          <span className="text-blue-400">Wave</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/60 max-w-xl mb-4 leading-relaxed">
          Real-time weather data, 5-day forecasts, and city search —
          all in one beautifully designed dashboard.
        </p>
        <p className="text-sm text-white/40 mb-10">
          Free · No ads · Powered by OpenWeatherMap
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">

          {isAuthenticated ? (
            // Already logged in — go straight to dashboard
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/signup')}
                className="flex items-center space-x-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
              >
                Login
              </button>
            </>
          )}

        </div>

        {/* Scroll hint */}
        <p className="absolute bottom-8 text-white/30 text-sm animate-bounce">
          ↓ See features
        </p>
      </div>

      {/* ── Features Section ── */}
      <div className="px-4 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need
          </h2>
          <p className="text-white/50 text-lg">
            Powerful weather insights delivered beautifully.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
            >
              <div className={`inline-flex p-3 ${feature.bg} rounded-2xl mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Final CTA Section ── */}
      <div className="px-4 py-24 text-center">
        <div className="max-w-xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to check the weather?
          </h2>
          <p className="text-white/50 mb-8">
            Create a free account and start exploring weather data for any city in the world.
          </p>
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/signup')}
              className="flex items-center space-x-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 mx-auto"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}