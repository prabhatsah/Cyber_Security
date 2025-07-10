'use client'

import { useContext, useEffect } from "react"
import { AppContext } from "../app-context"

export function RenderFilterData({ filtersDataType } : {filtersDataType : string[]}) {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('Filter Data must be used within a StateProvider');
    }
    const {setFilterTypeField} = context;
    useEffect(() => {
        setFilterTypeField(filtersDataType)
    }, [filtersDataType])
    return null
}