"use client";

import { DataTable } from "@/ikon/components/data-table";
import {
    DTColumnsProps,
    DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import React, { useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/shadcn/ui/checkbox";


const FilterDataTable=React.memo(function FilterDataTable({ data }: { data: any }) {
    
    const [selectedControls, setSelectedControls] = useState<string[]>([]);
    const [selectedControlObjectives, setSelectedControlObjectives] = useState<
        string[]
    >([]);

    // ✅ Flatten data to have one row per control objective
    const flattenedData = useMemo(() => {
        return data.flatMap((framework: any) =>
            framework.controls.flatMap((control: any) =>
                control.controlObjectives.map((objective: any) => ({
                    framework: framework.framework,
                    frameworkType: framework.frameworkType,
                    controlName: control.controlName,
                    controlId: control.controlId,
                    controlWeight: control.controlWeight,
                    controlObjName: objective.name,
                    controlObjWeight: objective.controlObjWeight,
                    category: objective.category,
                }))
            )
        );
    }, [data]);

    console.log("flattenedData", flattenedData);

    // ✅ Handle checkbox changes for controls
    const handleControlCheckboxChange = (controlId: string, isChecked: boolean) => {
        setSelectedControls((prev) =>
            isChecked ? [...prev, controlId] : prev.filter((id) => id !== controlId)
        );
    };

    // ✅ Handle checkbox changes for control objectives
    const handleControlObjectiveCheckboxChange = (
        controlObjName: string,
        isChecked: boolean
    ) => {
        setSelectedControlObjectives((prev) =>
            isChecked
                ? [...prev, controlObjName]
                : prev.filter((name) => name !== controlObjName)
        );
    };

    // ✅ Columns setup
    const columnsControlNewTable: DTColumnsProps<Record<string, string>>[] = [
        {
            accessorKey: "framework",
            header: "Framework",
            cell: ({ row }) => <div>{row.original.framework}</div>,
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
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={selectedControls.includes(row.original.controlId)}
                        onCheckedChange={(isChecked) =>
                            handleControlCheckboxChange(row.original.controlId, isChecked)
                        }
                    />
                    <div
                        className="truncate max-w-[300px]"
                        title={row.original.controlName}
                    >
                        {row.original.controlName}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "controlWeight",
            header: "Control Weight",
            cell: ({ row }) => <div>{row.original.controlWeight}%</div>,
        },
        {
            accessorKey: "controlObjName",
            header: "Control Objective Name",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={selectedControlObjectives.includes(row.original.controlObjName)}
                        onCheckedChange={(isChecked) =>
                            handleControlObjectiveCheckboxChange(
                                row.original.controlObjName,
                                isChecked
                            )
                        }
                    />
                    <div
                        className="truncate max-w-[500px]"
                        title={row.original.controlObjName}
                    >
                        {row.original.controlObjName}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "controlObjWeight",
            header: "Control Objective Weight",
            cell: ({ row }) => <div>{row.original.controlObjWeight}%</div>,
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => <div className="capitalize">{row.original.category}</div>,
        },
    ];

    const extraParamsControlNewTable: DTExtraParamsProps = {
       // defaultGroups: ["frameworkType"],
    };

    

    return (
        <>
           
                <DataTable
                    data={flattenedData}
                    columns={columnsControlNewTable}
                    extraParams={extraParamsControlNewTable}
                />
           
        </>
    );
});
export default FilterDataTable;