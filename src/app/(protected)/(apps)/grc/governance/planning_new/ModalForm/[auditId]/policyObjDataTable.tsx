'use client'
import React from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { Card, CardContent } from "@/shadcn/ui/card";

export default function PlanningObjectiveDataTable({ userIdNameMap, tableData }: { userIdNameMap: { value: string; label: string }[]; tableData: Record<string, any>[] }) {

   // Transform the data into the desired structure
    const transformData = (data: any[]) => {
        return data.flatMap((audit) =>
            audit.controls.flatMap((control) =>
                control.controlObjectives.map((controlObj) => ({
                    controlName: control.controlName,
                    controlAssignee: control.controlAssignee,
                    controlObjName: controlObj.name,
                    controlObjweight: controlObj.controlObjweight,
                    controlObjType: controlObj.controlObjType,
                    practiceAreas: controlObj.practiceAreas,
                    controlWeight: control.controlWeight,
                    policyId: control.policyId,
                    controlObjAssignee: controlObj.controlObjAssignee,
                    policyName: audit.policyName,
                    objProgress: controlObj.ObjProgress,
                    controlProgress: control.controlProgress
                }))
            )
        );
    };

    // Transform the incoming tableData
    const transformedData = transformData(tableData);

    console.log("Transformed Data:===========>", transformedData);

    // Helper function to get the name from userIdNameMap
    const getNameById = (id: string) => {
        const user = userIdNameMap.find((user) => user.value === id);
        return user ? user.label : "Unknown";
    };

    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: "controlName",
        },
        {
            accessorKey: "controlObjName",
            header: "Control Objective",
            cell: ({ row }) => {
                const controlObjName = row.original.controlObjName || "N/A";
                return <div className="truncate max-w-[200px]" title={controlObjName}>{controlObjName}</div>
            },
        },
        {
            accessorKey: "controlObjType",
            header: "Procedural Type",
        },
        {
            accessorKey: "practiceAreas",
            header: "Practice Areas",
        },
        {
            accessorKey: "controlObjweightage",
            header: "Weightage %",
            cell: ({ row }) => {
                const weightage = Number(row.original.controlObjweight).toFixed(2);
                return <div className="flex flex-row-reverse mr-10">{weightage}</div>;
            },
            aggregatedCell: ({ row, column }) => {
                const weightage = Number(row.original.controlWeight).toFixed(2);
                return <div className="flex flex-row-reverse mr-10">{weightage}</div>;
            },
        },
        {
            accessorKey: "objProgress",
            header: "Progress %",
            cell: ({ row }) => {
                const ObjProgress = Number(row.original.objProgress).toFixed(2);
                return <div className="flex flex-row-reverse mr-10">{ObjProgress}</div>;
            },
            aggregatedCell: ({row})=>{
                const controlProgress = Number(row.original.controlProgress).toFixed(2);
                return <div className="flex flex-row-reverse mr-10">{controlProgress}</div>;
            }

        },
        {
            accessorKey: "policyName",
            header: "Framework",
        }
    ];

    const extraParams: DTExtraParamsProps = {
        defaultGroups: ["controlName"],
        grouping:false,
        pagination: false,
    };

    return (
        <>
            <DataTable data={transformedData} columns={columns} extraParams={extraParams} />
        </>
    );
}