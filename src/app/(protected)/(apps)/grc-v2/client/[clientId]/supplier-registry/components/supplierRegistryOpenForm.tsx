'use client';
import { Button } from '@/shadcn/ui/button';
import React, { useState } from 'react'
import SupplierRegistryForm from './supplierRegistryForm';

export default function SupplierRegistryOpenForm({ allUsers,clientId }:
    {
        allUsers: { value: string, label: string }[];
        clientId: string;
    }) {

    const [openSupplierRegistryForm, setOpenSupplierRegistryForm] = useState<boolean>(false);
    return (
        <>
            <Button onClick={() => { setOpenSupplierRegistryForm(true) }}>
                Add Supplier
            </Button>

            {
                openSupplierRegistryForm && (
                    <SupplierRegistryForm openSupplierRegistryForm={openSupplierRegistryForm} setOpenSupplierRegistryForm={setOpenSupplierRegistryForm} allUsers={allUsers} clientId={clientId}/>
                )
            }

        </>
    )
}
