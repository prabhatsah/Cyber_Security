'use client'
import { Button } from '@/shadcn/ui/button'
import { useScroll } from 'framer-motion'
import React, { useState } from 'react'
import IncidentForm from '../incidentForm';
import { IconTextButtonWithTooltip } from '@/ikon/components/buttons';
import { Plus } from 'lucide-react';

export default function OpenIncidentForm({userIdNameMap}: {userIdNameMap: {value:string,label:string}[]}) {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <>
             <IconTextButtonWithTooltip tooltipContent={"Create New Incident"} onClick={()=>setOpen(true)}>
                <Plus />
            </IconTextButtonWithTooltip>
            {
                open &&
                <IncidentForm open={open} setOpen={setOpen} userIdNameMap={userIdNameMap} editIncident={null}/>
            }
        </>
    )
}
