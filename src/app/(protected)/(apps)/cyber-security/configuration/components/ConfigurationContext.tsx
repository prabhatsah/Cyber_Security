"use client";

import React, { createContext, useContext } from "react";
// import { ConfigurationContextType, ConfigurationData } from "./type";

// Create a context for the configData
const ConfigurationContext = createContext<any>(null);

export const ConfigurationProvider = ({
  children,
  configData,
}: {
  children: React.ReactNode;
  configData: any;
}) => {
  return (
    <ConfigurationContext.Provider value={configData}>
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useConfiguration = () => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error(
      "useConfiguration must be used within a ConfigurationProvider"
    );
  }
  return context;
};
