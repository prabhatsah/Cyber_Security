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

export default function RiskImpactViewDataTable({ open, setOpen, riskImpactData }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; riskImpactData: Record<string, string>[] }) {

    const flatRiskImpactData = Array.isArray(riskImpactData)
        ? riskImpactData.flatMap(obj =>
            obj.riskImpact ? Object.values(obj.riskImpact) : []
        )
        : [];

    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: 'slNo',
            header: 'Sl No.',
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: 'riskImpact',
            header: 'Risk Impact',
            cell: ({ row }) => (
                <div className="truncate max-w-[100px]" title={row.getValue("riskImpact")}>
                    {row.getValue("riskImpact")}
                </div>
            ),
        },
        {
            accessorKey: 'riskValue',
            header: 'Impact Value',
        },
        {
            accessorKey: 'riskImpactWeightage',
            header: 'Impact Weightage',
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => (
                <div className="truncate max-w-[100px]" title={row.getValue("description")}>
                    {row.getValue("description")}
                </div>
            ),
        },
    ];


    const extraParams: DTExtraParamsProps = {
        pagination: false,
        grouping: false
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[50%] flex flex-col">
                <DialogHeader>
                    <DialogTitle>View Risk Impact</DialogTitle>
                    <DialogDescription>View your risk impact</DialogDescription>
                </DialogHeader>
                <div className="h-4/5 overflow-y-auto">
                    <DataTable data={flatRiskImpactData} columns={columns} extraParams={extraParams} />
                </div>
            </DialogContent>
        </Dialog>
    )
}