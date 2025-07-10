'use client'
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
import FormDateInput from '@/ikon/components/form-fields/date-input';
import FormInput from '@/ikon/components/form-fields/input';
import FormTextarea from '@/ikon/components/form-fields/textarea';
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { userMapSchema } from '../../../../components/createUserMap';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { useRouter } from 'next/navigation';
import { Label } from '@/shadcn/ui/label';
import { Input } from '@/shadcn/ui/input';
import { singleFileUpload } from '@/ikon/utils/api/file-upload';
import { v4 } from 'uuid';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover';
import { cn } from '@/shadcn/lib/utils';
import { ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shadcn/ui/command';
import FormMultiComboboxInput from '@/ikon/components/form-fields/multi-combobox-input';
import OpenAskQueryForm from '../askQuery';

export const AuditReportFormSchema = z.object({
    FRAMEWORK_NAME: z
        .string()
        .min(2, { message: 'Framework Name must be at least 2 characters long.' })
        .trim(),
    CONTROL_OBJECTIVE: z
        .string()
        .min(2, { message: 'Control Objective must be at least 2 characters long.' })
        .trim(),
    CONTROL_NAME: z
        .string()
        .min(2, { message: 'Control Name must be at least 2 characters long.' })
        .trim(),
    // OBJECTIVE_WEIGHTAGE: z
    //     .string()
    //     .min(1, { message: 'Control Weightage must be at least 1 character long.' })
    //     .trim(),
    AUDIT_TYPE: z
        .string()
        .min(2, { message: 'Audit Type must be at least 2 characters long.' })
        .trim(),
    CONTROL_DESCRIPTION: z
        .string()
        .optional(),
    // .min(2, { message: 'Control Description must be at least 2 characters long.' })
    // .trim(),
    COMPLIANCE_STATUS: z
        .string()
        .min(2, { message: 'Compliance Status must be at least 2 characters long.' })
        .trim(),
    OBSERVATION: z.string().optional(),
    CORRECTIVE_MEASURES: z.string().optional(),
    ASSIGNEE: z.string().optional(),
    CLOSING_DATE: z.date().optional(),
    RECOMENDATION: z.string().optional(),
    UPLOAD_REPORT_DOCUMENT: z
        // .custom<File | null>((file) => file instanceof File, {
        //     message: "File is required",
        // }),
        .any().optional(),
    // AUDITOR_NAME: z
    //     .string()
    //     .min(2, { message: 'Auditor Name is Required' })
    //     .trim(),
    AUDITOR_NAME: z
        .array(z.string(), {
            required_error: "Please Select atleast One Team Member",
            invalid_type_error: "Must be an array of strings"
        })
        .min(1, "At least one value is required"),
    AUDITEE_NAME: z
        .array(z.string(), {
            required_error: "Please Select atleast One Team Member",
            invalid_type_error: "Must be an array of strings"
        })
        .min(1, "At least one value is required"),
    AUDIT_NAME: z
        .string()
        .min(2, { message: 'Audit Name must be at least 2 characters long.' })
        .trim(),
})
// .superRefine((data, ctx) => {
//     if (data.COMPLIANCE_STATUS.toLowerCase() === 'failed') {
//         if (!data.CORRECTIVE_MEASURES || data.CORRECTIVE_MEASURES.trim().length < 2) {
//             ctx.addIssue({
//                 path: ['CORRECTIVE_MEASURES'],
//                 code: z.ZodIssueCode.custom,
//                 message: 'Corrective Measures is required.',
//             });
//         }

//         if (!data.RECOMENDATION || data.RECOMENDATION.trim().length < 2) {
//             ctx.addIssue({
//                 path: ['RECOMENDATION'],
//                 code: z.ZodIssueCode.custom,
//                 message: 'Recomendation is required.',
//             });
//         }

//         if (!data.ASSIGNEE || data.ASSIGNEE.trim().length < 2) {
//             ctx.addIssue({
//                 path: ['ASSIGNEE'],
//                 code: z.ZodIssueCode.custom,
//                 message: 'Assignee is required.',
//             });
//         }

//         if (!data.CLOSING_DATE) {
//             ctx.addIssue({
//                 path: ['CLOSING_DATE'],
//                 code: z.ZodIssueCode.custom,
//                 message: 'Closing Date is required.',
//             });
//         }
//     }
// });

export const auditType = [
    { label: "Best Practice", value: 'best-practice' },
    { label: "Standard Practice", value: 'standard' },
    { label: "Regulation", value: 'rulesAndRegulation' },
]

export const complianceStatus = [
    { label: "Passed", value: 'passed' },
    { label: "Failed", value: 'failed' },
]

export default function AuditReportForm({ open, setOpen, editRow, updateRow, userMap }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, editRow: Record<string, string> | null, updateRow: Record<string, string> | null, userMap: userMapSchema }) {
    console.log(editRow)
    console.log(updateRow);
    const router = useRouter();
    const form = useForm<z.infer<typeof AuditReportFormSchema>>({
        resolver: zodResolver(AuditReportFormSchema),
        defaultValues: {
            FRAMEWORK_NAME: editRow ? editRow.frameworkName : updateRow ? updateRow.frameworkName : '',
            CONTROL_OBJECTIVE: editRow ? editRow.objectiveName : updateRow ? updateRow.objectiveName : '',
            CONTROL_NAME: editRow ? editRow.controlName : updateRow ? updateRow.controlName : '',
            // OBJECTIVE_WEIGHTAGE: editRow ? editRow.objectiveWeight.toString() : '',
            AUDIT_TYPE: editRow ? editRow.auditType : updateRow ? updateRow.auditType : '',
            CONTROL_DESCRIPTION: editRow ? editRow.controlDescription : updateRow ? updateRow.controlDescription : '',
            COMPLIANCE_STATUS: updateRow ? updateRow.complianceStatus : '',
            OBSERVATION: updateRow ? updateRow.observation : '',
            CORRECTIVE_MEASURES: updateRow ? updateRow.correctiveMeasures : '',
            ASSIGNEE: updateRow && updateRow?.assignee?.length ? updateRow.assignee : '',
            CLOSING_DATE: updateRow && updateRow?.closingDate?.length ? new Date(updateRow.closingDate) : undefined,
            RECOMENDATION: updateRow && updateRow.recomendation?.length ? updateRow.recomendation : '',
            UPLOAD_REPORT_DOCUMENT: undefined,
            AUDITOR_NAME: editRow ? editRow.auditorId : updateRow ? updateRow.auditorId : [],
            AUDITEE_NAME: editRow ? editRow.auditeeId : updateRow ? updateRow.auditeeId : [],
            AUDIT_NAME: editRow ? editRow.auditName : updateRow ? updateRow.auditName : '',
        },
    });

    async function saveAuditReportForm(data: z.infer<typeof AuditReportFormSchema>) {
        console.log(data);
        const uploadDoc = data.UPLOAD_REPORT_DOCUMENT;
        const resourceData = uploadDoc && await singleFileUpload(uploadDoc);

        const saveReport = {
            id: updateRow ? updateRow.id : v4(),
            frameworkName: data.FRAMEWORK_NAME,
            controlName: data.CONTROL_NAME,
            controlWeight: editRow?.controlWeight || updateRow?.controlWeight || 0,
            objectiveWeight: editRow?.objectiveWeight || updateRow?.objectiveWeight || 0,
            auditType: data?.AUDIT_TYPE,
            objectiveName: data?.CONTROL_OBJECTIVE,
            controlDescription: data.CONTROL_DESCRIPTION,
            complianceStatus: data.COMPLIANCE_STATUS,
            assignee: data.ASSIGNEE,
            closingDate: data.CLOSING_DATE,
            correctiveMeasures: data.CORRECTIVE_MEASURES,
            observation: data.OBSERVATION,
            recomendation: data.RECOMENDATION,
            reportDocument: resourceData,
            auditorId: data.AUDITOR_NAME,
            auditeeId: data.AUDITEE_NAME,
            auditStatus: updateRow ? 'InProgress' : updateRow?.status,
            auditName: data.AUDIT_NAME,

        }

        console.log(saveReport);


        if (updateRow) {
            const addAuditReportInst = await getMyInstancesV2({
                processName: 'Add Audit Report',
                predefinedFilters: { taskName: 'Edit Audit Report' },
                mongoWhereClause: `this.Data.objectiveName == "${updateRow.objectiveName}"`
            })

            const auditReportTaskId = addAuditReportInst[0].taskId;
            console.log(auditReportTaskId);
            await invokeAction({
                taskId: auditReportTaskId,
                transitionName: 'update Edit Audit Report',
                data: saveReport,
                processInstanceIdentifierField: ''
            })

        } else {
            const processId = await mapProcessName({ processName: "Add Audit Report" });
            console.log(processId);
            await startProcessV2({
                processId: processId,
                data: saveReport,
                processIdentifierFields: ''
            })
        }
        console.log("Saved Successful");
        router.refresh();
        setOpen(false);
    }



    const complianceStatusValue = form.watch("COMPLIANCE_STATUS");

    const errors = form.formState.errors;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        console.log(file);
        form.setValue("UPLOAD_REPORT_DOCUMENT", file, { shouldValidate: true });
    };

    return (

        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[60%] p-0 flex flex-col max-h-[90vh]">

                    <DialogHeader className="pt-3 px-3">
                        <DialogTitle>Audit Report Form</DialogTitle>
                    </DialogHeader>

                    <div className="overflow-y-auto px-4 pb-3 pt-3 flex-1">
                        <Form {...form}>
                            <form>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                    <FormInput formControl={form.control} name={"FRAMEWORK_NAME"} label={"Framework Name"} placeholder={"Enter Framework Name"} />
                                    <FormInput formControl={form.control} name={"AUDIT_NAME"} label={"Audit Name"} placeholder={"Enter Audit Name"} />
                                    <FormComboboxInput items={auditType} formControl={form.control} name={"AUDIT_TYPE"} placeholder={"Choose Audit Type"} label={"Audit Type"} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
                                    <FormMultiComboboxInput
                                        formControl={form.control}
                                        name="AUDITOR_NAME"
                                        label={"Auditor Name"}
                                        placeholder={"Choose Auditor Name"}
                                        items={userMap}
                                    />
                                    <FormMultiComboboxInput
                                        formControl={form.control}
                                        name="AUDITEE_NAME"
                                        label={"Auditee Name"}
                                        placeholder={"Choose Auditee Name"}
                                        items={userMap}
                                    />

                                    <FormInput formControl={form.control} name={"CONTROL_NAME"} label={"Control Name"} placeholder={"Enter Control Name"} />
                                    <FormInput formControl={form.control} name={"CONTROL_OBJECTIVE"} label={"Control Objective"} placeholder={"Enter Control Objective"} />
                                    {/* <FormInput formControl={form.control} name={"OBJECTIVE_WEIGHTAGE"} label={"Objective Weightage"} placeholder={"Enter Objective Weightage"} /> */}
                                    {/* <FormComboboxInput items={userMap} formControl={form.control} name={"AUDITOR_NAME"} placeholder={"Choose Auditor Name"} label={"Auditor Name"} /> */}

                                    <div className='col-span-1 md:col-span-2 h-20'>
                                        <FormTextarea formControl={form.control} name={"CONTROL_DESCRIPTION"} placeholder={"Description"} label={"Control Description"} formItemClass='h-full' className='h-full' />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 mb-10" >
                                    <div className="col-span-1 md:col-span-2 h-20">
                                        <FormTextarea formControl={form.control} name={"OBSERVATION"} placeholder={"Observation"} label={"Observation"} formItemClass='h-full' className='h-full' />
                                    </div>
                                </div>

                                <div className='col-span-1 md:col-span-2 mb-3'>
                                    <FormField
                                        control={form.control}
                                        name="UPLOAD_REPORT_DOCUMENT"
                                        render={() => (
                                            <FormItem>
                                                <Label htmlFor="upload">Supporting Document</Label>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        id="upload"
                                                        onChange={handleFileChange}
                                                        className="cursor-pointer"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${complianceStatusValue === 'failed' && updateRow && 'mb-10'}`}>
                                    <FormComboboxInput items={complianceStatus} formControl={form.control} name={"COMPLIANCE_STATUS"} placeholder={"Choose Compliance Status"} label={"Compliance Status"} />
                                    {complianceStatusValue === 'failed' && updateRow && (
                                        <>
                                            <FormComboboxInput items={userMap} formControl={form.control} name={"ASSIGNEE"} placeholder={"Choose Assignee Name"} label={"Assignee Name"} />
                                            <FormDateInput formControl={form.control} name={"CLOSING_DATE"} label={"Closing Date"} placeholder={"Enter Closing Date"} dateFormat={SAVE_DATE_FORMAT_GRC} />
                                            <div className={`col-span-1 md:col-span-3 h-20 ${errors.RECOMENDATION ? 'mb-10' : 'mb-9'}`}>
                                                <FormTextarea formControl={form.control} name={"RECOMENDATION"} placeholder={"Enter Recomendation"} label={"Recomendation"} formItemClass='h-full' className='h-full' />
                                            </div>
                                            <div className='col-span-1 md:col-span-3 h-20'>
                                                <FormTextarea formControl={form.control} name={"CORRECTIVE_MEASURES"} placeholder={"Enter Corrective Measures"} label={"Actions"} formItemClass='h-full' className='h-full' />
                                            </div>

                                        </>
                                    )}
                                </div>


                            </form>
                        </Form>
                    </div>

                    <DialogFooter className="px-2 pb-3">
                        {/* <Button type='button' variant='outline' >Ask Query</Button> */}
                        <OpenAskQueryForm />
                        <Button type="submit" onClick={form.handleSubmit(saveAuditReportForm)}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>

    )
}
