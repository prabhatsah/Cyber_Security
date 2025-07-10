import React from 'react';

const TerminalHeader = () => (
  <div className="flex items-center space-x-2 px-4 py-2 border-b border-gray-700 bg-gray-800 rounded-t-lg">
    <div className="w-3 h-3 rounded-full bg-red-500" />
    <div className="w-3 h-3 rounded-full bg-yellow-500" />
    <div className="w-3 h-3 rounded-full bg-green-500" />
    <span className="text-gray-400 text-sm ml-2 truncate">Keross Terminal</span>
  </div>
);

export default TerminalHeader;