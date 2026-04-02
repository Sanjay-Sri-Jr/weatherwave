import { useState } from "react";
import { useWeather } from "./hooks/useWeather";

function App() {
  const [city, setCity] = useState("Chennai");

  const { data, loading, error } = useWeather(city);

  return (
    <div>
      <h1>WeatherWave</h1>

      <input
        type="text"
        placeholder="Enter city"
        onChange={(e) => setCity(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {data && (
        <div>
          <h2>{data.name}</h2>
          <p>{data.main.temp}°C</p>
        </div>
      )}
    </div>
  );
}

export default App;