"use client"
import { useThemeOptions } from '@/ikon/components/theme-provider';
import React, { useEffect } from 'react'

function ModeSelctor({ mode }: { mode: string }) {
    const { state, dispatch, fontNameWiseClassName } = useThemeOptions();

    useEffect(() => {
        const root = document.querySelector(":root") as HTMLElement
        root.className = state.mode
    }, [state.mode])

    return (
        <div className='flex flex-col gap-3 w-[250px]'>
            <div className={'flex justify-between w-full p-2 cursor-pointer' + (state.mode == mode ? ' border rounded-md' : '')}
                onClick={() => dispatch({ type: "mode", payload: mode })}>
                <div className={'flex flex-col items-center gap-3 rounded-md p-3 w-full' + (mode === "dark" ? " bg-gray-900" : " bg-slate-300")}>
                    {[1, 2, 3].map((v) =>
                        <div className='flex items-center gap-3 bg-white w-full p-2 rounded-md' key={v}>
                            <div className={'w-7 h-7 rounded-full' + (mode === "dark" ? " bg-gray-900" : " bg-slate-300")}></div>
                            <div className='flex flex-col flex-grow gap-1'>
                                <div className={'h-3 rounded-xl w-[80%]' + (mode === "dark" ? " bg-gray-900" : " bg-slate-300")}>
                                </div>
                                <div className={'h-3 rounded-xl' + (mode === "dark" ? " bg-gray-900" : " bg-slate-300")}>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='flex items-center justify-center'>
                {mode == 'light' ? 'Light' : 'Dark'}
            </div>
        </div>
    )
}

export default ModeSelctor