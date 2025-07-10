"use client";

import React, { useState } from "react";

const LogsPage: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);

    // Function to append logs dynamically
    const addLog = (log: string) => {
        setLogs((prevLogs) => [...prevLogs, log]);
    };

    return (
        <div className="p-6 bg-black min-h-screen text-white">
            <h2 className="text-xl font-bold mb-4">📜 Live Logs</h2>

            <div className="max-h-64 overflow-y-auto bg-gray-800 p-4 rounded-lg border border-gray-700">
                {logs.length > 0 ? (
                    logs.map((log, index) => (
                        <div key={index} className="text-sm text-gray-300 mb-1">
                            {log}
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No logs available yet...</p>
                )}
            </div>

            {/* Simulate adding logs externally */}
            <button
                className="mt-4 bg-blue-600 px-4 py-2 rounded"
                onClick={() => addLog(`[${new Date().toLocaleTimeString()}] New log entry`)}
            >
                Add Log
            </button>
        </div>
    );
};

export default LogsPage;
