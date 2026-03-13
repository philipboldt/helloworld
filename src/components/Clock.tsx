import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const timeString = formatTime(time);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="flex flex-col items-center justify-center" 
      role="timer" 
      aria-label={`Current time: ${timeString}`}
    >
      <div className="text-6xl md:text-8xl font-extralight tracking-tighter text-white tabular-nums drop-shadow-md">
        {timeString}
      </div>
      <div className="text-lg md:text-xl font-medium text-white/80 uppercase tracking-widest mt-2 drop-shadow-sm">
        {formatDate(time)}
      </div>
    </motion.div>
  );
};

export default Clock;
