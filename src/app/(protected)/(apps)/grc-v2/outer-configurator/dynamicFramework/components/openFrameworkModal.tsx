"use client"
import { Button } from '@/shadcn/ui/button';
import React, { useState } from 'react'
import FrameworkTab from './frameworkTab';


export default function OpenFrameworkModal() {
    const [openFrameworkTab, setOpenFrameworkTab] = useState<boolean>(false);
    return (
        <>
            <Button onClick={() => { setOpenFrameworkTab(true) }}>
                Open Framework
            </Button>
            {
                openFrameworkTab && (
                    <FrameworkTab openFrameworkTab={openFrameworkTab} setOpenFrameworkTab={setOpenFrameworkTab} />
                )
            }
        </>
    )
}
