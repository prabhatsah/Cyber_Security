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

export default function RiskCategoryViewDataTable({ open, setOpen, riskCategoryData, }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; riskCategoryData: Record<string, string>[] }) {

    const flatRiskCategoryData = Array.isArray(riskCategoryData)
            ? riskCategoryData.flatMap(obj =>
                obj.riskCategory ? Object.values(obj.riskCategory) : []
            )
            : [];

    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: 'slNo',
            header: 'Sl No.',
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: 'riskCategory',
            header: 'Risk Category',
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
                    <DialogTitle>View Risk Category</DialogTitle>
                    <DialogDescription>View your risk Category</DialogDescription>
                </DialogHeader>
                <div className="h-4/5 overflow-y-auto">
                    <DataTable data={flatRiskCategoryData} columns={columns} extraParams={extraParams} />
                </div>
            </DialogContent>
        </Dialog>
    )
}