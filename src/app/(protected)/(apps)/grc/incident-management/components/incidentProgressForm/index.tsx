import React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/shadcn/ui/form';
import FormInput from '@/ikon/components/form-fields/input';
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
import FormDateInput from '@/ikon/components/form-fields/date-input';
import FormTextarea from '@/ikon/components/form-fields/textarea';
import { Button } from '@/shadcn/ui/button';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { useRouter } from "next/navigation";
import { SAVE_DATE_FORMAT, SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';

export const IncidentProgressFormSchema = z.object({
    INCIDENT_ID: z
        .string()
        .min(2, { message: 'Incident Title must be at least 2 characters long.' })
        .trim(),
    INCIDENT_TITLE: z
        .string()
        .min(2, { message: 'Incident Title must be at least 2 characters long.' })
        .trim(),
    INCIDENT_OWNER: z
        .string()
        .min(2, { message: 'Incident Title must be at least 2 characters long.' })
        .trim(),
    INCIDENT_DATE: z.date({
        required_error: "Incident Date Is Required",
    }),
    INCIDENT_ASSIGN_TO: z
        .string()
        .min(2, { message: 'Incident Title must be at least 2 characters long.' })
        .trim(),
    ESTIMATED_RESOLUTION_DATE: z.date({
        required_error: "Estimated Resolution Date Is Required",
    }),
    INVESTIGATION_NOTES: z
        .string()
        .min(2, { message: 'Incident Notes must be at least 2 characters long.' })
        .trim(),

})

export default function IncidentProgressForm({ open, setOpen, userIdNameMap, inProgressIncident, editInProgressRow }:
    { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, userIdNameMap: { value: string, label: string }[], inProgressIncident: Record<string, string> | null, editInProgressRow: Record<string, string> | null }) {

    const router = useRouter();
    const form = useForm<z.infer<typeof IncidentProgressFormSchema>>({
        resolver: zodResolver(IncidentProgressFormSchema),
        defaultValues: {
            INCIDENT_ID: inProgressIncident ? inProgressIncident.incidentId : editInProgressRow ? editInProgressRow.incidentId : '',
            INCIDENT_TITLE: inProgressIncident ? inProgressIncident.incidentTitle : editInProgressRow ? editInProgressRow.incidentTitle : '',
            INCIDENT_OWNER: inProgressIncident ? inProgressIncident.incidentOwner : editInProgressRow ? editInProgressRow.incidentOwner : '',
            INCIDENT_DATE: inProgressIncident ? new Date(inProgressIncident.incidentDate) : editInProgressRow ? new Date(editInProgressRow.incidentDate) : undefined,
            INCIDENT_ASSIGN_TO: editInProgressRow ? editInProgressRow.incidentAssignTo : '',
            ESTIMATED_RESOLUTION_DATE: editInProgressRow ? new Date(editInProgressRow.estimatedResolutionDate) : undefined,
            INVESTIGATION_NOTES: editInProgressRow ? editInProgressRow.investigationNotes : ''
        },
    });

    async function saveProgressIncidentInfo(data: z.infer<typeof IncidentProgressFormSchema>) {
        console.log(data);

        const incidentProgressData = {
            incidentId: data.INCIDENT_ID,
            incidentTitle: data.INCIDENT_TITLE,
            incidentType: inProgressIncident?.incidentType || editInProgressRow?.incidentType || '',
            incidentPriority: inProgressIncident?.incidentPriority || editInProgressRow?.incidentPriority || '',
            incidentOwner: data.INCIDENT_OWNER,
            incidentDate: data.INCIDENT_DATE,
            incidentStatus: "InProgress",
            affectedSystem: inProgressIncident?.affectedSystem || editInProgressRow?.affectedSystem || '',
            description: inProgressIncident?.description || editInProgressRow?.description || '',
            incidentAssignTo: data.INCIDENT_ASSIGN_TO,
            estimatedResolutionDate: data.ESTIMATED_RESOLUTION_DATE,
            investigationNotes: data.INVESTIGATION_NOTES
        }


        const inProgressIncidentId = data.INCIDENT_ID;
        const incidentCreateInstances = await getMyInstancesV2({
            processName: "Incident Create",
            predefinedFilters: { taskName: "View Incident" },
            mongoWhereClause: `this.Data.incidentId == "${inProgressIncidentId}"`,
        })
        console.log(incidentCreateInstances);
        const taskId = incidentCreateInstances[0].taskId;
        console.log(taskId);

        await invokeAction({
            taskId: taskId,
            data: incidentProgressData,
            transitionName: 'update View Incident',
            processInstanceIdentifierField: ''
        })

        if (editInProgressRow) {
            const editProgressIncidentId = data.INCIDENT_ID;
            const incidentProgressInstances = await getMyInstancesV2({
                processName: "Incident Progress",
                predefinedFilters: { taskName: "View Incident Progress" },
                mongoWhereClause: `this.Data.incidentId == "${editProgressIncidentId}"`,
                allInstances: true
            })
            console.log(incidentProgressInstances);
            const taskId = incidentProgressInstances[0]?.taskId;
            console.log(taskId);

            await invokeAction({
                taskId: taskId,
                data: incidentProgressData,
                transitionName: 'update View Incident Progress',
                processInstanceIdentifierField: ''
            })
        }
        else {
            const incidentProgressProcessId = await mapProcessName({ processName: "Incident Progress" });
            console.log(incidentProgressProcessId);
            await startProcessV2({
                processId: incidentProgressProcessId,
                data: incidentProgressData,
                processIdentifierFields: ""
            })
        }

        setOpen(false);
        router.refresh();
    }
    return (

        <>
            <Dialog open={open} onOpenChange={setOpen}>

                <DialogContent className="max-w-[60%]">
                    <DialogHeader>
                        <DialogTitle>Incident Progress Form</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Form {...form}>
                            <form>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <FormInput formControl={form.control} name={"INCIDENT_ID"} label={"Incident ID"} placeholder={"Enter Incident ID"} disabled />
                                    <FormInput formControl={form.control} name={"INCIDENT_TITLE"} label={"Incident Title"} placeholder={"Enter Incident Title"} disabled />
                                    <FormComboboxInput items={userIdNameMap} formControl={form.control} name={"INCIDENT_OWNER"} placeholder={"Choose Incident Owner"} label={"Incident Owner"} disabled />
                                    <FormDateInput formControl={form.control} name={"INCIDENT_DATE"} label={"Incident Date"} placeholder={"Enter Incident Date"} dateFormat={SAVE_DATE_FORMAT_GRC} calendarDateDisabled={true} />
                                    <FormComboboxInput items={userIdNameMap} formControl={form.control} name={"INCIDENT_ASSIGN_TO"} placeholder={"Choose Incident Assigner"} label={"Incident Assignee"} />
                                    <FormDateInput formControl={form.control} name={"ESTIMATED_RESOLUTION_DATE"} label={"Estimated Resolution Date"} placeholder={"Enter Incident Resolution Date"} dateFormat={SAVE_DATE_FORMAT_GRC}/>
                                    <div className='grow h-100 col-span-1 md:col-span-2'>
                                        <FormTextarea formControl={form.control} name={"INVESTIGATION_NOTES"} placeholder={"Investigation Notes"} formItemClass="h-full" className='h-full' label={"Investigation Notes"} />
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={form.handleSubmit(saveProgressIncidentInfo)} className='mt-3'>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>

    )
}
