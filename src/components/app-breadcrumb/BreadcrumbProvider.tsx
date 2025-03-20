"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for a breadcrumb item
export interface BreadcrumbItemProps {
  title: string;
  href?: string;
  level: number;
}

// Define the type for the context state
interface BreadcrumbContextType {
  breadcrumbItems: BreadcrumbItemProps[];
  addBreadcrumb: (item: BreadcrumbItemProps) => void;
  backBreadcrumb: (item: BreadcrumbItemProps) => void;
}

// Create the context with a default value
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

// Create a provider component
export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItemProps[]>([]);
  // Function to add a breadcrumb item
  const addBreadcrumb = (item: BreadcrumbItemProps) => {
    setBreadcrumbItems((prevItems) => {
      const filterState = prevItems.filter((e) => e.level < item.level);
      return [...filterState, item];
    });
  };

  // Function to go back in the breadcrumb
  const backBreadcrumb = (item: BreadcrumbItemProps) => {
    setBreadcrumbItems((prevItems) => {
      const filterState = prevItems.filter((e) => e.level <= item.level);
      return [...filterState];
    });
  };

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbItems, addBreadcrumb, backBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

// Custom hook to use the BreadcrumbContext
export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}