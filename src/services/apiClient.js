const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const GEO_URL = import.meta.env.VITE_GEO_URL || "https://api.openweathermap.org/geo/1.0";

export const getCurrentWeather = async (city) => {
    try {
        const encodedCity = encodeURIComponent(city);
        const response = await fetch(
            `${BASE_URL}/weather?q=${encodedCity}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City ${city} not found. Please check the city name and try again.`);
            } else if (response.status === 401) {
                throw new Error("Invalid API key. Please check your API key and try again.");
            } else {
                throw new Error("Invalid API key. Please try again later.");
            }
            }

        const data = await response.json();

        //ensures that the data has a timestamp, if not we add the current time as a fallback
        if (!data.dt) {
            data.dt = Math.floor(Date.now() / 1000);
        }
        return data;

    } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error("Network error. Please check your internet connection and try again.");
        }
        throw error;
    }
};

export const getCurrentWeatherByCoords = async (lat, lon) => {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Invalid API key. Please check your API key and try again.");
            } else {
                throw new Error("Failed to fetch weather data. Please try again later.");
            }
            }

        const data = await response.json();
        if (!data.dt) {
            data.dt = Math.floor(Date.now() / 1000);
        }
        return data;
    } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error("Network error. Please check your internet connection and try again.");
        }
        throw error;
    }
};
export const getWeatherForecast = async (city) => {
    try {
        const encodedCity = encodeURIComponent(city);
        const response = await fetch(
            `${BASE_URL}/forecast?q=${encodedCity}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City ${city} not found. Please check the city name and try again.`);
            } else if (response.status === 401) {
                throw new Error("Invalid API key. Please check your API key and try again.");
            } else {
                throw new Error("Weather forecast data not available. Please try again later.");
            }
        }

        return await response.json();

    } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error("Network error. Please check your internet connection and try again.");
        }
        throw error;
    }
};
export const searchCities = async (query) => {
    try {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(
            `${GEO_URL}/direct?q=${encodedQuery}&limit=5&appid=${API_KEY}`
        );

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Invalid API key. Please check your API key and try again.");
            }
            throw new Error("Failed to fetch city data. Please try again later.");
        }

        const data = await response.json();

        return data.map((city) => ({
            name: city.name,
            lat: city.lat,
            lon: city.lon,
            country: city.country,
            state: city.state || "",
        }));
    } 
    catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error("Network error. Please check your internet connection and try again.");
        }
        throw error;
    }
}