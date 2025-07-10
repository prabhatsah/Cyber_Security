'use client'
import { Button } from '@/shadcn/ui/button'
import { useScroll } from 'framer-motion'
import React, { useState } from 'react'
import { IconTextButtonWithTooltip } from '@/ikon/components/buttons';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

export default function OpenAskQueryForm() {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <>
            <Button type='button' variant='outline' onClick={() => setOpen(true)}>Ask Query</Button>
            {
                open &&
                <AskQueryForm open={open} setOpen={setOpen} />
            }
        </>
    )
}

export function AskQueryForm({ open, setOpen }: any) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ask Query Form</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    Work In Progress
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={() => { setOpen(false) }}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}