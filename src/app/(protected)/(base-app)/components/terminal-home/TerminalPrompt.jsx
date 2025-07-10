import React from 'react';
import { motion } from 'framer-motion';

const TerminalPrompt = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center space-x-2"
  >
    <span>visitor@keross : ~ $</span>
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