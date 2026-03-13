import { motion } from 'framer-motion';

const Greeting: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="text-center"
    >
      <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white drop-shadow-sm">
        Hi Philip <span className="inline-block animate-wave">👋</span>
      </h1>
    </motion.div>
  );
};

export default Greeting;
