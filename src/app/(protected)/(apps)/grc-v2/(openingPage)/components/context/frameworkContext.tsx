"use client";
import React, { createContext, useContext, useState } from "react";

export interface frameworkProps {
  id?: string;
  title: string;
  description: string;
  score: number;
}

export interface subscribeProps {
    frameworkId: string;
    clientId: string;
}

type FrameworkContextProps = {
  frameworks: frameworkProps[]; // Replace 'any' with your actual framework type
  setFrameworks: React.Dispatch<React.SetStateAction<frameworkProps[]>>;
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  subscribeData: subscribeProps[];
  setSubscribeData: React.Dispatch<React.SetStateAction<subscribeProps[]>>;
  allUsers: {value: string,label:string}[];
};
export const FrameworkContext = createContext<FrameworkContextProps | null>(null);

export default function FrameworkContextProvider({children, allUsers}: { children: React.ReactNode, allUsers: {value: string,label:string}[] }) {
  const [frameworks, setFrameworks] = useState<frameworkProps[]>([]); // Initialize with null or an empty array
  const [userId, setUserId] = useState<string>('');
  const [subscribeData, setSubscribeData] = useState<subscribeProps[]>([]);

  return (
    <FrameworkContext.Provider
      value={{
       frameworks,
       setFrameworks,
       userId,
       setUserId,
       subscribeData,
       setSubscribeData,
       allUsers
      }}
    >
      {children}
    </FrameworkContext.Provider>
  );
}

export function FrameworkMainContext() {
  const context = useContext(FrameworkContext);
  if (!context) {
    throw new Error("Not within FrameworkContextProvider");
  }
  return context;
}
