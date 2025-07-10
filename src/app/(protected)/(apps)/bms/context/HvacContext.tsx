"use client"

import React, { createContext, useContext, useState } from "react"

interface HvacContextType {
  temperature: number
  setTemperature: React.Dispatch<React.SetStateAction<number>>
  fanSpeed: string
  setFanSpeed: React.Dispatch<React.SetStateAction<string>>
  hvacMode: string
  setHvacMode: React.Dispatch<React.SetStateAction<string>>
  hvacPower: boolean
  setHvacPower: React.Dispatch<React.SetStateAction<boolean>>
  pressure: number
  setPressure: React.Dispatch<React.SetStateAction<number>>
  co2Level: number
  setCo2Level: React.Dispatch<React.SetStateAction<number>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isChangesApplied: boolean
  setIsChangesApplied: React.Dispatch<React.SetStateAction<boolean>>
}

const HvacContext = createContext<HvacContextType | undefined>(undefined)

export const useHvac = () => {
  const context = useContext(HvacContext)
  if (!context) throw new Error("useHvac must be used within HvacProvider")
  return context
}

export const HvacProvider = ({ children }: { children: React.ReactNode }) => {
  const [temperature, setTemperature] = useState(22)
  const [fanSpeed, setFanSpeed] = useState("auto")
  const [hvacMode, setHvacMode] = useState("cooling")
  const [hvacPower, setHvacPower] = useState(true)
  const [pressure, setPressure] = useState(1013) // Example pressure value
  const [co2Level, setCo2Level] = useState(400) // Example CO2 level value
  const [isLoading, setIsLoading] = useState(false)
  const [isChangesApplied, setIsChangesApplied] = useState(false)

  return (
    <HvacContext.Provider
      value={{
        temperature,
        setTemperature,
        fanSpeed,
        setFanSpeed,
        hvacMode,
        setHvacMode,
        hvacPower,
        setHvacPower,
        pressure,
        setPressure,
        co2Level,
        setCo2Level,
        isLoading,
        setIsLoading,
        isChangesApplied,
        setIsChangesApplied
      }}
    >
      {children}
    </HvacContext.Provider>
  )
}
