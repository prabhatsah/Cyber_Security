import { DataTable } from '@/ikon/components/data-table'
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type'
import React, { useState } from 'react'
import CreateVariationOrderForm from './createVariationOrderForm';
import { Checkbox } from '@/shadcn/ui/checkbox';
import VariationOrderApprovalForm from './variationOrderApprovalForm';

export default function RequestForVODataTable({ notificationData }: { notificationData: Record<string, any>[] }) {


    const [checkedRows, setCheckeRows] = useState<Record<string, any>[]>([]);

    const userIdofCheckedRows = (row: any) => {
        setCheckeRows((prevCheckedRows: any) =>
            prevCheckedRows.some((r: any) => r.notiIdentifier === row.original.notiIdentifier)
                ? prevCheckedRows.filter((r: any) => r.notiIdentifier !== row.original.notiIdentifier) // Remove if exists
                : [...prevCheckedRows, row.original]
        );
    };

    console.log(checkedRows);
    const extraParams: DTExtraParamsProps = {
        extraTools: [
            <CreateVariationOrderForm />,
            <VariationOrderApprovalForm checkedRows={checkedRows} />
        ],
    }
    const requestForVODataTableColumn: DTColumnsProps<Record<string, any>>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => {
                return (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => {
                            row.toggleSelected(!!value);
                            userIdofCheckedRows(row);
                        }}
                        aria-label="Select row"
                    />
                )
            },
        },
        {
            accessorKey: "titleNoti",
            header: "Title"
        },
        {
            accessorKey: "approvedStatus",
            header: "Status"
        },
        {
            accessorKey: "submittedBy",
            header: "Submitted By"
        },
        {
            accessorKey: 'rfcRef',
            header: "VO Ref",

        },
        {
            accessorKey: 'voType',
            header: "VO Type",

        },
        {
            header: "Priority",
            accessorKey: 'notiPriority',

        },
        {
            accessorKey: 'estimatedImpactOnSchedule',
            header: "Estimated Impact on FTE (Months)",

        },
        {
            accessorKey: 'createdDate',
            header: "Created On",
        }
    ]

    return (
        <>
            <DataTable columns={requestForVODataTableColumn} data={notificationData} extraParams={extraParams} />
        </>
    )
}
