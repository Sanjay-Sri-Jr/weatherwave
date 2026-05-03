# WeatherWave

A modern React-based weather web application that provides real-time weather data, hourly forecasts, and long-term predictions using external weather APIs.

## Features

* Search weather by city name
* Auto-detect location using Geolocation API (upcoming)
* Current weather details (temperature, humidity, wind, conditions)
* 24-hour hourly forecast (in progress)
* 21-day daily forecast (in progress)
* Light/Dark theme (planned)
* Real-time data from external API
* Fast performance with Vite

## Tech Stack

* Frontend: React (Functional Components + Hooks)
* Build Tool: Vite
* State Management: useState, useEffect
* API Handling: Fetch API
* Styling: CSS / Tailwind (based on implementation)
* Version Control: Git & GitHub
* Deployment: Vercel

## Environment Variables

Create a .env file in the root directory:

* VITE_WEATHER_API_KEY=your_api_key_here
* VITE_BASE_URL=https://api.openweathermap.org/data/2.5

## Data Flow

User Input → useWeather Hook → API Call → State Update → UI Render

## Install Dependencies

* npm install
* npm run dev

## Author

Sanjay

## Contact
* email: sanjaysri02082005@gmail.com
* github: Sanjay-Sri-Jr
* linkedin: https://www.linkedin.com/in/sanjay-sri-jr/

added dev and main branch