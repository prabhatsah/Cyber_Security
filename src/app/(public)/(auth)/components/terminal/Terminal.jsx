'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TerminalHeader from './TerminalHeader';
import TerminalPrompt from './TerminalPrompt';
import TerminalResponse from './TerminalResponse';
import { agentProfiles } from '../agents/AgentData';

const Terminal = () => {
  const [showResponse, setShowResponse] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowResponse(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 rounded-lg border border-gray-700 shadow-xl w-full max-w-lg mx-auto overflow-hidden"
    >
      <TerminalHeader />
      <div className="p-4 font-mono text-sm space-y-4 max-h-[60vh] overflow-y-auto">
        <TerminalPrompt />
        {showResponse && <TerminalResponse agents={Object.values(agentProfiles)} />}
      </div>
    </motion.div>
  );
};

export default Terminal;