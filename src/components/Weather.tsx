import { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, CloudDrizzle } from 'lucide-react';

interface WeatherData {
  temperature: number;
  weathercode: number;
}

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=48.7656&longitude=11.4237&current_weather=true'
        );
        const data = await response.json();
        setWeather(data.current_weather);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Update every 10 minutes

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="weather-icon sunny" size={32} />;
    if (code >= 1 && code <= 3) return <Cloud className="weather-icon cloudy" size={32} />;
    if (code >= 45 && code <= 48) return <CloudFog className="weather-icon foggy" size={32} />;
    if (code >= 51 && code <= 57) return <CloudDrizzle className="weather-icon rainy" size={32} />;
    if (code >= 61 && code <= 67) return <CloudRain className="weather-icon rainy" size={32} />;
    if (code >= 71 && code <= 77) return <CloudSnow className="weather-icon snowy" size={32} />;
    if (code >= 80 && code <= 82) return <CloudRain className="weather-icon rainy" size={32} />;
    if (code >= 95) return <CloudLightning className="weather-icon lightning" size={32} />;
    return <Cloud size={32} />;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Clear sky';
    if (code >= 1 && code <= 3) return 'Partly cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Cloudy';
  };

  if (loading) return <div className="weather">Loading weather...</div>;
  if (!weather) return <div className="weather">Weather data unavailable</div>;

  return (
    <div className="weather-container">
      {getWeatherIcon(weather.weathercode)}
      <div className="weather-info">
        <span className="temp">{Math.round(weather.temperature)}°C</span>
        <span className="desc">{getWeatherDescription(weather.weathercode)}</span>
      </div>
    </div>
  );
};

export default Weather;
