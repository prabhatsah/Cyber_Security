'use client'
import { Button } from '@/shadcn/ui/button'
import { useScroll } from 'framer-motion'
import React, { useState } from 'react'
import { IconTextButtonWithTooltip } from '@/ikon/components/buttons';
import { Plus } from 'lucide-react';
import AddCustomObjectiveForm from '../addCustomObjectiveForm';

export default function OpenCustomObjectiveForm() {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <>
            <IconTextButtonWithTooltip tooltipContent={"Add Custom Objective"} onClick={() => setOpen(true)}>
                <Plus />
            </IconTextButtonWithTooltip>
            {
                open &&
                <AddCustomObjectiveForm open={open} setOpen={setOpen} />
            }
        </>
    )
}
