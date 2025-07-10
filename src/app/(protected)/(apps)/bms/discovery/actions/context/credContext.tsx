import { useContext, ReactNode, useState,createContext } from "react";

import { CredentialType } from "../../type";

interface GlobalCredContextType {
    globalCredData: Record<CredentialType, any[]>;
    setGlobalCredData: (data: Record<CredentialType, any[]>) => void;
    updatedCreds: string[];
    setUpdatedCreds: (creds: string[]) => void;
  }
  
  // Create the context
  const GlobalCredContext = createContext<GlobalCredContextType | undefined>(undefined);
  
  // Custom hook to use the context
  export const useGlobalCred = () => {
    const context = useContext(GlobalCredContext);
    if (context === undefined) {
      throw new Error('useGlobalCred must be used within a GlobalCredProvider');
    }
    return context;
  };
  
  // Provider component
  export const GlobalCredProvider = ({ children }: { children: ReactNode }) => {
    const [globalCredData, setGlobalCredData] = useState<Record<CredentialType, any[]>>({
      Windows: [],
      Parameter: [],
      SSH: [],
      SNMP: [],
    });
    const [updatedCreds,setUpdatedCreds] = useState<string[]>([])
  
    return (
      <GlobalCredContext.Provider value={{ globalCredData, setGlobalCredData,updatedCreds,setUpdatedCreds }}>
        {children}
      </GlobalCredContext.Provider>
    );
  };