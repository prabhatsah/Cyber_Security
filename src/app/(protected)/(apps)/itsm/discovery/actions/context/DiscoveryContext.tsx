'use client'
import  { createContext, useContext, useState, ReactNode } from 'react';

interface DiscoveryContextProps {
    discoveryStarted: boolean;
    setDiscoveryStarted: (started: boolean) => void;
    discoveryProgress: object;
    setDiscoveryProgress: (progress: object) => void;
}

const DiscoveryContext = createContext<DiscoveryContextProps | undefined>(undefined);

export const DiscoveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [discoveryStarted, setDiscoveryStarted] = useState<boolean>(false);
    const [discoveryProgress, setDiscoveryProgress] = useState<object>({
        deviceDiscoveryStarted: false,
        startingDiscovery:false,
        discoveringIPOnlyDevices:false,
        basicDiscoveryCompleted:false,
        DiscoveryCompleted:false
    });

    return (
        <DiscoveryContext.Provider value={{ discoveryStarted, setDiscoveryStarted,discoveryProgress, setDiscoveryProgress }}>
            {children}
        </DiscoveryContext.Provider>
    );
};

export const useDiscovery = (): DiscoveryContextProps => {
    const context = useContext(DiscoveryContext);
    if (!context) {
        throw new Error('useDiscovery must be used within a DiscoveryProvider');
    }
    return context;
};