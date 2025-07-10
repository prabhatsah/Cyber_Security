"use client";
import React, { useEffect, useState } from "react";
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

export default function TaskFrequencyViewDataTable({ open, setOpen, taskFrquencyData, profileData }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; taskFrquencyData: Record<string, string>[]; profileData: Record<string, string>[] }) {

    const [taskFrequencyTableData, setTaskFrequencyTableData] = useState<any[]>([]);
    let frameworkTypeData: Record<string, string> = {};

    useEffect(() => {
        // Initialize the table with incoming data
        const validData = (taskFrquencyData || []).filter(Boolean);

        if (validData.length === 0) {
            setTaskFrequencyTableData([]);
            return;
        }

        const initialData = Array.isArray(taskFrquencyData)
            ? taskFrquencyData.flatMap(obj =>
                obj.taskFrequency ? Object.values(obj.taskFrequency) : []
            )
            : [];


        setTaskFrequencyTableData(initialData);
    }, [taskFrquencyData]);


    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: 'slNo',
            header: 'Sl No.',
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: 'taskType',
            header: 'Task Type',
        },
        {
            accessorKey: 'order',
            header: 'Order No.'
        }
    ];


    const extraParams: DTExtraParamsProps = {
        pagination: false,
        grouping: false
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[50%] flex flex-col">
                <DialogHeader>
                    <DialogTitle>View Task Frequency</DialogTitle>
                    <DialogDescription>View your task frequency</DialogDescription>
                </DialogHeader>
                <div className="h-4/5 overflow-y-auto">
                    <DataTable data={taskFrequencyTableData} columns={columns} extraParams={extraParams} />
                </div>
            </DialogContent>
        </Dialog>
    )
}