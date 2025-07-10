"use client"
import { useThemeOptions } from '@/ikon/components/theme-provider';
import { generateTheme } from '@/ikon/utils/actions/theme/generator';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import React, { useEffect, useState } from 'react'

function RadiusToggle() {
    const { state, dispatch } = useThemeOptions();

    useEffect(() => {
        const ikonThemeCSS = document.querySelector("#ikonThemeCSS") as HTMLElement
        if (!ikonThemeCSS) return
        ikonThemeCSS.innerHTML = generateTheme(state)
    }, [state.radius])

    return (
        <ToggleGroup type="single" variant='outline' value={state.radius} onValueChange={(value: string) => {
            dispatch({ type: "radius", payload: value })
        }}>
            <ToggleGroupItem className="rounded-e-none" value="0">
                0
            </ToggleGroupItem>
            <ToggleGroupItem className="rounded-none border-x-0" value="0.25">
                0.25
            </ToggleGroupItem>
            <ToggleGroupItem className='rounded-none' value="0.5">
                0.5
            </ToggleGroupItem>
            <ToggleGroupItem className='rounded-none border-x-0' value="0.75">
                0.75
            </ToggleGroupItem>
            <ToggleGroupItem className='rounded-s-none' value="1">
                1
            </ToggleGroupItem>
        </ToggleGroup>
    )
}

export default RadiusToggle