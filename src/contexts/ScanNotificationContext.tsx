"use client";

import { ScanNotificationDataModified } from '@/components/type';
import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

// First, define the type
type ScanNotificationContextType = {
    scanNotificationData: ScanNotificationDataModified[];
    setScanNotificationData: Dispatch<SetStateAction<ScanNotificationDataModified[]>>;
    scanNotificationDataWithoutPentestId: ScanNotificationDataModified[];
    pentestIdWiseScanDetailsObj: Record<string, ScanNotificationDataModified[]>;
};

// Then, create context with correct type (nullable)
const ScanNotificationContext = createContext<ScanNotificationContextType | null>(null);

// Provider
export function ScanNotificationProvider({ children }: { children: ReactNode }) {
    const [scanNotificationData, setScanNotificationData] = useState<ScanNotificationDataModified[]>([]);

    const scanNotificationDataWithPentestId: ScanNotificationDataModified[] = [];
    const scanNotificationDataWithoutPentestId: ScanNotificationDataModified[] = [];

    scanNotificationData.forEach(eachScanNotificationData => {
        if (eachScanNotificationData.pentestId !== null && eachScanNotificationData.pentestId.trim().length > 0) {
            scanNotificationDataWithPentestId.push(eachScanNotificationData);
        } else {
            scanNotificationDataWithoutPentestId.push(eachScanNotificationData);
        }
    });

    const pentestIdWiseScanDetailsObj: Record<string, ScanNotificationDataModified[]> = {};
    scanNotificationDataWithPentestId.forEach(eachScanNotificationData => {
        if (!pentestIdWiseScanDetailsObj[eachScanNotificationData.pentestId]) {
            pentestIdWiseScanDetailsObj[eachScanNotificationData.pentestId] = [];
        }

        pentestIdWiseScanDetailsObj[eachScanNotificationData.pentestId].push(eachScanNotificationData);
    })

    return (
        <ScanNotificationContext.Provider value={{ scanNotificationData, setScanNotificationData, scanNotificationDataWithoutPentestId, pentestIdWiseScanDetailsObj }}>
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
