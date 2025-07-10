'use client'
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { format } from 'date-fns';
import React, { useState } from 'react'
import OpenControlNewForm from '../openControlNewForm';
import { Button } from '@/shadcn/ui/button';
import ControlNewForm from '../controlnewForm';
import { SAVE_DATE_FORMAT, SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import { Plus, SquarePenIcon } from 'lucide-react';
import { IconButtonWithTooltip } from '@/ikon/components/buttons';

export default function ControlNewDataTable({ controlNewDatas, formData }: { controlNewDatas: any; formData: any }) {

    console.log(controlNewDatas);

    const [openIncidentForm, setOpenIncidentForm] = useState<boolean>(false);
    const [editRow, setEditRow] = useState<Record<string, string> | null>(null);
   

    function openModal(row: Record<string, string> | null) {
        setEditRow(row);
        setOpenIncidentForm(true);
    }
    const columnsControlNewTable: DTColumnsProps<Record<string, string>>[] = [
        {
            accessorKey: "framework",
            header: "Framework",
            cell: ({ row }) => {
                const formatted = row.original.framework
                    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
                    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
            
                return <div className="capitalize">{formatted}</div>;
            },
        },
        {
            accessorKey: "frameworkType",
            header: "Framework Type",
            cell: ({ row }) => (
                <div className="capitalize">{row.original.frameworkType}</div>
            ),
        },
        {
            accessorKey: "controlName",
            header: "Control Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.original.controlName}</div>
            ),
        },
        {
            id: 'actions',
            header: 'Action',
            enableHiding: false,
            cell: ({ row }) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal(row.original)} // Pass the full row
                >
                    <SquarePenIcon />
                </Button>
            ),
        },
    ];

    const extraParamsControlNewTable: DTExtraParamsProps = {
        extraTools: [
            <IconButtonWithTooltip tooltipContent="Add Controls" onClick={() => openModal(null)}>
                <Plus />
            </IconButtonWithTooltip>
        ],
    }
    return (
        <>
            <DataTable data={controlNewDatas} columns={columnsControlNewTable} extraParams={extraParamsControlNewTable} />
            {
                openIncidentForm &&
                <ControlNewForm open={openIncidentForm} setOpen={setOpenIncidentForm} dataOfFrameworks={formData} editControl={editRow} />
            }
        </>
    )
}
