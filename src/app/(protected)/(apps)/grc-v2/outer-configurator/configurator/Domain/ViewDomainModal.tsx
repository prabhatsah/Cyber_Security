"use client";
import React, { useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shadcn/ui/dialog';

export default function DomainViewDataTable({ open, setOpen, domainData }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; domainData: Record<string, string>[] }) {



    const flatDomainData = domainData.flatMap(obj =>
        obj.domain
            ? Object.values(obj.domain).map(entry => ({
                ...entry,
            }))
            : []
    );

    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: 'slNo',
            header: 'Sl No.',
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: 'domain',
            header: 'Domain',
        },

    ];


    const extraParams: DTExtraParamsProps = {
        pagination: false,
        grouping: false
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[50%] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>View Domain</DialogTitle>
                    <DialogDescription>View your Domains</DialogDescription>
                </DialogHeader>
                <div className="h-[30rem] overflow-y-auto">
                    <DataTable data={flatDomainData} columns={columns} extraParams={extraParams} />
                </div>
            </DialogContent>
        </Dialog>
    )
}