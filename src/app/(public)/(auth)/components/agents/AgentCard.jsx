import { motion } from 'framer-motion';
import defaultAvatar from '../../assets/default-avatar.svg';

const AgentCard = ({ name, title, avatar, color }) => {
  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.05 }}
    >
      <motion.div 
        className={`w-24 h-24 rounded-full ${color} p-1 shadow-lg backdrop-blur-sm`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
          <img
            src={avatar || defaultAvatar}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md rounded-lg p-2 w-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        initial={{ y: 10 }}
        whileHover={{ y: 0 }}
      >
        <p className="text-white text-sm font-bold text-center leading-tight">{name}</p>
        <p className="text-white/80 text-xs font-medium text-center leading-tight mt-0.5">{title}</p>
      </motion.div>
    </motion.div>
  );
};

export default AgentCard;