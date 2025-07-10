"use client"
import { getMyInstancesV2, invokeAction } from '@/ikon/utils/api/processRuntimeService';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import React, { useEffect, useState } from 'react'
import SetTaskData from './components/setTaskData';
import { addDays, addMonths, differenceInDays, format, parseISO } from 'date-fns';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { DataTable } from '@/ikon/components/data-table';
import { group } from 'console';
import { Input } from '@/shadcn/ui/input';
import { Button } from '@/shadcn/ui/button';

const calculateTaskEndDate = (
    startDate: string,
    duration: number
): string => {
    const taskStart = parseISO(startDate);
    const wholeMonths = Math.floor(duration);
    const fractionalMonths = duration % 1;

    let taskEnd = addMonths(taskStart, wholeMonths);
    taskEnd = new Date(
        taskEnd.setDate(taskEnd.getDate() + fractionalMonths * 30)
    );

    return format(taskEnd, "yyyy-MM-dd");
};

export default function ScheduleFormComponent({ open, setOpen, projectIdentifier }: any) {

    const [taskData, setTaskData] = useState<any>(null);
    const [groupData, setGroupData] = useState<any>(null);
    const [projectData,setProjectData] = useState<any>(null);
    useEffect(() => {
        async function getProjectData() {
            console.log(projectIdentifier)
            const projectData = await getMyInstancesV2({
                processName: "Product of Project",
                predefinedFilters: { taskName: "View State" },
                processVariableFilters: { "projectIdentifier": projectIdentifier }
            });

            setProjectData(projectData[0]);

            let { dependency, group, task } = projectData[0]?.data?.scheduleData;

            console.log(group);
            console.log(task)


            const groupNameAndId = Object.values(group).map((groupInfo: any) => {
                return (
                    {
                        groupName: groupInfo?.groupName,
                        groupId: groupInfo?.id,
                        groupStartDate: groupInfo?.groupStartDate,
                        groupEndDate: groupInfo?.groupEndDate
                    }
                )
            })
            
            setGroupData(groupNameAndId);
            setTaskData(task);

            // for (let i = 0; i < task.length; i++) {
            //     task[i].taskEnd = calculateTaskEndDate(task[i].taskStart, task[i].taskDuration);
            // }

            // const taskData = SetTaskData({scheduleData: {dependency,group,task}});
        }
        getProjectData();
    }, [])

    function setProgressForParticularId(id: string, newProgress: number) {
        setTaskData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, progress: newProgress } : item
            )
        );
    }

    const extraParams: DTExtraParamsProps = {
        defaultGroups: ["groupName"],
    }

    const scheduleProgressColumn: DTColumnsProps<any>[] = [
        {
            accessorKey: "groupName",
            header: "Group Name",
            enableGrouping: true,
            accessorFn: (row) => {
                const group = groupData.find((groupInfo: Record<string, string>) => groupInfo.groupId === row.parentId);
                return group ? group.groupName : "Default Group";
            },
            // cell: ({ row }) => {
            //     const taskInfo = row.original;
            //     const group = groupData.find((groupInfo: Record<string, string>) => groupInfo.groupId === taskInfo.parentId);
            //     return (
            //         <div className='flex flex-row gap-3'>
            //             <div>{group.groupName}</div>
            //             {/* <div className='text-sm'>{format(group.groupStartDate, "dd-MM-yyyy")}</div>
            //             <div className='text-sm'>{format(group.groupEndDate, "dd-MM-yyyy")}</div> */}
            //         </div>
            //     )
            // }
        },
        {
            accessorKey: "taskName",
            header: "Task Name",
        },
        {
            accessorKey: "taskStart",
            aggregationFn: 'min',
            header: "Start Date",
        },
        {
            accessorKey: "taskEnd",
            aggregationFn: 'max',
            header: "End Date",
            accessorFn: (row) => {
                const getEndDate = calculateTaskEndDate(row.taskStart, row.taskDuration);
                return getEndDate ? getEndDate : "N/A";
            },
        },
        {
            accessorKey: "progress",
            header: "Progress",
            aggregationFn: 'mean',
            cell: ({ row }) => {
                const progressInfo = row.original;
                return <Input type="number" value={progressInfo.progress} onChange={(e) => { setProgressForParticularId(progressInfo.id, Number(e.target.value)) }} />
            },

        }
    ]

    async function saveScheduleInfo(){
        if(projectData){
            console.log(projectData);
            const processData = projectData.data;
            const processTaskId = projectData.taskId;
            processData.scheduleData.task = taskData
            console.log(projectData);
            console.log(processTaskId);
            await invokeAction({
                taskId: processTaskId,
                transitionName: "Update View State", 
                data: processData,
                processInstanceIdentifierField: "projectIdentifier"
            })
            console.log("Save Completed")
        }else{
            console.error("Project Data Not Found");
        }
        setOpen(false);
    }


    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[60%]">
                    <DialogHeader>
                        <DialogTitle>Update Task Progress</DialogTitle>
                    </DialogHeader>
                    <div className='h-[60vh] overflow-auto'>
                        {
                            taskData && groupData &&
                            <DataTable columns={scheduleProgressColumn} data={taskData} extraParams={extraParams} />
                        }
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={saveScheduleInfo}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
