import { motion } from 'framer-motion';
import { pulseAnimation } from '../../utils/animation';

const AgentCore = () => {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg"
      {...pulseAnimation}
    >
      <div className="absolute inset-0 bg-gray-900/20 rounded-full backdrop-blur-sm" />
    </motion.div>
  );
};

export default AgentCore;