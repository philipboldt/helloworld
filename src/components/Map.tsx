import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  lat: number;
  lon: number;
}

// Helper component to handle centering
const RecenterMap: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
};

const MapComponent: React.FC<MapProps> = ({ lat, lon }) => {
  const position: [number, number] = [lat, lon];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-full md:w-56 h-32 rounded-[1.5rem] overflow-hidden border border-white/50 shadow-2xl bg-white/40 backdrop-blur-2xl"
    >
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={false} 
        zoomControl={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%', filter: 'contrast(1.25) saturate(1.4) brightness(1.0)' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
        <RecenterMap position={position} />
      </MapContainer>
      
      {/* Subtle indicator that it's centered on your location */}
      <div className="absolute bottom-2 right-2 z-[1000] px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
        <span className="text-[10px] text-white/60 font-medium tracking-tight">LIVE</span>
      </div>
    </motion.div>
  );
};

export default MapComponent;
