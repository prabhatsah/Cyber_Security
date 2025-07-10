'use client'
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import React, { useState } from 'react'
import { BauTableSchema, BauTaskType, EditFormSchema } from '../page';
import BauDataTable from './bauDataTable';
import { format } from 'date-fns';
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import { string } from 'zod';
import BauOpenForm from './bauOpenForm';
import BauForm from './bauForm';



export default function BauTab({ allUsers, groupedByTaskType, referencedPolicyMap,referenceDropDown, bauTaskFrequency, bauTaskFreqMap, customeControls, dropDownControl, framework, clientId }:
    {
        allUsers: { value: string, label: string }[];
        groupedByTaskType: Partial<Record<BauTaskType, BauTableSchema[]>>;
        referencedPolicyMap: { value: string, label: string }[];
        referenceDropDown: { value: string, label: string }[];
        bauTaskFrequency: string[];
        bauTaskFreqMap: { value: string, label: string }[];
        customeControls: any;
        dropDownControl: any;
        framework: string;
        clientId: string;
    }) {
    const [activeTab, setActiveTab] = useState(bauTaskFrequency.length > 0 ? bauTaskFrequency[0] : "N/A");
    const [editTask, setEditTask] = useState<EditFormSchema | null>(null);
    const [openEditForm, setOpenEditForm] = useState<boolean>(false);
    const [dropdown, setDropdown] = useState<any>(dropDownControl);
    const [refdropdown,setRefdropDown] = useState<{ value: string, label: string }[]>(referenceDropDown);

    const columnsBauTable: DTColumnsProps<BauTableSchema>[] = [
        {
            accessorKey: "task",
            header: "Task",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[100px]" title={row.original.task}>{row.original.task}</div>
            ),
        },
        {
            accessorKey: "details",
            header: "Details",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[100px]" title={row.original.details}>{row.original.details}</div>
            ),
        },
        {
            accessorKey: "objectiveIndex",
            header: "Controls",
            cell: ({ row }) => {
                const indexes = customeControls.filter(f => row.original.objectiveIndex.includes(f.customControlId))
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
                const referencePolicyName = referencedPolicyId.length ? referencedPolicyMap.find(u => u.value === referencedPolicyId)?.label || referencedPolicyId : '';
                return (
                    <div className="capitalize truncate w-[100px]" title={referencePolicyName}>{referencePolicyName}</div>
                );
            }
        },
        {
            accessorKey: "startDate",
            header: "Start Date",
            cell: ({ row }) => {
                const startDate = row.original?.startDate ? format(row.original.startDate, SAVE_DATE_FORMAT_GRC) : 'N/A'
                return (
                    <div className="capitalize truncate w-[100px]">{startDate}</div>
                )
            },
        },
        {
            accessorKey: "dueDate",
            header: "Due Date",
            cell: ({ row }) => {
                const dueData = row.original?.dueDate ? format(row.original.dueDate, SAVE_DATE_FORMAT_GRC) : 'N/A'
                return (
                    <div className="capitalize truncate w-[100px]">{dueData}</div>
                )
            },
        },
        {
            accessorKey: "owner",
            header: "Owner",
            cell: ({ row }) => {
                const ownerNameId = row.original.owner;
                const ownerName = ownerNameId?.length ? allUsers.find(u => u.value === ownerNameId)?.label || ownerNameId : 'N/A';
                return (
                    <div className="capitalize truncate w-[100px]" title={ownerName} >{ownerName}</div>
                );
            },
        },
        {
            accessorKey: "assignee",
            header: "Assignee",
            cell: ({ row }) => {
                const assigneeId = row.original.assignee;
                const assigneeName = assigneeId?.length ? allUsers.find(u => u.value === assigneeId)?.label || assigneeId : 'N/A';
                return (
                    <div className="capitalize truncate w-[100px]" title={assigneeName} >{assigneeName}</div>
                );
            },
        }
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
                        if (!rowData.clientId || !rowData.frameworkId || rowData.referenceTaskId) {
                            const controls = []
                            for (const customControlData of customeControls) {
                                controls.push({
                                    options: [{
                                        id: customControlData.customControlId,
                                        label: `${customControlData.refId.toString()}`,
                                        description: customControlData.title.toString(),
                                    }],
                                });
                            }
                            setDropdown(controls);
                            setRefdropDown(referencedPolicyMap);
                        }
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
                        dropDownControl={dropdown}
                        referencedPolicyMap={refdropdown}
                        bauTaskFreqMap={bauTaskFreqMap}
                        editDetails={editTask}
                        framework={framework}
                        clientId={clientId}
                    />
                )
            }
        </>
    )
}
