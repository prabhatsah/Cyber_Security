'use client'
import React, { useState, useEffect } from 'react';
import TerminalPrompt from './TerminalPrompt';
import TerminalResponse from './TerminalResponse';

const TerminalContent = ({ agents }) => {
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowResponse(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 font-mono text-sm space-y-4">
      <TerminalPrompt />
      {showResponse && <TerminalResponse agents={agents} />}
    </div>
  );
};

export default TerminalContent;