"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ConfigurationContextType {
  configurationData: Record<string, any>;
  setConfigurationData: (data: Record<string, any>) => void;
}

const ConfigurationContext = createContext<
  ConfigurationContextType | undefined
>(undefined);

export function ConfigurationProvider({ children }: { children: ReactNode }) {
  const [configurationData, setConfigurationData] = useState<
    Record<string, any>
  >({});

  return (
    <ConfigurationContext.Provider
      value={{ configurationData, setConfigurationData }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
}

export function useConfiguration() {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error(
      "useConfiguration must be used within a ConfigurationProvider"
    );
  }
  return context;
}
