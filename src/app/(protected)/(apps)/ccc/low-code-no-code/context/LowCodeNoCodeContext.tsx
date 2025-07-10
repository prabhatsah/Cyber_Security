'use client'
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { chatPropTypes } from "../type";
interface LowCodeNoCodeContextType{
    // protocol:string,
    // metrices:Metrices[],
    // setMetrices: (data: Metrices[]) => void;
    // SetProtocol: (data: 'Snmp' | 'Ssh' | 'Windows') => void;
    // selectedMetrices:string[],
    // setSelectedMetrices:(data: string[]) => void;
    //  monitoringData:Object[],
    // setMonitoringData:(data: Object[]) => void;
    // visualisationDryRunCodeBody:string,
    // setVisualisationDryRunCodeBody:(data:any) => void,
    dryRunSuccess:boolean | null,
    setDryRunSuccess:(data:boolean | null) => void,
    // script:string,
    // setScript:(script:string) => void,
    dryRunResult: string | null,
    setDryRunResult: (data: string | null) => void,
    error: string[],
    setError: (data: string[]) => void,
    // resultType:'chart' | 'json' | null,
    // setResultType: (data: 'chart' | 'json' | null) => void,
    dryRunId: string | null,
    setDryRunId: (id: null | string) => void,
    // units:string,
    // setUnits:(data:string) => void
    chats: chatPropTypes[],
    setChats: (data: chatPropTypes[]) => void,
    
}


const LowCodeNoCodeContext = createContext<LowCodeNoCodeContextType | null>(null);

export function LowCodeNoCodeContextProvider({children} : {children : ReactNode}){
    

    // const [metrices, setMetrices] = useState<Metrices[]>([])
    // const [protocol, SetProtocol] = useState<'Snmp' | 'Ssh' | 'Windows'>('Windows')
    // const [selectedMetrices,setSelectedMetrices] = useState<string[]>([])
    // const [monitoringData,setMonitoringData] = useState<Object[]>([])
    //const [visualisationDryRunCodeBody,setVisualisationDryRunCodeBody] = useState<string>('')
    const [dryRunSuccess,setDryRunSuccess] = useState<boolean | null >(null)
    //const [script,setScript] = useState<'snmp' | 'nashorn' |'powershell' |'shell' |'vbscript'|''>('')
    const [dryRunResult,setDryRunResult] = useState<string | null>(null)
    const [error,setError] = useState<string[]>([])
    //const [resultType,setResultType] = useState<'chart' | 'json' |null>(null)
    const [dryRunId,setDryRunId] = useState<string | null>(null)
    //const [units,setUnits] = useState<string>('')
    const [chats,setChats] = useState<chatPropTypes[]>([])
    
    
    
    return (
        <LowCodeNoCodeContext.Provider value={{
            // metrices,
            // setMetrices,
            // protocol,
            // SetProtocol,
            // selectedMetrices,
            // setSelectedMetrices,
            // visualisationDryRunCodeBody,
            // setVisualisationDryRunCodeBody,
            // monitoringData,
            // setMonitoringData,
            dryRunSuccess,
            setDryRunSuccess,
            // script,
            // setScript,
            dryRunResult,
            setDryRunResult,
            error,
            setError,
            // resultType,
            // setResultType,
            dryRunId,
            setDryRunId,
            // units,
            // setUnits
            chats,
            setChats
            }}>
            { children }
        </LowCodeNoCodeContext.Provider>
    );
}

export function useLowCodeNoCodeContext(){
    const context = useContext(LowCodeNoCodeContext);

    if(!context){
        throw new Error('useContext must be used within ContextProvider')
    }

    return context;
}