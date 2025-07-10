'use client'
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import React, { useState } from 'react'
import BauOpenForm from './bauOpenForm';
import { OptionGroup } from '@/shadcn/ui/grouped-checkbox-dropdown';
import { BauFormSchema, BauTableSchema, BauTaskType } from '../page';
import BauDataTable from './bauDataTable';
import BauForm from './bauForm';


export default function BauTab({ allUsers, groupedByTaskType, referencedPolicyMap, bauTaskFrequency, bauTaskFreqMap, customControlDatas, dropDownControl }:
    {
        allUsers: { value: string, label: string }[];
        groupedByTaskType: Partial<Record<BauTaskType, BauTableSchema[]>>;
        referencedPolicyMap: { value: string, label: string }[];
        bauTaskFrequency: string[];
        bauTaskFreqMap: { value: string, label: string }[];
        customControlDatas: any;
        dropDownControl: any;
    }) {
    const [activeTab, setActiveTab] = useState(bauTaskFrequency.length > 0 ? bauTaskFrequency[0] : "N/A");
    const [editTask, setEditTask] = useState<BauFormSchema | null>(null);
    const [openEditForm, setOpenEditForm] = useState<boolean>(false);

    const columnsBauTable: DTColumnsProps<BauTableSchema>[] = [
        {
            accessorKey: "task",
            header: "Task",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[250px]" title={row.original.task}>{row.original.task}</div>
            ),
        },
        {
            accessorKey: "details",
            header: "Details",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[250px]" title={row.original.details}>{row.original.details}</div>
            ),
        },
        {
            accessorKey: "objectiveIndex",
            header: "Controls",
            cell: ({ row }) => {
                const indexes = customControlDatas.filter(f => row.original.objectiveIndex.includes(f.customControlId))
                console.log(indexes);
                const objIndex = indexes.map((index) => index?.refId).join(', ');
                return (
                    <div className="capitalize truncate w-[250px]" title={objIndex}>{objIndex}</div>
                )
            },
        },
        {
            accessorKey: "referencedPolicy",
            header: "Referenced Policies",
            cell: ({ row }) => {
                const referencedPolicyId = row.original.referencedPolicy;
                const referencePolicyName = referencedPolicyId.length>0 ? referencedPolicyMap.find(u => u.value === referencedPolicyId)?.label || referencedPolicyId : 'N/A';
                return (
                    <div className="capitalize truncate w-[250px]" title={referencePolicyName}>{referencePolicyName}</div>
                );
            }
        },
        // {
        //     accessorKey: "startDate",
        //     header: "Start Date",
        //     cell: ({ row }) => (
        //         <div className="capitalize truncate w-[100px]">{format(row.original.startDate, SAVE_DATE_FORMAT_GRC)}</div>
        //     ),
        // },
        // {
        //     accessorKey: "dueDate",
        //     header: "Due Date",
        //     cell: ({ row }) => (
        //         <div className="capitalize truncate w-[100px]">{format(row.original.dueDate, SAVE_DATE_FORMAT_GRC)}</div>
        //     ),
        // },
        // {
        //     accessorKey: "owner",
        //     header: "Owner",
        //     cell: ({ row }) => {
        //         const ownerNameId = row.original.owner;
        //         const ownerName = ownerNameId.length ? allUsers.find(u => u.value === ownerNameId)?.label || ownerNameId : '';
        //         return (
        //             <div className="capitalize truncate w-[100px]" title={ownerName} >{ownerName}</div>
        //         );
        //     },
        // },
        // {
        //     accessorKey: "assignee",
        //     header: "Assignee",
        //     cell: ({ row }) => {
        //         const assigneeId = row.original.assignee;
        //         const assigneeName = assigneeId.length ? allUsers.find(u => u.value === assigneeId)?.label || assigneeId : '';
        //         return (
        //             <div className="capitalize truncate w-[100px]" title={assigneeName} >{assigneeName}</div>
        //         );
        //     },
        // }
    ];

    const extraParamsBauTable: DTExtraParamsProps = {
        // extraTools: [
        //     <BauOpenForm allUsers={allUsers} dropDownControl={dropDownControl} referencedPolicyMap={referencedPolicyMap} bauTaskFreqMap={bauTaskFreqMap}/>
        // ]
        actionMenu: {
            items: [
                {
                    label: "Edit",
                    onClick: (rowData) => {
                        setEditTask(rowData);
                        setOpenEditForm(true);
                    },
                },
            ],
        },
    }

    // const tabOptions: BauTaskType[] = ['Annual', 'Semi Annual', 'Quarterly', 'Monthly'];

    return (
        <>
            <div className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-3">
                    <TabsList>
                        {bauTaskFrequency?.map((tab) => (
                            <TabsTrigger key={tab} value={tab}>
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {bauTaskFrequency?.map((tab) => (
                        <TabsContent key={tab} value={tab}>
                            <BauDataTable
                                columnsBauTable={columnsBauTable}
                                data={groupedByTaskType[tab] ?? []}
                                extraParamsBauTable={extraParamsBauTable}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
            {
                editTask && openEditForm && (
                    <BauForm
                        openBauForm={openEditForm}
                        setOpenBauForm={setOpenEditForm}
                        allUsers={allUsers}
                        dropDownControl={dropDownControl}
                        referencedPolicyMap={referencedPolicyMap}
                        bauTaskFreqMap={bauTaskFreqMap}
                        customControlDatas={customControlDatas}
                        editDetails={editTask}
                    />
                )
            }
        </>
    )
}
