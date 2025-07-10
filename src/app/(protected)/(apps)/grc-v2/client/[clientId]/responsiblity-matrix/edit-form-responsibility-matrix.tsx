"use client";

import React, { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shadcn/ui/form";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { toast } from "sonner";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { useRouter } from 'next/navigation';

const FrameworkFormSchema = z.object({
    INDEX: z.string().min(1, "Index is required."),
    TITLE: z.string().min(1, "Title is required."),
    DESCRIPTION: z.string().optional(),
    TESTING_PROCEDURE: z.string().optional(),
    ENTITY_RESPONSIBLE: z.string().optional(),
    AWS_REQ_APPLICABLE_NOTES: z.string().optional(),
    REVIEW_DATE: z.string().optional(),
    DIGITAL_DC_REQ_NOTES: z.string().optional(),
});

type FrameworkEntry = z.infer<typeof FrameworkFormSchema>;

export default function EditFrameworkEntryForm({
    open,
    setOpen,
    entry,
    entryId,
    entries,
    frameworkId, 
    profileData, 
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    entry: FrameworkEntry;
    entryId: string;
    entries: FrameworkEntry[];
    frameworkId: string;
    profileData: any; 
}) {


    const form = useForm<FrameworkEntry>({
        resolver: zodResolver(FrameworkFormSchema),
        //defaultValues: entry,
        defaultValues: {
            INDEX: entry?.index,
            TITLE: entry?.title,
            DESCRIPTION: entry?.description || "",
            TESTING_PROCEDURE: entry?.testingProcedure || "", // Or fill from entry if available
            ENTITY_RESPONSIBLE: entry?.entityResponsible || "",
            AWS_REQ_APPLICABLE_NOTES: entry?.awsRequirementApplicabilityNotes || "",
            REVIEW_DATE: entry?.reviewDate || "",
            DIGITAL_DC_REQ_NOTES: entry?.digitalDcRequirementNotes || "",
        }
    });


    useEffect(() => {
        form.reset({
            INDEX: entry.index,
            TITLE: entry.title,
            DESCRIPTION: entry.description || "",
            TESTING_PROCEDURE: entry.testingProcedure || "",
            ENTITY_RESPONSIBLE: entry.entityResponsible || "",
            AWS_REQ_APPLICABLE_NOTES: entry.awsRequirementApplicabilityNotes || "",
            REVIEW_DATE: entry.reviewDate || "",
            DIGITAL_DC_REQ_NOTES: entry.digitalDcRequirementNotes || "",
        });
    }, [entry, form]);


    const router = useRouter();

    async function handleSubmitData(data: FrameworkEntry) {
        console.log("Form submitted with data:", data);
        try {
            console.log("Submitting data:", data);
            console.log("Framework ID:", frameworkId);
            const frameworkInstances = await getMyInstancesV2({
                processName: "Responsibility Matrix Process",
                predefinedFilters: { taskName: "Edit Matrix" },
                mongoWhereClause: `this.Data.id == '${frameworkId}'`,
            });

            console.log("Framework Instances:", frameworkInstances);
            console.log("Entry ID:", entryId);
            console.log("Entries:", entries);
            console.log("entry:", entry);
            const taskId = frameworkInstances[0]?.taskId;
            if (!taskId) throw new Error("No taskId found for framework");

           let dataToUpdate = frameworkInstances[0].data;


            if(entry.treatAsParent){
                dataToUpdate.parentEntries = dataToUpdate.parentEntries.map((parent: any) => {
                    if (parent.id === entryId) {
                        return {
                            ...parent,
                            index: data.INDEX,
                            title: data.TITLE,
                            description: data.DESCRIPTION,
                            testingProcedure: data.TESTING_PROCEDURE,
                            entityResponsible: data.ENTITY_RESPONSIBLE,
                            awsRequirementApplicabilityNotes: data.AWS_REQ_APPLICABLE_NOTES,
                            reviewDate: data.REVIEW_DATE,
                            digitalDcRequirementNotes: data.DIGITAL_DC_REQ_NOTES
                        };
                    }
                    return parent;
                });
            }


            console.log('helloooo')
           
            dataToUpdate.entries[entryId].index = data.INDEX;
            dataToUpdate.entries[entryId].title = data.TITLE;
            dataToUpdate.entries[entryId].description = data.DESCRIPTION;
            dataToUpdate.entries[entryId].testingProcedure = data.TESTING_PROCEDURE;
            dataToUpdate.entries[entryId].entityResponsible = data.ENTITY_RESPONSIBLE;
            dataToUpdate.entries[entryId].awsRequirementApplicabilityNotes = data.AWS_REQ_APPLICABLE_NOTES;
            dataToUpdate.entries[entryId].reviewDate = data.REVIEW_DATE;
            dataToUpdate.entries[entryId].digitalDcRequirementNotes = data.DIGITAL_DC_REQ_NOTES;


            dataToUpdate.activityLog.push({
                createBy: profileData.USER_NAME, // Replace with actual user ID
                createdAt: new Date().toISOString(),
                message: `Entry with ID ${entryId} updated for relationship matrix.`

            })

            console.log("Data to update:", dataToUpdate);
            console.log('profileData:', profileData);   


            await invokeAction({
                taskId,
                data: dataToUpdate,
                transitionName: "update edit matrix",
                processInstanceIdentifierField: "id"
            });

            toast.success("Entry updated successfully!",{duration: 3000});
            setOpen(false);
             form.reset();
             router.refresh();
        } catch (error) {
            console.error("Error while saving:", error);
            toast.error("Failed to update entry.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
            <DialogContent className="max-w-[50%]">
                <DialogHeader>
                    <DialogTitle>Edit Entry</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <FormInput formControl={form.control} name="INDEX" label="Index" placeholder="Enter Index" />
                        <FormInput formControl={form.control} name="TITLE" label="Title" placeholder="Enter Title" />
                        <FormTextarea formControl={form.control} name="DESCRIPTION" label="Description" placeholder="Enter Description" />
                        <FormTextarea formControl={form.control} name="TESTING_PROCEDURE" label="Testing Procedure" placeholder="Enter Testing Procedure" />
                        <FormInput formControl={form.control} name="ENTITY_RESPONSIBLE" label="Entity Responsible" placeholder="Enter Entity" />
                        <FormTextarea formControl={form.control} name="AWS_REQ_APPLICABLE_NOTES" label="AWS Requirement Applicability Notes" placeholder="Enter AWS notes" />
                        <FormInput formControl={form.control} name="REVIEW_DATE" type="date" label="Review Date" placeholder="Select Date" />
                        <FormTextarea formControl={form.control} name="DIGITAL_DC_REQ_NOTES" label="Digital DC Requirement Notes" placeholder="Enter Digital DC Notes" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" onClick={form.handleSubmit(handleSubmitData)}>
                            Save
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}