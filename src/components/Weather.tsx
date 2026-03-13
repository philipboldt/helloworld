import { useState, useEffect, useCallback } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, CloudDrizzle, RefreshCw } from 'lucide-react';

interface WeatherData {
  temperature: number;
  weathercode: number;
}

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=48.7656&longitude=11.4237&current_weather=true'
      );
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setWeather(data.current_weather);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const getWeatherIcon = (code: number) => {
    const props = { className: "weather-icon", size: 32 };
    if (code === 0) return <Sun {...props} className={`${props.className} sunny`} aria-label="Sunny" />;
    if (code >= 1 && code <= 3) return <Cloud {...props} className={`${props.className} cloudy`} aria-label="Partly cloudy" />;
    if (code >= 45 && code <= 48) return <CloudFog {...props} className={`${props.className} foggy`} aria-label="Foggy" />;
    if (code >= 51 && code <= 57) return <CloudDrizzle {...props} className={`${props.className} rainy`} aria-label="Drizzle" />;
    if (code >= 61 && code <= 67) return <CloudRain {...props} className={`${props.className} rainy`} aria-label="Rainy" />;
    if (code >= 71 && code <= 77) return <CloudSnow {...props} className={`${props.className} snowy`} aria-label="Snowy" />;
    if (code >= 80 && code <= 82) return <CloudRain {...props} className={`${props.className} rainy`} aria-label="Showers" />;
    if (code >= 95) return <CloudLightning {...props} className={`${props.className} lightning`} aria-label="Thunderstorm" />;
    return <Cloud {...props} aria-label="Cloudy" />;
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

  if (loading && !weather) return <div className="weather" aria-live="polite">Updating weather...</div>;
  
  if (error && !weather) {
    return (
      <div className="weather-error" aria-live="assertive">
        <span>Weather unavailable</span>
        <button onClick={fetchWeather} className="retry-btn" aria-label="Retry fetching weather">
          <RefreshCw size={16} />
        </button>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="weather-container" aria-live="polite" aria-label={`Current weather in Ingolstadt: ${Math.round(weather.temperature)} degrees, ${getWeatherDescription(weather.weathercode)}`}>
      {getWeatherIcon(weather.weathercode)}
      <div className="weather-info">
        <span className="temp">{Math.round(weather.temperature)}°C</span>
        <span className="desc">{getWeatherDescription(weather.weathercode)}</span>
      </div>
    </div>
  );
};

export default Weather;
