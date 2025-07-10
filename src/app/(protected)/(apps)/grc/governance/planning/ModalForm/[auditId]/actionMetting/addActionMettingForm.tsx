import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
import FormDateInput from '@/ikon/components/form-fields/date-input';
import FormInput from '@/ikon/components/form-fields/input';
import FormTextarea from '@/ikon/components/form-fields/textarea';
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Form } from '@/shadcn/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import React, { SetStateAction } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

interface AddActionMeetingFormProps {
    openActionMeetingForm: boolean;
    setOpenActionMeetingForm: React.Dispatch<SetStateAction<boolean>>;
    userIdNameMap: { value: string, label: string }[];
    owner: string;
    type: string;
    editAction?: {
        description: string;
        owner: string;
        assignedTo: string;
        dueDate: Date | undefined;
        timeEntries: { date: Date; hours: number }[];
    }
    editIndex?: number;
    setActions: React.Dispatch<React.SetStateAction<{
        description: string;
        owner: string;
        assignedTo: string;
        dueDate: Date | undefined;
        timeEntries: {
            date: Date;
            hours: number;
        }[];
    }[]>>
}

const ActionFormSchema = z.object({
    ACTION_DESCRIPTION: z.string().min(2, { message: 'Action Description must be at least 2 characters long.' }),
    OWNER: z.string().min(1, { message: 'Owner is Required' }),
    ASSIGNED_TO: z.string().min(1, { message: 'Assginee is Required' }),
    DUE_DATE: z.date({ required_error: 'Due Date is required.' }),
    TIME_ENTRIES: z.array(
        z.object({
            date: z.date({ required_error: "Date is required" }),
            hours: z
                .number({ required_error: "Hours are required" })
                .nonnegative({ message: "Hours must be 0 or greater" }),
        })
    ).optional(),
})

export default function AddActionMettingForm({
    openActionMeetingForm,
    setOpenActionMeetingForm,
    userIdNameMap,
    owner,
    setActions,
    type,
    editAction,
    editIndex
}: AddActionMeetingFormProps) {
    const form = useForm<z.infer<typeof ActionFormSchema>>({
        resolver: zodResolver(ActionFormSchema),
        defaultValues: {
            ACTION_DESCRIPTION: type === 'new' ? '' : editAction?.description || '',
            OWNER: owner,
            ASSIGNED_TO: type === 'new' ? '' : editAction?.assignedTo || '',
            DUE_DATE: type === 'new' ? undefined : editAction?.dueDate || undefined,
            TIME_ENTRIES: type === 'new' ? [] : editAction?.timeEntries || [],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "TIME_ENTRIES",
    });
    function saveActionFormInfo(data: z.infer<typeof ActionFormSchema>) {
        console.log(data);

        if (type === 'existing') {
            setActions(prev =>
                prev.map((item, i) =>
                    i === editIndex
                        ? {
                            assignedTo: data.ASSIGNED_TO,
                            description: data.ACTION_DESCRIPTION,
                            dueDate: data.DUE_DATE,
                            owner: data.OWNER,
                            timeEntries: data.TIME_ENTRIES ?? [],
                        }
                        : item
                )
            );
        } else {
            setActions(prev => [
                ...prev,
                {
                    assignedTo: data.ASSIGNED_TO,
                    description: data.ACTION_DESCRIPTION,
                    dueDate: data.DUE_DATE,
                    owner: data.OWNER,
                    timeEntries: data.TIME_ENTRIES ?? [],
                },
            ]);
        }
        setOpenActionMeetingForm(false);
    }
    return (
        <>
            <Dialog open={openActionMeetingForm} onOpenChange={setOpenActionMeetingForm} >
                <DialogContent
                    onInteractOutside={(e) => e.preventDefault()}
                    className="max-w-[60%]"
                >
                    <DialogHeader>
                        <DialogTitle>Enter Your Action</DialogTitle>
                    </DialogHeader>
                    <Form {...form} >
                        <form>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-3'>
                                <div className="col-span-1 md:col-span-3">
                                    <FormTextarea
                                        formControl={form.control}
                                        name="ACTION_DESCRIPTION"
                                        placeholder="Enter Action"
                                        label="Add a new Action*"
                                        className="resize-y max-h-[100px] w-full"
                                        formItemClass="w-full"
                                    />
                                </div>
                                <FormComboboxInput items={userIdNameMap} formControl={form.control} name="OWNER" placeholder="Select Owner" label="Owner*" disabled />
                                <FormComboboxInput items={userIdNameMap} formControl={form.control} name="ASSIGNED_TO" placeholder="Select User" label="Assigned To*" />
                                <FormDateInput formControl={form.control} name="DUE_DATE" label="Due Date*" placeholder="Enter Due Date" dateFormat={SAVE_DATE_FORMAT_GRC} />
                            </div>
                            <Button
                                type="button"
                                onClick={() => append({ date: new Date(), hours: 0 })}
                                className="w-full"
                            >
                                + Add Time Entry
                            </Button>
                            <div className="space-y-6 mb-3 max-h-64 overflow-y-auto">
                                {fields.map((field, index) => (
                                    <div key={index} className="flex flex-col-reverse gap-2">
                                        <div className="flex flex-row gap-3">
                                            <div className="flex-1">
                                                <FormDateInput
                                                    formControl={form.control}
                                                    name={`TIME_ENTRIES.${index}.date`}
                                                    label="Date"
                                                    placeholder="Select date"
                                                    dateFormat={SAVE_DATE_FORMAT_GRC}
                                                />
                                            </div>

                                            <div className="flex-2">
                                                <FormInput
                                                    formControl={form.control}
                                                    name={`TIME_ENTRIES.${index}.hours`}
                                                    type="number"
                                                    label="Hours"
                                                    placeholder="Select Hours"
                                                    onChange={(e) =>
                                                        form.setValue(`TIME_ENTRIES.${index}.hours`, Number(e.target.value))
                                                    }
                                                />
                                            </div>

                                            <div className='self-end'>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="text-red-500"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </form>
                    </Form>
                    <DialogFooter>
                        <Button onClick={form.handleSubmit(saveActionFormInfo)}>Add Action</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
