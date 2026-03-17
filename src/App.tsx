import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Greeting from './components/Greeting';
import Clock from './components/Clock';
import Weather from './components/Weather';
import MapComponent from './components/Map';

function App() {
  const [timeOfDay, setTimeOfDay] = useState('night');
  const [location, setLocation] = useState<{ lat: number; lon: number }>({ lat: 48.7656, lon: 11.4237 });
  const [timezone, setTimezone] = useState<string>('Europe/Berlin');

  // Background update logic
  useEffect(() => {
    const updateBackground = () => {
      try {
        const now = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: 'numeric',
          hour12: false
        }).format(new Date());
        
        const hour = parseInt(now, 10);
        if (hour >= 5 && hour < 11) setTimeOfDay('morning');
        else if (hour >= 11 && hour < 17) setTimeOfDay('day');
        else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
        else setTimeOfDay('night');
      } catch (e) {
        console.error("Error updating background:", e);
      }
    };

    updateBackground();
    const interval = setInterval(updateBackground, 300000);
    return () => clearInterval(interval);
  }, [timezone]);

  // Geolocation and timezone detection logic
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          
          try {
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
            );
            const data = await response.json();
            if (data.timezone) {
              setTimezone(data.timezone);
            }
          } catch (error) {
            console.error("Timezone fetch error:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  const backgrounds: Record<string, string> = {
    morning: 'from-rose-400 via-fuchsia-400 to-indigo-500',
    day: 'from-sky-400 via-cyan-400 to-blue-500',
    evening: 'from-violet-500 via-purple-500 to-fuchsia-500',
    night: 'from-slate-900 via-purple-900 to-slate-900',
  };

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br transition-colors duration-1000 ${backgrounds[timeOfDay]}`}>
      {/* Decorative blurred blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/20 rounded-full mix-blend-overlay filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/30 rounded-full mix-blend-overlay filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative z-10 w-[90%] max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[2.5rem] p-10 flex flex-col items-center gap-10"
      >
        <Greeting />
        <Clock timezone={timezone} />
        <div className="flex flex-row items-center justify-center gap-6 w-full mt-4">
          <Weather lat={location.lat} lon={location.lon} />
          <MapComponent lat={location.lat} lon={location.lon} />
        </div>
      </motion.div>
    </div>
  );
}

export default App;
