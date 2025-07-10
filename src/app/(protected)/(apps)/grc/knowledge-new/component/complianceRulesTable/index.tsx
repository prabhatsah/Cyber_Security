'use client'
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { format } from 'date-fns';
import React, { useState } from 'react'
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import FrameworkForm from '../frameworkForm';
import { IconButtonWithTooltip } from '@/ikon/components/buttons';
import { Plus, SquarePenIcon } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';

export default function FrameworkTable({ fragmentData }: any) {

    const [openFrameworkForm, setOpenFrameworkForm] = useState<boolean>(false);
    const [editRow, setEditRow] = useState<Record<string, string> | null>(null);

    function openModal(row: Record<string, string> | null) {
        setEditRow(row);
        setOpenFrameworkForm(true);
    }

    const columnsIncidentTable: DTColumnsProps<Record<string, string>>[] = [
        // {
        //     id: 'selectRow',
        //     header: '',
        //     cell: ({ row }) => (
        //         <input
        //             type="checkbox"
        //             checked={row.getIsSelected?.() ?? false}
        //             onChange={() => row.toggleSelected?.()}
        //         />
        //     ),
        //     enableSorting: false,
        //     enableHiding: false,
        //     size: 40,
        // },
        {
            accessorKey: "frameworkTitle",
            header: "Framework Title",
            cell: ({ row }) => (
                <div className="capitalize">{row.original.frameworkTitle}</div>
            ),
        },
        {
            accessorKey: "frameworkType",
            header: "Framework Type",
            cell: ({ row }) => {
                const formatted = row.original.frameworkType
                    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
                    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
            
                return <div className="capitalize">{formatted}</div>;
            },
        },
        {
            accessorKey: "frameworkAddTime",
            header: "Added On",
            cell: ({ row }) => {
                const dateValue = row.original.frameworkAddTime
                return dateValue ? format(new Date(dateValue), SAVE_DATE_FORMAT_GRC) : "N/A";
            },
        },
        {
            accessorKey: "frameworkDescription",
            header: "Description",
            cell: ({ row }) => (
                <div className="truncate max-w-[150px] text-ellipsis whitespace-nowrap overflow-hidden" title={row.original.frameworkDescription}>
                    {row.original.frameworkDescription}
                </div>
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

    const extraParamsIncidentTable: DTExtraParamsProps = {
        extraTools: [
            <IconButtonWithTooltip tooltipContent="Add Framework" onClick={() => openModal(null)}>
                <Plus />
            </IconButtonWithTooltip>
        ],
    }
    return (
        <>
            <DataTable data={fragmentData} columns={columnsIncidentTable} extraParams={extraParamsIncidentTable} />
            {
                openFrameworkForm &&
                <FrameworkForm open={openFrameworkForm} setOpen={setOpenFrameworkForm} editFramework={editRow} />
            }
        </>
    )
}
