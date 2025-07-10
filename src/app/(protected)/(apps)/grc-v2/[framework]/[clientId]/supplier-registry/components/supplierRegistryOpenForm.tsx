'use client';
import { Button } from '@/shadcn/ui/button';
import React, { useState } from 'react'
import SupplierRegistryForm from './supplierRegistryForm';

export default function SupplierRegistryOpenForm({ allUsers }:
    {
        allUsers: { value: string, label: string }[];
    }) {

    const [openSupplierRegistryForm, setOpenSupplierRegistryForm] = useState<boolean>(false);
    return (
        <>
            <Button onClick={() => { setOpenSupplierRegistryForm(true) }}>
                Add Task
            </Button>

            {
                openSupplierRegistryForm && (
                    <SupplierRegistryForm openSupplierRegistryForm={openSupplierRegistryForm} setOpenSupplierRegistryForm={setOpenSupplierRegistryForm} allUsers={allUsers} />
                )
            }

        </>
    )
}
