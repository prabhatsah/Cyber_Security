"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ConfigurationContextType, ConfigurationData } from "./type";

const ConfigurationContext = createContext<
  ConfigurationContextType | undefined
>(undefined);

export function ConfigurationProvider({ children }: { children: ReactNode }) {
  const defaultConfigData: ConfigurationData = {
    "amazon-web-services": [],
    "microsoft-azure": [],
    "google-cloud-platform": [],
    "ibm-cloud": [],
    "oracle-cloud-infrastructure": [],
    "alibaba-cloud": [],
  };
  const [configurationData, setConfigurationData] =
    useState<ConfigurationData>(defaultConfigData);

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
