import React from 'react';
import { motion } from 'framer-motion';

const TerminalPrompt = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center space-x-2 text-green-400"
  >
    <span className="text-blue-400">visitor@keross</span>
    <span className="text-gray-400">:</span>
    <span className="text-purple-400">~</span>
    <span className="text-gray-400">$</span>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1 }}
      className="ml-2"
    >
      ▊
    </motion.span>
  </motion.div>
);

export default TerminalPrompt;