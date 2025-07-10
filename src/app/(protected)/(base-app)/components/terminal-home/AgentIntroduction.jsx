import React from 'react';
import { motion } from 'framer-motion';
import defaultAvatar from '../assets/default-avatar.svg';
import Image from 'next/image';

const AgentIntroduction = ({ agent, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-primary"
  >
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="relative flex-shrink-0"
    >
      <Image
        src={agent.avatar || defaultAvatar}
        alt={agent.name}
        className="w-10 h-10 rounded-full border-1 border-primary object-cover bg-gray-800"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultAvatar;
        }}
      />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-1 border-gray-900" />
    </motion.div>
    <div className="min-w-0">
      <div className="flex items-center space-x-2">
        <span className="text-blue-400 font-medium truncate">{agent.name}</span>
        <span className="text-gray-400 truncate">- {agent.title}</span>
      </div>
      <div className="text-xs text-green-400 mt-0.5 truncate">{agent.expertise}</div>
    </div>
  </motion.div>
);

export default AgentIntroduction;