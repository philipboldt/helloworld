import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
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
    const props = { className: "text-white drop-shadow-md", size: 40, strokeWidth: 2 };
    if (code === 0) return <Sun {...props} aria-label="Sunny" />;
    if (code >= 1 && code <= 3) return <Cloud {...props} aria-label="Partly cloudy" />;
    if (code >= 45 && code <= 48) return <CloudFog {...props} aria-label="Foggy" />;
    if (code >= 51 && code <= 57) return <CloudDrizzle {...props} aria-label="Drizzle" />;
    if (code >= 61 && code <= 67) return <CloudRain {...props} aria-label="Rainy" />;
    if (code >= 71 && code <= 77) return <CloudSnow {...props} aria-label="Snowy" />;
    if (code >= 80 && code <= 82) return <CloudRain {...props} aria-label="Showers" />;
    if (code >= 95) return <CloudLightning {...props} aria-label="Thunderstorm" />;
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

  if (loading && !weather) {
    return (
      <div className="flex items-center justify-center w-48 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl animate-pulse">
        <span className="text-white/60 text-sm font-medium tracking-wide">Updating...</span>
      </div>
    );
  }
  
  if (error && !weather) {
    return (
      <div className="flex items-center justify-between w-48 h-24 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-4 text-red-100">
        <span className="text-sm font-medium tracking-wide">Unavailable</span>
        <button onClick={fetchWeather} className="p-2 bg-red-500/40 rounded-full hover:bg-red-500/60 transition-colors" aria-label="Retry fetching weather">
          <RefreshCw size={18} />
        </button>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center gap-4 bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md border border-white/20 rounded-[1.5rem] py-3 px-6 shadow-xl cursor-default w-full md:w-auto"
      aria-label={`Current weather: ${Math.round(weather.temperature)} degrees, ${getWeatherDescription(weather.weathercode)}`}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {getWeatherIcon(weather.weathercode)}
      </motion.div>
      <div className="flex flex-col items-start">
        <span className="text-3xl font-bold text-white tracking-tight drop-shadow-md leading-none">
          {Math.round(weather.temperature)}°
        </span>
        <span className="text-sm text-white/80 font-medium tracking-wide mt-1 drop-shadow-sm">
          {getWeatherDescription(weather.weathercode)}
        </span>
      </div>
    </motion.div>
  );
};

export default Weather;
