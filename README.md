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
```
weatherwave
├─ client
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  ├─ icons.svg
│  │  └─ weather-bg.jpg
│  ├─ src
│  │  ├─ api
│  │  │  ├─ apiClient.js           - Layer: API layer : Create Axios Instance interceptors(request & response)
│  │  │  ├─ authApi.js             - Layer: API layer : Auth-specific API calls — signup, login, getMe via apiclient.post method  
│  │  │  ├─ userApi.js             - Layer: API layer : User-specific API operations for search history.
│  │  │  └─ weatherApi.js          - Layer: API layer : responsible for calling backend weather API  apiclient.get & returning data to components
│  │  ├─ App.jsx
│  │  ├─ components
│  │  │  ├─ charts
│  │  │  │  └─ WeatherChart.jsx
│  │  │  ├─ ErrorMessage.jsx
│  │  │  ├─ ForecastItem.jsx
│  │  │  ├─ LoadingSpinner.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ ProtectedRoute.jsx
│  │  │  ├─ SearchBar.jsx
│  │  │  ├─ TemperatureToggle.jsx
│  │  │  ├─ weather
│  │  │  │  ├─ WeatherHighlights.jsx
│  │  │  │  ├─ WeatherLocationHeader.jsx
│  │  │  │  ├─ WeatherMetricItem.jsx
│  │  │  │  ├─ WeatherPrimaryInfo.jsx
│  │  │  │  └─ WeatherSunTimes.jsx
│  │  │  ├─ WeatherCard.jsx
│  │  │  ├─ WeatherContent.jsx
│  │  │  └─ WeatherForecast.jsx
│  │  ├─ context
│  │  │  └─ AuthContext.jsx            - Layer: State management layer : React Context that provides authentication state (user, token,isAuthenticated, loading) and actions (setAuthLogin, logout) to the entire component tree.
│  │  ├─ hooks
│  │  │  ├─ useCitySuggestions.js     -Layer: Cust Hook layer (btwe service layer and UI layer):Custom hook for debounced city autocomplete logic
│  │  │  └─ useWeather.js             -Layer: Cust Hook layer (btwe service layer and UI layer): centralizes weather-related state management, API communication, location persistence, geolocation handling, refresh functionality, temperature unit management for the Weather application.
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ Home.jsx
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ SignupPage.jsx
│  │  │  └─ WeatherApp.jsx
│  │  ├─ services
│  │  │  ├─ authService.js            - Layer: Service layer : Handles saving and removing (token & user) in localStorage session,calls authApi
│  │  │  └─ weatherService.           - Layer: Service layer : It maintain weather-related API calls and transform raw weather data into a format
│  │     ├─ timezone.js
│  │     └─ weatherUtils.js
│  ├─ vercel.json
│  └─ vite.config.js
├─ README.md
└─ server
   ├─ config
   │  ├─ db.js
   │  └─ env.js
   ├─ controllers
   │  ├─ authController.js
   │  └─ weatherController.js
   ├─ index.js
   ├─ middleware
   │  ├─ authMiddleware.js
   │  ├─ errorMiddleware.js
   │  └─ rateLimitMiddleware.js
   ├─ models
   │  └─ User.js
   ├─ package-lock.json
   ├─ package.json
   ├─ routes
   │  ├─ authRoutes.js
   │  └─ weatherRoutes.js
   ├─ services
   │  ├─ authService.js
   │  ├─ userService.js
   │  └─ weatherService.js
   ├─ utils
   │  ├─ ApiError.js
   │  ├─ asyncHandler.js
   │  └─ logger.js
   ├─ validators
   │  ├─ authValidator.js
   │  └─ weatherValidator.js
   └─ vercel.json

```