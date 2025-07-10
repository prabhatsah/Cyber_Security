"use client"

import React, { createContext, useContext, useState } from "react"

interface LiveDataContextType {
  tempSetpoint: number
  settempSetpoint: React.Dispatch<React.SetStateAction<number>>
}

const LiveDataContext = createContext<LiveDataContextType | undefined>(undefined)

export const useLiveData = () => {
  const context = useContext(LiveDataContext)
  if (!context) throw new Error("useHvac must be used within HvacProvider")
  return context
}

export const LiveDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [tempSetpoint, settempSetpoint] = useState(22) // Example temperature setpoint value

  return (
    <LiveDataContext.Provider
      value={{
        tempSetpoint,
        settempSetpoint,
      }}
    >
      {children}
    </LiveDataContext.Provider>
  )
}
