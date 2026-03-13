import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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

const MapComponent: React.FC = () => {
  const markerPosition: [number, number] = [48.7665, 11.4257]; // Altstadt
  const centerPosition: [number, number] = [48.7580, 11.4257]; // Fine-tuned shift

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full md:w-56 h-32 rounded-[1.5rem] overflow-hidden border border-white/20 shadow-xl bg-white/5 backdrop-blur-md"
    >
      <MapContainer 
        key={`${centerPosition[0]}-${centerPosition[1]}`}
        center={centerPosition} 
        zoom={12} 
        scrollWheelZoom={false} 
        zoomControl={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%', backgroundColor: 'transparent' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={markerPosition} />
      </MapContainer>
    </motion.div>
  );
};

export default MapComponent;
