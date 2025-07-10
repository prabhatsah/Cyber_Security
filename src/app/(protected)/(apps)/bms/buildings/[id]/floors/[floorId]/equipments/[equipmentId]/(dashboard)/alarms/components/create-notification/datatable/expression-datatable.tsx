"use client"

import { Button } from "@/shadcn/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { DataTable } from "@/ikon/components/data-table";
import type { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { format } from "date-fns";
import { Tooltip } from "@/ikon/components/tooltip";
import { useAlarms } from "../../../context/alarmsContext"
import CustomAlertDialog from '@/ikon/components/alert-dialog'

interface AlarmNotification {
    data: any
}
let expressionId: string;
export default function ExpressionDataTable() {
    const { expressionInfo, setExpressionInfo, setCreateQuery, setEditData, viewMode } = useAlarms();
    const [customAlertVisible, setCustomAlertVisible] = useState(false);
    function deleteExpression(expressionId: string) {
        const updatedConditions = expressionInfo.filter((item) => item.id !== expressionId);
        setExpressionInfo(updatedConditions);
        setCustomAlertVisible(false);
    }
    const extraParams: DTExtraParamsProps = {
        actionMenu: viewMode ? undefined : {
            items: [
                {
                    label: "Edit",
                    onClick: (row) => {
                        setEditData(row); // Pass the current row data to the modal
                        setCreateQuery(true);          // Open the modal
                    }
                },
                {
                    label: "Delete",
                    onClick: (row) => {
                        // console.log(row)
                        // const updatedExpressions = expressionInfo.filter((item) => item.id !== row.id);
                        // setExpressionInfo(updatedExpressions);
                        // toast.success("Condition deleted successfully!");
                        expressionId = row.id;
                        setCustomAlertVisible(true);
                    }
                },

            ]
        },
        extraTools: [
            <Tooltip tooltipContent="Add Qury" key="add-query">
                <Button variant="outline" className="p-2 gap-1"
                    onClick={() => {
                        setCreateQuery(true);
                    }}>
                    <Plus />
                </Button>
            </Tooltip>
        ],
        grouping: true,
        pageSize: 10,
        pageSizeArray: [10, 15, 20, 25, 50, 100],
    };
    const columnSchema: DTColumnsProps<any>[] = [
        {
            accessorKey: "expressionName",
            header: "Expression Name",
            cell: ({ row }) => (
                <span>{row.original.expName}</span>
            ),
        },
        {
            accessorKey: "condition",
            header: 'Condition',
            cell: ({ row }) => (
                <span>{row.original.expType}</span>
            ),
        },
        {
            accessorKey: "asset",
            header: 'Asset',
            cell: ({ row }) => (
                <span>{row.original?.device}</span>
            ),
        },
        {
            accessorKey: "service",
            header: 'Service',
            cell: ({ row }) => (
                <span>{row.original.service}</span>
            ),
        },
        {
            accessorKey: "subService",
            header: 'Sub Service',
            cell: ({ row }) => (
                <span>{row.original.subService}</span>
            ),
        },
        {
            accessorKey: "operator",
            header: 'Operator',
            cell: ({ row }) => (
                <span>{row.original.operand}</span>
            ),
        },
        {
            accessorKey: "status",
            header: 'Status',
            cell: ({ row }) => (
                <span>{row.original.value}</span>
            ),
        },
    ];
    return (
        <>
            {
                customAlertVisible && <CustomAlertDialog title="Delete Expression" description="Are you sure you want to delete this expression?" cancelText="Cancel" confirmText='Confirm' onConfirm={() => { setCustomAlertVisible(true); deleteExpression(expressionId) }} onCancel={() => { setCustomAlertVisible(false) }} />
            }
            <DataTable data={expressionInfo} columns={columnSchema} extraParams={extraParams} />
        </>
    )
}