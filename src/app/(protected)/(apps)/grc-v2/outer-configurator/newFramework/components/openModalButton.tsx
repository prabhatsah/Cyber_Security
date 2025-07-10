"use client"
import { Button } from '@/shadcn/ui/button';
import React, { useState } from 'react'
import useSWR from 'swr'
import FieldConfigurationForm from './fieldConfigurationForm';

export default function OpenModalButton() {
    const [fieldSelectionModal, setFieldSelectionModal] = useState<boolean>(false);
    return (
        <>
            <Button onClick={() => { setFieldSelectionModal(true) }}>
                Open Framework
            </Button>
            {
                fieldSelectionModal && (
                    <FieldConfigurationForm fieldSelectionModal={fieldSelectionModal} setFieldSelectionModal={setFieldSelectionModal} />
                )
            }
        </>
    )
}
