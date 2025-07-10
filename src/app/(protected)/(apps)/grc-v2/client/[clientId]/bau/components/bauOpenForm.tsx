'use client';
import { Button } from '@/shadcn/ui/button';
import React, { useState } from 'react'
import BauForm from './bauForm';
import { OptionGroup } from '@/shadcn/ui/grouped-checkbox-dropdown';

export default function BauOpenForm({ allUsers, dropDownControl, referencedPolicyMap, bauTaskFreqMap, clientId }:
    {
        allUsers: { value: string, label: string }[];
        dropDownControl: OptionGroup[];
        referencedPolicyMap: { value: string, label: string }[];
        bauTaskFreqMap: { value: string, label: string }[];
        clientId?: string;
    }) {

    const [openBauForm, setOpenBauForm] = useState<boolean>(false);
    return (
        <>
            <Button onClick={() => { setOpenBauForm(true) }}>
                Add Task
            </Button>
            {
                openBauForm &&
                <BauForm
                    openBauForm={openBauForm}
                    setOpenBauForm={setOpenBauForm}
                    allUsers={allUsers}
                    dropDownControl={dropDownControl}
                    referencedPolicyMap={referencedPolicyMap}
                    bauTaskFreqMap={bauTaskFreqMap}
                    clientId={clientId}
                />
            }

        </>
    )
}
