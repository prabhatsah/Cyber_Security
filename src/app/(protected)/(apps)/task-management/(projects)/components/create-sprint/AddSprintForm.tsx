import FormInput from '@/ikon/components/form-fields/input'
import { Button } from '@/shadcn/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { Form } from '@/shadcn/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
//import { ProjectDetailsForm } from './schema'
import FormDateInput from '@/ikon/components/form-fields/date-input'
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input'
import { DataTable } from '@/ikon/components/data-table'
import { DTColumnsProps } from '@/ikon/components/data-table/type'
import { Checkbox } from '@/shadcn/ui/checkbox'
import { SprintFormSchema } from './schema'
import { v4 } from 'uuid'
import { mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService'


interface AddSprintModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectIdentifier: string;
    epicData: Record<string, string>;
}



const AddSprintModal: React.FC<AddSprintModalProps> = ({
    isOpen,
    onClose,
    projectIdentifier,
    epicData
}) => {

    console.log("epicData", epicData);
    const epicDataItems = [];
    for (const key in epicData) {
        epicDataItems.push({ value: key, label: epicData[key] });

    }
    console.log("epicDataItems", epicDataItems);


    const form = useForm<z.infer<typeof SprintFormSchema>>({
        resolver: zodResolver(SprintFormSchema),
        defaultValues: {
            "EPIC_NAME": "",
            "SPRINT_NAME": "",
        },
    });



    async function saveSprintInfo(data: z.infer<typeof SprintFormSchema>) {
        console.log("data", data);
        const sprintData = {
            projectIdentifier: projectIdentifier,
            sprintName: data.SPRINT_NAME,
            epicId: data.EPIC_NAME,
            sprintId: v4(),
            sprintStatus: "Active",
        }
        console.log("sprintData", sprintData);
        const processId = await mapProcessName({
            processName: "Sprint"
        })
        const sprintInstance = await startProcessV2({
            processId: processId,
            data: sprintData,
            processIdentifierFields: "projectIdentifier,epicId",
        });
        console.log("Sprint Instance Created:", sprintInstance);

        onClose()
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
                <DialogContent className="max-w-5xl block" onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Add Project</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Form {...form}>
                            <form>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <FormComboboxInput items={epicDataItems} formControl={form.control} name={"EPIC_NAME"} placeholder={"Choose Epic Name"} label={"Epic Name"} />
                                    <FormInput formControl={form.control} name={"SPRINT_NAME"} label={"Sprint Name"} placeholder={"Enter Sprint Name"} />
                                </div>
                            </form>
                        </Form>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={form.handleSubmit(saveSprintInfo)}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddSprintModal;
