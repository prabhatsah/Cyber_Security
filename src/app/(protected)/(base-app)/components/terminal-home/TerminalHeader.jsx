import React from 'react';

const TerminalHeader = () => (
  <div className="flex items-center space-x-2 px-4 py-2 border-b bg-primary text-primary-foreground rounded-t-lg">
    <div className="w-3 h-3 rounded-full bg-red-500" />
    <div className="w-3 h-3 rounded-full bg-yellow-500" />
    <div className="w-3 h-3 rounded-full bg-green-500" />
    <span className="text-sm ml-2 truncate">Keross Terminal</span>
  </div>
);

export default TerminalHeader;