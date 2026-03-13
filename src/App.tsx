import { useState, useEffect } from 'react';
import './App.css';
import Greeting from './components/Greeting';
import Clock from './components/Clock';
import Weather from './components/Weather';

function App() {
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const updateBackground = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 11) setTimeOfDay('morning');
      else if (hour >= 11 && hour < 17) setTimeOfDay('day');
      else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
      else setTimeOfDay('night');
    };

    updateBackground();
    const interval = setInterval(updateBackground, 300000); // Check every 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`landing-container ${timeOfDay}`}>
      <div className="background-animation"></div>
      <div className="content-card">
        <Greeting />
        <Clock />
        <Weather />
      </div>
    </div>
  );
}

export default App;
