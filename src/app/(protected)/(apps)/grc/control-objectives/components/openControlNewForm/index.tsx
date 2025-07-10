'use client'
import { Button } from '@/shadcn/ui/button'
import { useScroll } from 'framer-motion'
import React, { useState } from 'react'
import ControlNewForm from '../controlnewForm';
import { IconTextButtonWithTooltip } from '@/ikon/components/buttons';
import { Plus } from 'lucide-react';

export default function OpenControlNewForm(dataOfFrameworks: any) {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <>
             <IconTextButtonWithTooltip tooltipContent={"Create New Control"} onClick={()=>setOpen(true)}>
                <Plus />
            </IconTextButtonWithTooltip>
            {
                open &&
                <ControlNewForm open={open} setOpen={setOpen} dataOfFrameworks={dataOfFrameworks} editIncident={null}/>
            }
        </>
    )
}
