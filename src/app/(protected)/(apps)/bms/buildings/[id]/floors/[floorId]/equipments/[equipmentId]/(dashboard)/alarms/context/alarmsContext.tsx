"use client"

import React, { createContext, useContext, useState } from "react"

interface AlarmsContextType {
  createAlert: boolean
  setCreateAlert: React.Dispatch<React.SetStateAction<boolean>>
  createQuery: boolean
  setCreateQuery: React.Dispatch<React.SetStateAction<boolean>>
  createCondition: boolean
  setCreateCondition: React.Dispatch<React.SetStateAction<boolean>>
  expressionInfo: any[], 
  setExpressionInfo: React.Dispatch<React.SetStateAction<any[]>>
  conditionInfo: any[], 
  setConditionInfo: React.Dispatch<React.SetStateAction<any[]>>
  expressionCreated: boolean
  setExpressionCreated: React.Dispatch<React.SetStateAction<boolean>>
  editData: any
  setEditData: React.Dispatch<React.SetStateAction<any>>
  editConditionData: any
  setEditConditionData: React.Dispatch<React.SetStateAction<any>>
  editAlertData: any
  setEditAlertData: React.Dispatch<React.SetStateAction<any>>
  viewMode: boolean
  setViewMode: React.Dispatch<React.SetStateAction<boolean>>
}

const AlarmContext = createContext<AlarmsContextType | undefined>(undefined)

export const useAlarms = () => {
  const context = useContext(AlarmContext)
  if (!context) throw new Error("useHvac must be used within HvacProvider")
  return context
}

export const AlarmProvider = ({ children }: { children: React.ReactNode }) => {
  const [createAlert, setCreateAlert] = useState(false)
  const [createQuery, setCreateQuery] = useState(false)
  const [createCondition, setCreateCondition] = useState(false)
  const [expressionCreated, setExpressionCreated] = useState(false)
  const [expressionInfo, setExpressionInfo] = useState<any[]>([])
  const [conditionInfo, setConditionInfo] = useState<any[]>([])
  const [editData, setEditData] = useState<any>(null);
  const [editConditionData, setEditConditionData] = useState<any>(null);
  const [editAlertData, setEditAlertData] = useState<any>(null);
  const [viewMode, setViewMode] = useState(false)

  return (
    <AlarmContext.Provider
      value={{
        createAlert, 
        setCreateAlert,
        createQuery, 
        setCreateQuery,
        createCondition, 
        setCreateCondition,
        expressionInfo, 
        setExpressionInfo,
        conditionInfo, 
        setConditionInfo,
        expressionCreated, 
        setExpressionCreated,
        editData, 
        setEditData,
        editConditionData, 
        setEditConditionData,
        editAlertData, 
        setEditAlertData,
        viewMode, 
        setViewMode
      }}
    >
      {children}
    </AlarmContext.Provider>
  )
}
