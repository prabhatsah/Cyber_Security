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
import NoDataComponent from '@/ikon/components/no-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shadcn/ui/accordion';
import { BauFormSchema } from '../page';



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

const BauFormSchema = z.object({
    TASK: z.string().min(1, { message: 'Task is Required.' }),
    DETAILS: z.string().min(1, { message: 'Details is Required' }),
    OBJECTIVE_INDEX: z
        .array(z.string().min(1, { message: "Each item must be non-empty" }))
        .min(1, { message: "At least one OBJECTIVE Index is required" }),
    // REFERENCED_POLICY: z.string().min(1, { message: 'Referenced Policy is Required' }),
    REFERENCED_POLICY: z.string().optional(),
    TASK_TYPE: z.string().min(1, { message: 'Time Period is Required' }),
})

export default function BauForm({
    openBauForm,
    setOpenBauForm,
    allUsers,
    dropDownControl,
    referencedPolicyMap,
    bauTaskFreqMap,
    customControlDatas,
    editDetails
}: {
    openBauForm: boolean;
    setOpenBauForm: React.Dispatch<React.SetStateAction<boolean>>;
    allUsers: { value: string, label: string }[];
    dropDownControl: OptionGroup[];
    referencedPolicyMap: { value: string, label: string }[];
    bauTaskFreqMap: { value: string, label: string }[];
    customControlDatas: any;
    editDetails?: BauFormSchema
}) {

    console.log(customControlDatas);
    const router = useRouter();
    const form = useForm<z.infer<typeof BauFormSchema>>({
        resolver: zodResolver(BauFormSchema),
        defaultValues: {
            TASK: editDetails?.task || '',
            DETAILS: editDetails?.details || '',
            OBJECTIVE_INDEX: editDetails?.objectiveIndex || [],
            REFERENCED_POLICY: editDetails?.referencedPolicy || '',
            TASK_TYPE: editDetails?.tasKType || ''
        },
    });

    async function saveBauFormInfo(data: z.infer<typeof BauFormSchema>) {
        console.log(data);
        const bauSaveDataFormat = {
            taskId: editDetails?.taskId || crypto.randomUUID(),
            task: data.TASK,
            details: data.DETAILS,
            objectiveIndex: data.OBJECTIVE_INDEX,
            referencedPolicy: data.REFERENCED_POLICY,
            tasKType: data.TASK_TYPE
        }

        if (editDetails) {

            const bauConfigInstances = await getMyInstancesV2({
                processName: "BAU Configurator",
                predefinedFilters: { taskName: 'View BAU Configurator' },
                processVariableFilters: { "taskId": bauSaveDataFormat?.taskId }
            })

            const bauConfigTaskId = bauConfigInstances.length > 0 ? bauConfigInstances[0].taskId : ''
            if (bauConfigTaskId.length > 0) {
                await invokeAction({
                    data: bauSaveDataFormat,
                    processInstanceIdentifierField: "taskId",
                    taskId: bauConfigTaskId,
                    transitionName: "Update View"
                })
            }

        } else {

            const bauProcessId = await mapProcessName({ processName: "BAU Configurator" })

            console.log(bauProcessId);

            await startProcessV2({
                processId: bauProcessId,
                data: bauSaveDataFormat,
                processIdentifierFields: "taskId"
            })
        }


        router.refresh();
        setOpenBauForm(false);
        toast.success("Saved Successfully", {
            duration: 4000,
        });
    }
    const objectiveIndex = form.watch("OBJECTIVE_INDEX");
    const filteredFrameworks = customControlDatas.filter(f => objectiveIndex.includes(f.customControlId));
    console.log(filteredFrameworks)

    console.log("Watched OBJECTIVE_INDEX:", objectiveIndex);
    return (
        <>
            <Dialog open={openBauForm} onOpenChange={setOpenBauForm} >
                <DialogContent
                    onInteractOutside={(e) => e.preventDefault()}
                    className="max-w-[90%] w-full h-[80vh] flex flex-col"
                >
                    <DialogHeader>
                        <DialogTitle>Task Form</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form className="flex flex-col flex-grow overflow-hidden">
                            <div className="flex-1 grid grid-cols-[5fr_7fr] gap-4 min-h-0 overflow-hidden px-6 pb-0">
                                {/* LEFT FORM SECTION */}
                                <div className="overflow-y-auto pr-4 h-full border-muted bg-card-new p-4 rounded-md">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-2">
                                        <FormInput formControl={form.control} name="TASK" label="Task*" placeholder="Enter Task" />

                                        <FormField
                                            control={form.control}
                                            name="OBJECTIVE_INDEX"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Controls*</FormLabel>
                                                    <FormControl>
                                                        <FlexibleGroupedCheckboxDropdown
                                                            groups={dropDownControl}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Choose control/clauses"
                                                            searchPlaceholder="Search..."
                                                            multiSelect={true}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormComboboxInput formControl={form.control} name="REFERENCED_POLICY" items={referencedPolicyMap} label="Reference Policies" placeholder="Select Reference Policies" />
                                        <FormComboboxInput formControl={form.control} name="TASK_TYPE" items={bauTaskFreqMap} label="Task Type*" placeholder="Select Task Type" />

                                        <div className="col-span-1 md:col-span-2">
                                            <FormTextarea
                                                formControl={form.control}
                                                name="DETAILS"
                                                placeholder="Enter Details"
                                                label="Details*"
                                                className="resize-y max-h-[100px] w-full"
                                                formItemClass="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT ACCORDION SECTION */}
                                <div className="pl-4 border-l border-muted h-full overflow-y-auto flex flex-col gap-4">
                                    <h3 className="text-lg font-semibold mb-3">
                                        Linked Frameworks and Controls
                                    </h3>

                                    <div className="overflow-y-auto pr-2 flex-1">
                                        {filteredFrameworks.length > 0 ? (
                                            <Accordion type="multiple" className="w-full flex flex-col gap-4">
                                                {filteredFrameworks.map((framework) => (
                                                    <AccordionItem
                                                        key={framework.customControlId}
                                                        value={framework.customControlId}
                                                        className="border border-border rounded-md bg-muted/30 px-3"
                                                    >
                                                        <AccordionTrigger className="font-semibold">{framework.refId} - {framework.title}</AccordionTrigger>
                                                        <AccordionContent className="mt-2 space-y-3 pl-2">
                                                            {framework?.Frameworks?.length > 0 ? (
                                                                framework.Frameworks.map((Framework) => (
                                                                    <AccordionItem
                                                                        key={Framework.frameworkId}
                                                                        value={Framework.frameworkId}
                                                                        className="ml-4 border-l-2 border-muted pl-4"
                                                                    >
                                                                        <AccordionTrigger className="text-sm font-medium text-muted-foreground">
                                                                            {Framework.frameworkName}
                                                                        </AccordionTrigger>
                                                                        <AccordionContent className="mt-2 space-y-2">
                                                                            {Framework.controls.map((control) => (
                                                                                <div
                                                                                    key={control.id}
                                                                                    className="border-l-2 border-gray-300 pl-3"
                                                                                >
                                                                                    <p className="text-sm font-medium">
                                                                                        {control.actualIndex} - {control.actualTitle}
                                                                                    </p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        Description: {control.description}
                                                                                    </p>
                                                                                </div>
                                                                            ))}
                                                                        </AccordionContent>
                                                                    </AccordionItem>
                                                                ))
                                                            ) : (
                                                                <p className="text-muted-foreground text-sm">No Framework Available</p>
                                                            )}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        ) : (
                                            <NoDataComponent />
                                        )}
                                    </div>

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
