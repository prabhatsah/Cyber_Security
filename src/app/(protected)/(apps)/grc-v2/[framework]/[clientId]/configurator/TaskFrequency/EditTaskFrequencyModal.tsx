'use client';
import { Button } from '@/shadcn/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shadcn/ui/dialog';
import { Form } from '@/shadcn/ui/form';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@/ikon/components/form-fields/input';
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';
import FormTextarea from '@/ikon/components/form-fields/textarea';
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
import { getProfileData } from '@/ikon/utils/actions/auth';

// export const TaksFrequencyFormSchema = z.object({
//     FRAMEWORK: z.string().min(2, { message: "Category must be at least 2 characters long." }).trim(),
//     TASK_TYPE: z.string().min(2, { message: "Category must be at least 2 characters long." }).trim(),
//     ORDER: z.string().min(1, { message: 'Risk Value must be at least 1 character long.' }).regex(/^\d+$/, 'Must be a number').trim(),
// });


export const TaksFrequencyFormSchema = z.object({
    TASK_TYPE: z.string().min(2, { message: "Category must be at least 2 characters long." }).trim(),
    ORDER: z.string().min(1, { message: 'Risk Value must be at least 1 character long.' }).regex(/^\d+$/, 'Must be a number').trim(),
});


export const taskFrequencyType = [
    { value: "Annual", label: "Annual" },
    { value: "Half Yearly", label: "Half Yearly" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "Monthly", label: "Monthly" },
    { value: "Weekly", label: "Weekly" },
    { value: "Daily", label: "Daily" },
];

export default function TaskFrequncyEdit({ open, setOpen, taskFrquencyData, controlObjectiveData, profileData }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; taskFrquencyData: Record<string, string>[]; controlObjectiveData: Record<string, string>[]; profileData: Record<string, string>[] }) {
    console.log('taskFrquencyData', taskFrquencyData);

    const router = useRouter();

    const form = useForm<z.infer<typeof TaksFrequencyFormSchema>>({
        resolver: zodResolver(TaksFrequencyFormSchema),
        // defaultValues: { FRAMEWORK: '', TASK_TYPE: '', ORDER: '' },
        defaultValues: { TASK_TYPE: '', ORDER: '' },
    });



    const [taskFrequencyTableData, setTaskFrequencyTableData] = useState<any[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    let frameworkTypeData: Record<string, string> = {};

    useEffect(() => {
        // Initialize the table with incoming data
        const validData = (taskFrquencyData || []).filter(Boolean);

        if (validData.length === 0) {
            setTaskFrequencyTableData([]);
            return;
        }
        // const initialData = taskFrquencyData.flatMap(obj =>
        //     obj.taskFrequency
        //         ? Object.values(obj.taskFrequency).map(entry => ({
        //             ...entry,
        //             frameworkId: obj.frameworkId,
        //         }))
        //         : []
        // );

        const initialData = taskFrquencyData.flatMap(obj =>
            Object.values(obj)
        );

        setTaskFrequencyTableData(initialData);
    }, [taskFrquencyData]);

    // const frameworkType = controlObjectiveData.map((framework: any) => ({
    //     value: framework.frameworkId,
    //     label: framework.frameworkName,
    // }));


    // controlObjectiveData.forEach((framework: any) => {
    //     frameworkTypeData[framework.frameworkId] = framework.frameworkName;
    // });




    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: 'slNo',
            header: 'Sl No.',
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        // {
        //     accessorKey: 'framework',
        //     header: 'Framework',
        //     cell: ({ row }) => {
        //         const frameworkId = row.original.frameworkId;
        //         return <div>{frameworkTypeData[frameworkId] || frameworkId}</div>;
        //     }
        // },
        {
            accessorKey: 'taskType',
            header: 'Task Type',
        },
        {
            accessorKey: 'order',
            header: 'Order No.'
        }
    ];

    const extraParams: DTExtraParamsProps = {

        grouping: false,
        actionMenu: {
            items: [
                {
                    label: 'Edit',
                    onClick: (rowData) => {
                        // Set form values for editing
                        // form.setValue('FRAMEWORK', rowData.frameworkId);
                        form.setValue('TASK_TYPE', rowData.taskType);
                        form.setValue('ORDER', rowData.order.toString())
                        setEditingIndex(taskFrequencyTableData.findIndex((d) => d.taskId === rowData.taskId));
                    },
                },
            ],
        },
    };

    function handleClear() {
        form.reset();
        setEditingIndex(null);
    }

    function handleAddOrUpdate(data: z.infer<typeof TaksFrequencyFormSchema>) {
        const newEntry = {
            taskId: editingIndex === null ? v4() : taskFrequencyTableData[editingIndex].taskId,
            // frameworkId: data.FRAMEWORK,
            taskType: data.TASK_TYPE,
            order: Number(data.ORDER)
        };

        if (editingIndex !== null) {
            const updatedData = [...taskFrequencyTableData];
            updatedData[editingIndex] = newEntry;
            setTaskFrequencyTableData(updatedData);
            setEditingIndex(null);
        } else {
            // Add new entry
            setTaskFrequencyTableData((prev) => [newEntry, ...prev]);
        }

        form.reset();
    }

    async function saveTaskFrequencyDataToBackend() {


        const instances = await getMyInstancesV2({
            processName: 'Task Frequency',
            predefinedFilters: { taskName: 'Edit Task Frequency' },
        });



        const taskId = instances?.[0]?.taskId;
        if (!taskId) return;

        // Convert array to object with riskImpactId as key
        const formattedData = taskFrequencyTableData.reduce((acc, curr) => {
            acc[curr.taskId] = {
                order: curr.order,
                taskId: curr.taskId,
                taskType: curr.taskType,
                addedOn: new Date().toISOString(),
                addedFrom: 'clientAccount',
            };
            return acc;
        }, {} as Record<string, { taskId: string; framework: string; taskType: string; order: number; addedOn: string; addedFrom: string }>);

        let newTaskFrequencyAdded: string[] = [];

        if (instances.length === 0) {

            let finalData: Record<string, any> = {};
            newTaskFrequencyAdded = Object.keys(formattedData);

            finalData['activityLog'] = [];
            finalData['taskFrequency'] = formattedData;
            finalData['lastUpdatedBy'] = profileData.USER_ID;
            finalData['lastUpdatedOn'] = new Date().toISOString();
            let activityLogEntry = {
                lastUpdatedBy: profileData.USER_ID,
                lastUpdatedOn: new Date().toISOString(),
                type: "Task Frequency",
                addedIDs: newTaskFrequencyAdded
            }
            finalData['activityLog'].push(activityLogEntry);
            const processId = await mapProcessName({ processName: "Task Frequency" });
            await startProcessV2({
                processId: processId,
                data: finalData,
                processIdentifierFields: "",
            });
        } else {
            const previousTaskFrequencyId = Object.keys(instances[0].data.taskFrequency as object);
            const currentTaskFrequencyId = Object.keys(formattedData);
            newTaskFrequencyAdded = currentTaskFrequencyId.filter((id) => !previousTaskFrequencyId.includes(id));

            const taskId = instances?.[0]?.taskId;
            const taskData = instances[0].data as Record<string, any>;

            const lastUpdatedBy = profileData.USER_ID;
            const lastUpdatedOn = new Date().toISOString();
            let activityLogEntry = {
                lastUpdatedBy: lastUpdatedBy,
                lastUpdatedOn: lastUpdatedOn,
                type: "Task Frequency",
                addedIDs: newTaskFrequencyAdded
            };
            taskData.activityLog.push(activityLogEntry);
            taskData.taskFrequency = formattedData;
            taskData.lastUpdatedBy = lastUpdatedBy;
            taskData.lastUpdatedOn = lastUpdatedOn;
            console.log('updateddd data ===========>>>>')
            console.log(taskData);

            // Invoke action to update the existing task frequency
            await invokeAction({
                taskId,
                data: taskData,
                transitionName: 'Update Edit Task Frequency',
                processInstanceIdentifierField: '',
            });
        }

       

        setOpen(false);
        router.refresh();
    }


    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
                form.reset();
                setEditingIndex(null);
            }
        }}>
            <DialogContent className="max-w-[50%] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Add/Edit Task Frquency</DialogTitle>
                    <DialogDescription>Manage your task frquency by adding or editing</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleAddOrUpdate)}
                        className="space-y-2"
                    >
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            {/* <FormComboboxInput items={frameworkType} formControl={form.control} name={"FRAMEWORK"} placeholder={"Select Framework"} label={"Framework"} /> */}
                            <FormComboboxInput items={taskFrequencyType} formControl={form.control} name={"TASK_TYPE"} placeholder={"Select Duration"} label={"Duration"} />
                            <FormInput formControl={form.control} type="number" name={'ORDER'} label={'Order Number'} placeholder={'Enter Order number'} />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button type="submit">{editingIndex === null ? 'ADD' : 'UPDATE'}</Button>
                            <Button type="button" variant="outline" onClick={handleClear}>
                                CLEAR
                            </Button>
                        </div>
                    </form>


                    <div className="max-h-[40%] overflow-y-auto">
                        <DataTable data={taskFrequencyTableData} columns={columns} extraParams={extraParams} />
                    </div>
                </Form>

                <DialogFooter>
                    <Button onClick={saveTaskFrequencyDataToBackend}>SAVE</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
