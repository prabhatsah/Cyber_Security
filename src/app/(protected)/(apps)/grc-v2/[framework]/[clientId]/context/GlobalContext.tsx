'use client'

import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { ProfileDataType } from "../discoveredDevices/types";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getProfileData } from "@/ikon/utils/actions/auth";

interface GlobalContextType{
    PROFILE_DETAILS: ProfileDataType | null,
    CURRENT_SOFTWARE_ID: string;
    CURRENT_ACCOUNT_ID: string;
    
    
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export function GlobalContextProvider({children} : {children : ReactNode}){
    //const globalData: GlobalContextType  = {};

    const [globalData, setGlobalData] = useState<GlobalContextType>({
        PROFILE_DETAILS: null,
        CURRENT_ACCOUNT_ID: '',
        CURRENT_SOFTWARE_ID: '',
        
    });
    
    useEffect(()=>{
        const fetchData = async () => {
            const softwareName = "ITSM";
            const version = "1";
            
            const softwareId = await getSoftwareIdByNameVersion(softwareName, version);
            const accountId = await getActiveAccountId();
            const profileData = await getProfileData() as ProfileDataType;


            console.log('profile context: ', profileData);
            console.log('account context: ', accountId);
            console.log('software context: ', softwareId);

            setGlobalData({
                PROFILE_DETAILS: profileData,
                CURRENT_ACCOUNT_ID: accountId,
                CURRENT_SOFTWARE_ID: softwareId,
                
            })
        }

        fetchData();

    }, []);
    
    return (
        <GlobalContext.Provider value={globalData}>
            { children }
        </GlobalContext.Provider>
    );
}

export function useGlobalContext(){
    const context = useContext(GlobalContext);

    if(!context){
        throw new Error('useGlobalContext must be used within GlobalContextProvider')
    }

    return context;
}