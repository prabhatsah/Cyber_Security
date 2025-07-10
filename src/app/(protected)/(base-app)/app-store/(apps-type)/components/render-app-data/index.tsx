'use client'

import { useContext, useEffect } from "react"
import { AppContext } from "../app-context"

export function RenderAppData({ appsData } : {appsData : string[]}) {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('Filter Data must be used within a StateProvider');
    }
    const {setAppsData} = context;
    useEffect(() => {
        setAppsData(appsData)
    }, [appsData])
    return null
}