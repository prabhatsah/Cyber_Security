"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

// First, define the type
type ScanNotificationContextType = {
    scanNotificationData: any[];
    setScanNotificationData: Dispatch<SetStateAction<any[]>>;
};

// Then, create context with correct type (nullable)
const ScanNotificationContext = createContext<ScanNotificationContextType | null>(null);

// Provider
export function ScanNotificationProvider({ children }: { children: ReactNode }) {
    const [scanNotificationData, setScanNotificationData] = useState<any[]>([]);

    return (
        <ScanNotificationContext.Provider value={{ scanNotificationData, setScanNotificationData }}>
            {children}
        </ScanNotificationContext.Provider>
    );
}

// Hook to use it
export function useScanNotification() {
    const context = useContext(ScanNotificationContext);
    if (!context) {
        throw new Error('useScanNotification must be used within a ScanNotificationProvider');
    }
    return context;
}
