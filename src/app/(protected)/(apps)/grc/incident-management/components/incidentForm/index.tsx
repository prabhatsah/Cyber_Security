'use client'
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
import FormDateInput from '@/ikon/components/form-fields/date-input';
import FormInput from '@/ikon/components/form-fields/input';
import FormTextarea from '@/ikon/components/form-fields/textarea';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Form } from '@/shadcn/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { z } from 'zod';
import { useRouter } from "next/navigation";
import { SAVE_DATE_FORMAT, SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';

export const IncidentFormSchema = z.object({
    INCIDENT_TITLE: z
        .string()
        .min(2, { message: 'Incident Title must be at least 2 characters long.' })
        .trim(),
    INCIDENT_TYPE: z
        .string()
        .min(2, { message: 'Incident Type be at least 2 characters long.' })
        .trim(),
    INCIDENT_PRIORITY: z
        .string()
        .min(2, { message: 'Incident Priority be at least 2 characters long.' })
        .trim(),
    INCIDENT_OWNER: z
        .string()
        .min(2, { message: 'Incident Owner be at least 2 characters long.' })
        .trim(),
    INCIDENT_DATE: z.date({
        required_error: "Incident Date Is Required",
    }),
    AFFECTED_SYSTEM: z
        .string()
        .optional(),
    DESCRIPTION: z
        .string()
        .optional()

})

export const incidentType = [
    { value: "security", label: "Security Incident" },
    { value: "system", label: "System Outage" },
    { value: "network", label: "Network Issue" },
    { value: "data", label: "Data Breach" }
]

export const incidentPriority = [
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
]

export default function IncidentForm({ open, setOpen, userIdNameMap, editIncident }:
    { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, userIdNameMap: { value: string, label: string }[], editIncident: Record<string, string> | null }) {
    
    const router = useRouter();
    const form = useForm<z.infer<typeof IncidentFormSchema>>({
        resolver: zodResolver(IncidentFormSchema),
        defaultValues: {
            INCIDENT_TITLE: editIncident ? editIncident.incidentTitle : '',
            INCIDENT_TYPE: editIncident ? editIncident.incidentType : '',
            INCIDENT_PRIORITY: editIncident ? editIncident.incidentPriority : '',
            INCIDENT_OWNER: editIncident ? editIncident.incidentOwner : '',
            INCIDENT_DATE: editIncident ? new Date(editIncident.incidentDate) : undefined,
            AFFECTED_SYSTEM: editIncident ? editIncident.affectedSystem : '',
            DESCRIPTION: editIncident ? editIncident.description : '',
        },
    });
    async function saveIncidentInfo(data: z.infer<typeof IncidentFormSchema>) {
        console.log(data);

        const incidentData = {
            incidentId: editIncident ? editIncident.incidentId : v4(),
            incidentTitle: data.INCIDENT_TITLE,
            incidentType: data.INCIDENT_TYPE,
            incidentPriority: data.INCIDENT_PRIORITY,
            incidentOwner: data.INCIDENT_OWNER,
            incidentDate: data.INCIDENT_DATE,
            incidentStatus: "Open",
            affectedSystem: data.AFFECTED_SYSTEM,
            description: data.DESCRIPTION
        }
        console.log(incidentData);

        if (editIncident) {
            const editIncidentId = editIncident.incidentId;
            const incidentCreateInstances = await getMyInstancesV2({
                processName: "Incident Create",
                predefinedFilters: { taskName: "View Incident" },
                mongoWhereClause: `this.Data.incidentId == "${editIncidentId}"`,
            })
            console.log(incidentCreateInstances);
            const taskId = incidentCreateInstances[0].taskId;
            console.log(taskId);

            await invokeAction({
                taskId: taskId,
                data: incidentData,
                transitionName: 'update View Incident',
                processInstanceIdentifierField: ''
            })
        }
        else {
            const incidentCreateProcessId = await mapProcessName({ processName: "Incident Create" });
            console.log(incidentCreateProcessId);
            await startProcessV2({
                processId: incidentCreateProcessId,
                data: incidentData,
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
                        <DialogTitle>Incident Form</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Form {...form}>
                            <form>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <FormInput formControl={form.control} name={"INCIDENT_TITLE"} label={"Incident Title"} placeholder={"Enter Incident Title"} />
                                    <FormComboboxInput items={incidentType} formControl={form.control} name={"INCIDENT_TYPE"} placeholder={"Choose Incident Type"} label={"Incident Type"} />
                                    <FormComboboxInput items={incidentPriority} formControl={form.control} name={"INCIDENT_PRIORITY"} placeholder={"Choose Incident Priority"} label={"Incident Priority"} />
                                    <FormComboboxInput items={userIdNameMap} formControl={form.control} name={"INCIDENT_OWNER"} placeholder={"Choose Incident Owner"} label={"Incident Owner"} />
                                    <FormDateInput formControl={form.control} name={"INCIDENT_DATE"} label={"Incident Date"} placeholder={"Enter Incident Date"} dateFormat={SAVE_DATE_FORMAT_GRC}/>
                                    <FormInput formControl={form.control} name={"AFFECTED_SYSTEM"} label={"Affected System"} placeholder={"Enter Affected System"} />
                                    <div className='grow h-100 col-span-1 md:col-span-2'>
                                        <FormTextarea formControl={form.control} name={"DESCRIPTION"} placeholder={"Description"} formItemClass="h-full" className='h-full' />
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={form.handleSubmit(saveIncidentInfo)}>{editIncident ? 'Edit' : 'Save'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
