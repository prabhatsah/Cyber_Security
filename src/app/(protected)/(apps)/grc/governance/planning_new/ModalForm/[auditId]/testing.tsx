'use client'
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";

const PlanningModalTable = forwardRef(({ selectedSOPData, auditorsList, userIdNameMap }: { selectedSOPData: any[]; auditorsList: string[]; userIdNameMap: { value: string; label: string }[]; }, ref) => {
    console.log(selectedSOPData, "Selected SOP Data");
    // let frameworkTypeControlAssigneeMap = new Map<string, string>(); // Map to store framework type and control name as key and assigned auditor as value
    // const controlObjectiveNameControlObjAssigneeMap = new Map<string, Map<string, string>>(); // Map to store control objective name and control objective as key and assigned auditor as value

    const frameworkTypeControlAssigneeMap = React.useRef(new Map<string, string>());
    const controlObjectiveNameControlObjAssigneeMap = React.useRef(new Map<string, Map<string, string>>());

    // Expose the maps to the parent component
    useImperativeHandle(ref, () => ({
        getFrameworkTypeControlAssigneeMap: () => frameworkTypeControlAssigneeMap.current,
        getControlObjectiveNameControlObjAssigneeMap: () => controlObjectiveNameControlObjAssigneeMap.current,
    }));

    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: "controlName",
        },
        {
            accessorKey: "controlObj",
            header: "Control Objective",
        },
        // {
        //     accessorKey: "frameworkType",
        //     header: "Framework Type",
        // },
        // {
        //     accessorKey: "frameworkName",
        //     header: "Framework Name",
        // },
        {
            accessorKey: "category",
            header: "Procedural Type",
        },
        // {
        //     accessorKey: "assignedAuditor",
        //     header: "Assignee",
        //     cell: ({ row }) => {
        //         const [selectedValue, setSelectedValue] = React.useState(row.original.assignedAuditor || "");

        //         const dropdownOptions = userIdNameMap.map((user) => (
        //             <option key={user.value} value={user.value}>{user.label}</option>
        //         ));

        //         const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        //             const value = e.target.value;
        //             setSelectedValue(value);
        //             row.original.controlObjAssignee = value; // Directly updating the row data
        //             console.log("Updated row data:", row.original); // Logging the updated row data
        //             const controlName = row.original.controlName;
        //             const controlObj = row.original.controlObj;

        //             // Check if the framework already exists in the map
        //             if (!controlObjectiveNameControlObjAssigneeMap.current.has(controlName)) {
        //                 controlObjectiveNameControlObjAssigneeMap.current.set(controlName, new Map());
        //             }

        //             // Set the controlObj -> value mapping under the framework
        //             const innerMap = controlObjectiveNameControlObjAssigneeMap.current.get(controlName)!;
        //             innerMap.set(controlObj, value);

        //             console.log("Control Objective Name Control Obj Assignee Map:", controlObjectiveNameControlObjAssigneeMap); // Logging the map
        //         };

        //         return (
        //             <select value={selectedValue} onChange={handleChange} className="border rounded px-2 py-1 w-full" >
        //                 <option value="" disabled>Select Auditor</option>
        //                 {dropdownOptions}
        //             </select>
        //         );
        //     },
        //     aggregatedCell: ({ row }) => {
        //         if (row.depth === 0) {
        //             const [selectedValue, setSelectedValue] = React.useState(row.original.assignedAuditor || "");

        //             const filteredOptions = userIdNameMap
        //                 .filter(user => auditorsList.includes(user.value))
        //                 .map(user => (
        //                     <option key={user.value} value={user.value}>{user.label}</option>
        //                 ));

        //             const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        //                 const value = e.target.value;
        //                 setSelectedValue(value);
        //                 row.original.controlAssignee = value; // Directly updating the row data
        //                 console.log("Updated aggregated row data:", row.original); // Logging the updated aggregated row data
        //                 frameworkTypeControlAssigneeMap.current.set(row.original.controlName, value);
        //                 console.log("Framework Type Control Assignee Map:", frameworkTypeControlAssigneeMap); // Logging the map
        //             };

        //             return (
        //                 <select
        //                     value={selectedValue}
        //                     onChange={handleChange}
        //                     className="border rounded px-2 py-1 w-full"
        //                 >
        //                     <option value="" disabled>Select Auditor</option>
        //                     {filteredOptions}
        //                 </select>
        //             );
        //         }

        //         return null;
        //     },
        // },
        {
            accessorKey: "controlObjweightage",
            header: "Weightage",
            cell: ({ row }) => {
                const weightage = Number(row.original.controlObjweightage).toFixed(2);
                return <div>{weightage}%</div>;
            },
            aggregatedCell: ({ row, column }) => {
                const value = row.getValue(column.id); // Use column.id to get aggregated value
                const formatted = Number(value).toFixed(2);
                return <div>{formatted}%</div>;
            },
            aggregationFn: "sum"
        }
    ];

    const extraParams: DTExtraParamsProps = {
        defaultGroups: ["controlName"],
    };

    return (
        <>
            <DataTable data={selectedSOPData} columns={columns} extraParams={extraParams} />
        </>
    );
});

export default PlanningModalTable;
