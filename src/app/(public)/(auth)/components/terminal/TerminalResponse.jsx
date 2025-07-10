import React from 'react';
import { motion } from 'framer-motion';
import AgentIntroduction from './AgentIntroduction';
import TypingEffect from './TypingEffect';
import { WELCOME_MESSAGE, RESPONSE_DELAY, AGENT_INTRO_DELAY } from './constants';

const TerminalResponse = ({ agents }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: RESPONSE_DELAY / 1000 }}
      className="mt-4 space-y-4"
    >
      <TypingEffect 
        text={WELCOME_MESSAGE}
        className="text-green-400 whitespace-pre-line"
      />
      <div className="space-y-2">
        {agents.map((agent, index) => (
          <AgentIntroduction
            key={agent.name}
            agent={agent}
            delay={RESPONSE_DELAY / 1000 + index * AGENT_INTRO_DELAY}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default TerminalResponse;