"use client";

import { PentestEachSubScan, ScanNotificationDataModified, ScanNotificationDataWithGroupedPentestId } from '@/components/type';
import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

// First, define the type
type ScanNotificationContextType = {
    scanNotificationData: ScanNotificationDataModified[];
    setScanNotificationData: Dispatch<SetStateAction<ScanNotificationDataModified[]>>;
    scanNotificationDataWithoutPentestId: ScanNotificationDataModified[];
    scanNotificationDataWithPentestId: ScanNotificationDataWithGroupedPentestId[];
};

// Then, create context with correct type (nullable)
const ScanNotificationContext = createContext<ScanNotificationContextType | null>(null);

// Provider
export function ScanNotificationProvider({ children }: { children: ReactNode }) {
    const [scanNotificationData, setScanNotificationData] = useState<ScanNotificationDataModified[]>([]);

    const pentestIdWiseScanDetailsObj: Record<string, ScanNotificationDataModified[]> = {};
    const scanNotificationDataWithoutPentestId: ScanNotificationDataModified[] = [];

    scanNotificationData.forEach(eachScanNotificationData => {
        if (eachScanNotificationData.pentestId && eachScanNotificationData.pentestId.trim().length > 0) {
            !pentestIdWiseScanDetailsObj[eachScanNotificationData.pentestId] ? pentestIdWiseScanDetailsObj[eachScanNotificationData.pentestId] = [] : undefined;
            pentestIdWiseScanDetailsObj[eachScanNotificationData.pentestId].push(eachScanNotificationData);
        } else {
            scanNotificationDataWithoutPentestId.push(eachScanNotificationData);
        }
    });


    const scanNotificationDataWithPentestId: ScanNotificationDataWithGroupedPentestId[] = [];
    for (const eachPentestId in pentestIdWiseScanDetailsObj) {
        const eachPentestDetails = pentestIdWiseScanDetailsObj[eachPentestId];
        const latestToolMap = new Map<string, PentestEachSubScan>();
        eachPentestDetails.forEach(eachSubScanDetails => {
            const existing = latestToolMap.get(eachSubScanDetails.tool);
            if (!existing || new Date(eachSubScanDetails.startTime).getTime() > new Date(existing.startTime).getTime()) {
                latestToolMap.set(eachSubScanDetails.tool, {
                    tool: eachSubScanDetails.tool,
                    endTime: eachSubScanDetails.endTime,
                    startTime: eachSubScanDetails.startTime,
                    status: eachSubScanDetails.status,
                    scanId: eachSubScanDetails.scanId,
                });
            }
        });
        scanNotificationDataWithPentestId.push({
            pentestId: eachPentestId,
            target: eachPentestDetails[0].target,
            subScanDetails: Array.from(latestToolMap.values()),
        });
    }

    return (
        <ScanNotificationContext.Provider value={{ scanNotificationData, setScanNotificationData, scanNotificationDataWithoutPentestId, scanNotificationDataWithPentestId }}>
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
