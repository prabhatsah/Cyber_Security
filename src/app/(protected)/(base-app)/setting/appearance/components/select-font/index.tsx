"use client"
import { useThemeOptions } from '@/ikon/components/theme-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import React, { useEffect } from 'react'


function SelectFont() {
    const { state, dispatch, fontNameWiseClassName } = useThemeOptions();

    useEffect(() => {
        const bodyEl = document.querySelector("body") as HTMLElement
        bodyEl.className = fontNameWiseClassName[state.font]
    }, [state.font])

    return (
        <Select value={state.font} onValueChange={(value) => dispatch({ type: "font", payload: value })}>
            <SelectTrigger className="max-w-[300px]">
                <SelectValue placeholder="Select Font" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Oswald">Oswald</SelectItem>
                <SelectItem value="Outfit">Outfit</SelectItem>
                <SelectItem value="Poppins">Poppins</SelectItem>
            </SelectContent>
        </Select>
    )
}

export default SelectFont