import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, CloudDrizzle, RefreshCw, MapPin } from 'lucide-react';

interface WeatherData {
  temperature: number;
  weathercode: number;
}

interface WeatherProps {
  lat: number;
  lon: number;
}

const Weather: React.FC<WeatherProps> = ({ lat, lon }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWeatherAndLocation = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Fetch Weather
      const weatherPromise = fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      ).then(res => res.json());

      // Fetch Location Name (Reverse Geocoding)
      const locationPromise = fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
      ).then(res => res.json());

      const [weatherData, locationData] = await Promise.all([weatherPromise, locationPromise]);
      
      setWeather(weatherData.current_weather);
      
      // Extract city/town/village/suburb name
      const address = locationData.address;
      const name = address.city || address.town || address.village || address.suburb || address.county || "Your Location";
      setLocationName(name);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    fetchWeatherAndLocation();
    const interval = setInterval(fetchWeatherAndLocation, 600000);
    return () => clearInterval(interval);
  }, [fetchWeatherAndLocation]);

  const getWeatherIcon = (code: number) => {
    const props = { className: "text-white drop-shadow-md", size: 36, strokeWidth: 2 };
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
      <div className="flex items-center justify-center w-full md:w-56 h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl animate-pulse">
        <span className="text-white/60 text-sm font-medium tracking-wide">Updating...</span>
      </div>
    );
  }
  
  if (error && !weather) {
    return (
      <div className="flex items-center justify-between w-full md:w-56 h-32 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-4 text-red-100">
        <span className="text-sm font-medium tracking-wide">Unavailable</span>
        <button onClick={fetchWeatherAndLocation} className="p-2 bg-red-500/40 rounded-full hover:bg-red-500/60 transition-colors" aria-label="Retry fetching weather">
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
      className="flex flex-col items-center justify-center gap-1 bg-white/10 hover:bg-white/15 transition-colors backdrop-blur-md border border-white/20 rounded-[1.5rem] shadow-xl cursor-default w-full md:w-56 h-32 px-4"
      aria-label={`Current weather in ${locationName}: ${Math.round(weather.temperature)} degrees, ${getWeatherDescription(weather.weathercode)}`}
    >
      <div className="flex items-center gap-1.5 text-white/70 mb-1">
        <MapPin size={14} className="shrink-0" />
        <span className="text-[12px] font-bold tracking-widest uppercase truncate max-w-[140px]">
          {locationName}
        </span>
      </div>

      <div className="flex items-center justify-center gap-4">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {getWeatherIcon(weather.weathercode)}
        </motion.div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-4xl font-bold text-white tracking-tighter drop-shadow-md">
            {Math.round(weather.temperature)}°
          </span>
          <span className="text-[13px] text-white/90 font-medium tracking-wide mt-1.5 drop-shadow-sm truncate max-w-[110px]">
            {getWeatherDescription(weather.weathercode)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Weather;
