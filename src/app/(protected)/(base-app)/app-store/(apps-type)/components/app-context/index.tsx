'use client'
import { createContext, useState, ReactNode, Dispatch, SetStateAction, useContext, useEffect } from 'react';

// Define the type for the context value
interface AppContextType {
    searchQuery: string | undefined;
    setSearchQuery: Dispatch<SetStateAction<string | undefined>>
    // selectedValue: string | undefined;
    // setSelectedValue: Dispatch<SetStateAction<string | undefined>>;
    currentSelectedAppData: Record<string, any>;
    setCurrentSelectedAppData: Dispatch<SetStateAction<Record<string, any>>>;
    filterData: any;
    setFilterData: any;
    appsData: string[];
    setAppsData: Dispatch<SetStateAction<string[]>>;
    filterTypeField: string[] | undefined;
    setFilterTypeField: Dispatch<SetStateAction<string[] | undefined>>;
}
export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState<string | undefined>('');
    // const [selectedValue, setSelectedValue] = useState<string | undefined>('');
    const [currentSelectedAppData, setCurrentSelectedAppData] = useState<Record<string, any>>({});
    const [filterData, setFilterData] = useState({});
    const [appsData, setAppsData] = useState<string[]>([]);
    const [filterTypeField, setFilterTypeField] = useState<string[] | undefined>([]);


    return (
        <AppContext.Provider value={{filterTypeField,setFilterTypeField, appsData, setAppsData, searchQuery, setSearchQuery, currentSelectedAppData, setCurrentSelectedAppData, filterData, setFilterData }}>
            {children}
        </AppContext.Provider>
    );
}


