import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
import FormDateInput from '@/ikon/components/form-fields/date-input';
import FormInput from '@/ikon/components/form-fields/input';
import FormTextarea from '@/ikon/components/form-fields/textarea';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { GroupedCheckboxDropdown, OptionGroup } from '@/shadcn/ui/grouped-checkbox-dropdown';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from "sonner";
import { FlexibleGroupedCheckboxDropdown } from '@/shadcn/ui/FlexiGroupedCheckboxDropdown';
import { EditFormSchema } from '../page';



const referencedPolicies = [
    { value: 'Information Security Policy', label: 'Information Security Policy' },
    { value: 'Change Management Policy', label: 'Change Management Policy' },
    { value: 'Expense Reimbursement Policy', label: 'Expense Reimbursement Policy' },
    { value: 'Incident Management Policy', label: 'Incident Management Policy' },
];

const priority = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
];

const timePeriod = [
    { value: 'Annual', label: 'Annual' },
    { value: 'Semi Annual', label: 'Semi Annual' },
    { value: 'Quarterly', label: 'Quarterly' },
    { value: 'Monthly', label: 'Monthly' },
];

const taskStatus = [
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Past Due', label: 'Past Due' },
    { value: 'Completed', label: 'Completed' },
    { value: 'To Do', label: 'To Do' },
]

const isoControls: OptionGroup[] = [
    {
        id: "main-controls",
        label: "[Name] - ISO 27001:2022 Controls",
        options: [
            {
                id: "c.5.5",
                label: "C.5.5",
                description: "Information security in project management"
            },
            {
                id: "c.10.1",
                label: "C.10.1",
                description: "Cryptographic controls policy and procedures"
            },
            {
                id: "c.10.2",
                label: "C.10.2",
                description: "Key management policy and procedures"
            },
        ],
    },
    {
        id: "annex-a",
        label: "ISO 27001:2022 Annex A Controls",
        options: [
            {
                id: "a.5.1",
                label: "A.5.1",
                description: "Policies for information security"
            },
            {
                id: "a.5.2",
                label: "A.5.2",
                description: "Information security roles and responsibilities"
            },
            {
                id: "a.5.3",
                label: "A.5.3",
                description: "Segregation of duties"
            },
            {
                id: "a.8.22",
                label: "A.8.22",
                description: "Cloud services security"
            },
        ],
    },
];

const BauFormSchema = z.object({
    TASK: z.string().min(1, { message: 'Task is Required.' }),
    DETAILS: z.string().min(1, { message: 'Details is Required' }),
    OBJECTIVE_INDEX: z
        .array(z.string().min(1, { message: "Each item must be non-empty" }))
        .min(1, { message: "At least one OBJECTIVE Index is required" }),
    REFERENCED_POLICY: z.string().min(1, { message: 'Referenced Policy is Required' }),
    OWNER: z.string().min(1, { message: 'Owner is Required' }),
    ASSIGNEE_TO: z.string().min(1, { message: 'Assignee To is Required' }),
    START_DATE: z.date({ required_error: 'Start Date is required.' }),
    DUE_DATE: z.date({ required_error: 'Due Date is required.' }),
    STATUS: z.string().min(1, { message: 'Status is Required' }),
    PRIORITY: z.string().min(1, { message: 'Status is Required' }),
    TASK_TYPE: z.string().min(1, { message: 'Time Period is Required' }),
})

export default function BauForm({
    openBauForm,
    setOpenBauForm,
    allUsers,
    dropDownControl,
    referencedPolicyMap,
    bauTaskFreqMap,
    framework,
    clientId,
    editDetails
}: {
    openBauForm: boolean;
    setOpenBauForm: React.Dispatch<React.SetStateAction<boolean>>;
    allUsers: { value: string, label: string }[];
    dropDownControl: OptionGroup[];
    referencedPolicyMap: { value: string, label: string }[];
    bauTaskFreqMap: { value: string, label: string }[];
    framework?: string;
    clientId?: string;
    editDetails?: EditFormSchema;
}) {
    console.log(editDetails);
    const router = useRouter();
    const form = useForm<z.infer<typeof BauFormSchema>>({
        resolver: zodResolver(BauFormSchema),
        defaultValues: {
            TASK: editDetails?.task || '',
            DETAILS: editDetails?.details || '',
            OBJECTIVE_INDEX: editDetails?.objectiveIndex || [],
            REFERENCED_POLICY: editDetails?.referencedPolicy || '',
            OWNER: editDetails?.owner || '',
            ASSIGNEE_TO: editDetails?.assignee || '',
            START_DATE: editDetails?.startDate ? new Date(editDetails.startDate) : undefined,
            DUE_DATE: editDetails?.dueDate ? new Date(editDetails.dueDate) : undefined,
            STATUS: editDetails?.status || '',
            PRIORITY: editDetails?.priority || '',
            TASK_TYPE: editDetails?.tasKType || ''
        },
    });

    async function saveBauFormInfo(data: z.infer<typeof BauFormSchema>) {
        console.log(data);
        // const bauSaveDataFormat = {
        //     taskId: crypto.randomUUID(),
        //     task: data.TASK,
        //     details: data.DETAILS,
        //     objectiveIndex: data.OBJECTIVE_INDEX,
        //     referencedPolicy: data.REFERENCED_POLICY,
        //     owner: data.OWNER,
        //     assignee: data.ASSIGNEE_TO,
        //     startDate: data.START_DATE,
        //     dueDate: data.DUE_DATE,
        //     status: data.STATUS,
        //     priority: data.PRIORITY,
        //     tasKType: data.TASK_TYPE,
        //     frameworkId: framework,
        //     clientId: clientId
        // }


        if (editDetails) {
            if (!editDetails.clientId || !editDetails.frameworkId) {
                const saveDataFormat = {
                    taskId: editDetails?.taskId,
                    referenceTaskId: editDetails?.taskId,
                    task: data.TASK,
                    details: data.DETAILS,
                    objectiveIndex: data.OBJECTIVE_INDEX,
                    referencedPolicy: data.REFERENCED_POLICY,
                    owner: data.OWNER,
                    assignee: data.ASSIGNEE_TO,
                    startDate: data.START_DATE,
                    dueDate: data.DUE_DATE,
                    status: data.STATUS,
                    priority: data.PRIORITY,
                    tasKType: data.TASK_TYPE,
                    frameworkId: framework,
                    clientId: clientId,
                }

                const bauProcessId = await mapProcessName({ processName: "BAU" })

                console.log(bauProcessId);

                await startProcessV2({
                    processId: bauProcessId,
                    data: saveDataFormat,
                    processIdentifierFields: "taskId"
                })

            } else if (editDetails.referenceTaskId) {
                const saveDataFormat = {
                    taskId: editDetails?.taskId,
                    referenceTaskId: editDetails?.referenceTaskId,
                    task: data.TASK,
                    details: data.DETAILS,
                    objectiveIndex: data.OBJECTIVE_INDEX,
                    referencedPolicy: data.REFERENCED_POLICY,
                    owner: data.OWNER,
                    assignee: data.ASSIGNEE_TO,
                    startDate: data.START_DATE,
                    dueDate: data.DUE_DATE,
                    status: data.STATUS,
                    priority: data.PRIORITY,
                    tasKType: data.TASK_TYPE,
                    frameworkId: framework,
                    clientId: clientId,
                }

                console.log(saveDataFormat?.taskId);
                const bauInstances = await getMyInstancesV2({
                    processName: "BAU",
                    predefinedFilters: { taskName: 'View BAU' },
                    processVariableFilters: { "taskId": saveDataFormat?.taskId }
                })

               const bauTaskId = bauInstances.length > 0 ? bauInstances[0].taskId : ''
               
                if (bauTaskId.length > 0) {
                    await invokeAction({
                        data: saveDataFormat,
                        processInstanceIdentifierField: "taskId",
                        taskId: bauTaskId,
                        transitionName: "Update View"
                    })
                }

            } else {
                const saveDataFormat = {
                    taskId: editDetails?.taskId,
                    task: data.TASK,
                    details: data.DETAILS,
                    objectiveIndex: data.OBJECTIVE_INDEX,
                    referencedPolicy: data.REFERENCED_POLICY,
                    owner: data.OWNER,
                    assignee: data.ASSIGNEE_TO,
                    startDate: data.START_DATE,
                    dueDate: data.DUE_DATE,
                    status: data.STATUS,
                    priority: data.PRIORITY,
                    tasKType: data.TASK_TYPE,
                    frameworkId: framework,
                    clientId: clientId
                }

                const bauInstances = await getMyInstancesV2({
                    processName: "BAU",
                    predefinedFilters: { taskName: 'View BAU' },
                    processVariableFilters: { "taskId": saveDataFormat?.taskId }
                })

                const bauTaskId = bauInstances.length > 0 ? bauInstances[0].taskId : ''
                if (bauTaskId.length > 0) {
                    await invokeAction({
                        data: saveDataFormat,
                        processInstanceIdentifierField: "taskId",
                        taskId: bauTaskId,
                        transitionName: "Update View"
                    })
                }

            }

        } else {
            const saveDataFormat = {
                taskId: crypto.randomUUID(),
                task: data.TASK,
                details: data.DETAILS,
                objectiveIndex: data.OBJECTIVE_INDEX,
                referencedPolicy: data.REFERENCED_POLICY,
                owner: data.OWNER,
                assignee: data.ASSIGNEE_TO,
                startDate: data.START_DATE,
                dueDate: data.DUE_DATE,
                status: data.STATUS,
                priority: data.PRIORITY,
                tasKType: data.TASK_TYPE,
                frameworkId: framework,
                clientId: clientId
            }
            const bauProcessId = await mapProcessName({ processName: "BAU" })

            console.log(bauProcessId);

            await startProcessV2({
                processId: bauProcessId,
                data: saveDataFormat,
                processIdentifierFields: "taskId"
            })
        }


        router.refresh();
        setOpenBauForm(false);
        toast.success("Saved Successfully", {
            duration: 4000,
        });
    }

    return (
        <>
            <Dialog open={openBauForm} onOpenChange={setOpenBauForm} >
                <DialogContent
                    onInteractOutside={(e) => e.preventDefault()}
                    className="max-w-[90%] max-h-full"
                >
                    <DialogHeader>
                        <DialogTitle>Task Form</DialogTitle>
                    </DialogHeader>
                    <Form {...form} >
                        <form>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-3'>
                                <FormInput
                                    formControl={form.control}
                                    name="TASK"
                                    label="Task*"
                                    placeholder="Enter Task"
                                    disabled={
                                        !!editDetails && (
                                            !editDetails.clientId ||
                                            !editDetails.frameworkId ||
                                            !!editDetails.referenceTaskId
                                        )
                                    }
                                />
                                <FormField
                                    control={form.control}
                                    name="OBJECTIVE_INDEX"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Controls</FormLabel>
                                            <FormControl>
                                                <FlexibleGroupedCheckboxDropdown
                                                    groups={dropDownControl}
                                                    value={field.value || []}
                                                    onChange={field.onChange}
                                                    placeholder="Select Controls/Clauses"
                                                    searchPlaceholder="Search..."
                                                    multiSelect={true}
                                                    disabled={
                                                        !!editDetails && (
                                                            !editDetails.clientId ||
                                                            !editDetails.frameworkId ||
                                                            !!editDetails.referenceTaskId
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormComboboxInput
                                    formControl={form.control}
                                    name="REFERENCED_POLICY"
                                    items={referencedPolicyMap}
                                    label="Reference Policies*"
                                    placeholder="Select Reference Policies"
                                    disabled={
                                        !!editDetails && (
                                            !editDetails.clientId ||
                                            !editDetails.frameworkId ||
                                            !!editDetails.referenceTaskId
                                        )
                                    }
                                />
                                <FormComboboxInput formControl={form.control} name="OWNER" items={allUsers} label="Owner*" placeholder="Select Owner" />
                                <FormComboboxInput formControl={form.control} name="ASSIGNEE_TO" items={allUsers} label="Assignee*" placeholder="Select Assignee" />
                                <FormDateInput formControl={form.control} name="START_DATE" label="Start Date*" placeholder="Enter Start Date" dateFormat={SAVE_DATE_FORMAT_GRC} />
                                <FormDateInput formControl={form.control} name="DUE_DATE" label="Due Date*" placeholder="Enter Due Date" dateFormat={SAVE_DATE_FORMAT_GRC} />
                                <FormComboboxInput formControl={form.control} name="STATUS" items={taskStatus} label="Status*" placeholder="Enter Status" />
                                <FormComboboxInput formControl={form.control} name="PRIORITY" items={priority} label="Priority*" placeholder="Select Priority" />
                                <FormComboboxInput formControl={form.control} name="TASK_TYPE" items={bauTaskFreqMap} label="Task Type*" placeholder="Select Task Type" />
                                <div className="col-span-1 md:col-span-2">
                                    <FormTextarea
                                        formControl={form.control}
                                        name="DETAILS"
                                        placeholder="Enter Details"
                                        label="Details*"
                                        className="resize-y max-h-[100px] w-full"
                                        formItemClass="w-full"
                                        disabled={
                                            !!editDetails && (
                                                !editDetails.clientId ||
                                                !editDetails.frameworkId ||
                                                !!editDetails.referenceTaskId
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </form>
                    </Form>
                    <DialogFooter>
                        <Button onClick={form.handleSubmit(saveBauFormInfo)}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
