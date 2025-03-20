"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbContextType = {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const useBreadcrumb = (): BreadcrumbContextType => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
};

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);
  return (
    <BreadcrumbContext.Provider value={{ items, setItems }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
