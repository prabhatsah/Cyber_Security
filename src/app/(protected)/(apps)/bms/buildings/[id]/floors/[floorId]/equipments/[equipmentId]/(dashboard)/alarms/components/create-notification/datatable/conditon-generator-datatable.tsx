"use client"

import { Button } from "@/shadcn/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { DataTable } from "@/ikon/components/data-table";
import type { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { format, set } from "date-fns";
import { Tooltip } from "@/ikon/components/tooltip";
import { useAlarms } from "../../../context/alarmsContext"
import { toast } from "sonner";
import CustomAlertDialog from '@/ikon/components/alert-dialog'

interface AlarmNotification {
    data: any
}
let conditionId: string;
export default function ConditionGeneratorDataTable() {
    const [customAlertVisible, setCustomAlertVisible] = useState(false);
    const { expressionInfo, conditionInfo, setConditionInfo, setExpressionCreated, setEditConditionData, viewMode } = useAlarms()
    let idToNameMap: { [key: string]: string } = {};
    for (let i = 0; i < expressionInfo.length; i++) {
        idToNameMap[expressionInfo[i].id] = expressionInfo[i].expName;
    }
    for (let i = 0; i < conditionInfo.length; i++) {
        idToNameMap[conditionInfo[i].id] = conditionInfo[i].conditionName;
    }
    const { setCreateCondition } = useAlarms()
    function deleteCondition(conditionId: string) {
        const updatedConditions = conditionInfo.filter((condition) => condition.id !== conditionId);
        setConditionInfo(updatedConditions);
        setCustomAlertVisible(false);
    }
    const extraParams: DTExtraParamsProps = {
        actionMenu: viewMode ? undefined : {
            items: [
                {
                    label: "Edit",
                    onClick: (row) => {
                        setEditConditionData(row); // Pass the current row data to the modal
                        setCreateCondition(true);          // Open the modal
                    }
                },
                {
                    label: "Delete",
                    onClick: (row) => {
                        conditionId = row.id;
                        setCustomAlertVisible(true);
                    }
                },
            ]
        },
        extraTools: [
            <Tooltip tooltipContent="Add Qury" key="add-query">
                <Button variant="outline" className="p-2 gap-1"
                    onClick={() => {
                        expressionInfo.length > 0 ? setCreateCondition(true) : setExpressionCreated(true)
                        setCreateCondition(true);
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
            accessorKey: "condition",
            header: "Condition",
            cell: ({ row }) => (
                <span>{row.original.conditionName}</span>
            ),
        },
        {
            accessorKey: "expression1",
            header: 'Expression 1',
            cell: ({ row }) => (
                <span>{idToNameMap[row.original.conditionOperand1]}</span>
            ),
        },
        {
            accessorKey: "Operator",
            header: 'Operator',
            cell: ({ row }) => (
                <span>{row.original.conditionOperator}</span>
            ),
        },
        {
            accessorKey: "expression2",
            header: 'Expression 2',
            cell: ({ row }) => (
                <span>{idToNameMap[row.original.conditionOperand2]}</span>
            ),
        },
    ];
    return (
        <>

            {
                customAlertVisible && <CustomAlertDialog title="Delete Condition" description="Are you sure you want to delete this condition?" cancelText="Cancel" confirmText='Confirm' onConfirm={() => { setCustomAlertVisible(true); deleteCondition(conditionId) }} onCancel={() => { setCustomAlertVisible(false) }} />
            }
            <DataTable data={conditionInfo} columns={columnSchema} extraParams={extraParams} />
        </>
    )
}