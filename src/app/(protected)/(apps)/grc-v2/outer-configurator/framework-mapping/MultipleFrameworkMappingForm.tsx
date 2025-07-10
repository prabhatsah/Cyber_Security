'use client';
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shadcn/ui/form";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { Button } from "@/shadcn/ui/button";
import { DialogFooter } from "@/shadcn/ui/dialog";
import { Textarea } from "@/shadcn/ui/textarea";
import { v4 } from 'uuid';

// Zod schema for validation
const FrameworkMappingSchema = z.object({
    framework1: z.string().nonempty({ message: "Framework 1 is required." }),
    controlPolicy1: z.string().nonempty({ message: "Control Policy 1 is required." }),
    framework2: z.string().nonempty({ message: "Framework 2 is required." }),
    controlPolicy2: z.string().nonempty({ message: "Control Policy 2 is required." }),
    notes: z.string().optional(),
});

export default function MultipleFrameworkMappingForm({
    onSave,
    editMapping,
    closeForm,
    frameworkDetailsData,
    selectedIdForMapping
}: {
    onSave: (data: Record<string, any>) => void;
    editMapping: Record<string, string> | null;
    closeForm: (open: boolean) => void;
    frameworkDetailsData: Record<string, any>[];
    selectedIdForMapping?: string | null
}) {

    console.log("frameworkDetailsData ==========>>>>>", frameworkDetailsData);
    const form = useForm<z.infer<typeof FrameworkMappingSchema>>({
        resolver: zodResolver(FrameworkMappingSchema),
        defaultValues: {
            framework1: editMapping?.framework1 || "",
            controlPolicy1: editMapping?.controlPolicy1 || "",
            framework2: editMapping?.framework2 || "",
            controlPolicy2: editMapping?.controlPolicy2 || "",
            notes: editMapping?.notes || "",
        },
    });



    const { handleSubmit, watch, setValue } = form;
    const selectedFramework1 = watch("framework1");
    const selectedFramework2 = watch("framework2");

    useEffect(() => {
        if (selectedIdForMapping) {
            setValue("framework1", selectedIdForMapping);
        }
    }, [selectedIdForMapping, setValue]);



    const [controlPolicies1, setControlPolicies1] = useState<{ label: string, value: string }[]>([]);
    const [controlPolicies2, setControlPolicies2] = useState<{ label: string, value: string }[]>([]);

    // Populate control policies when framework changes
    useEffect(() => {
        if (selectedFramework1) {
            const framework = frameworkDetailsData.find(fw => fw.id === selectedFramework1);
            const draftEntries = Object.values(framework?.entries || {});
            const identifierFieldConfigInd = framework?.configureData.find(
                (data) => data.id === framework?.identifierField?.index
            );
            const identifierFieldConfigTitle = framework?.configureData.find(
                (data) => data.id === framework?.identifierField?.title
            );
            const identifierFieldConfigDesc = framework?.configureData.find(
                (data) => data.id === framework?.identifierField?.description
            );
            const identifierFieldNameInd = identifierFieldConfigInd?.name;
            const identifierFieldNametit = identifierFieldConfigTitle?.name;
            const identifierFieldNameDesc = identifierFieldConfigDesc?.name;

            let entries: { label: string, value: string }[] = [];
            if (identifierFieldNameInd) {
                entries = draftEntries.map((parentEntry: any) => {
                    let label = '';
                    if (parentEntry[identifierFieldNametit]) {
                        label = `${parentEntry[identifierFieldNameInd]} - ${parentEntry[identifierFieldNametit]}`;
                    } else if (parentEntry[identifierFieldNameDesc]) {
                        label = `${parentEntry[identifierFieldNameInd]} - ${parentEntry[identifierFieldNameDesc]}`;
                    } else {
                        label = parentEntry[identifierFieldNameInd];
                    }
                    return {
                        label,
                        value: parentEntry.id
                    };
                });
            }
            setControlPolicies1(entries);
        } else {
            setControlPolicies1([]);
        }
        // Reset control policy when framework changes
        setValue("controlPolicy1", "");
    }, [selectedFramework1, frameworkDetailsData, setValue]);

    useEffect(() => {
        if (selectedFramework2) {
            const framework = frameworkDetailsData.find(fw => fw.id === selectedFramework2);
            const draftEntries = Object.values(framework?.entries || {});
            const identifierFieldConfigInd = framework?.configureData.find(
                (data) => data.id === framework?.identifierField?.index
            );
            const identifierFieldConfigTitle = framework?.configureData.find(
                (data) => data.id === framework?.identifierField?.title
            );
            const identifierFieldConfigDesc = framework?.configureData.find(
                (data) => data.id === framework?.identifierField?.description
            );
            const identifierFieldNameInd = identifierFieldConfigInd?.name;
            const identifierFieldNametit = identifierFieldConfigTitle?.name;
            const identifierFieldNameDesc = identifierFieldConfigDesc?.name;

            let entries: { label: string, value: string }[] = [];
            if (identifierFieldNameInd) {
                entries = draftEntries.map((parentEntry: any) => {
                    let label = '';
                    if (parentEntry[identifierFieldNametit]) {
                        label = `${parentEntry[identifierFieldNameInd]} - ${parentEntry[identifierFieldNametit]}`;
                    } else if (parentEntry[identifierFieldNameDesc]) {
                        label = `${parentEntry[identifierFieldNameInd]} - ${parentEntry[identifierFieldNameDesc]}`;
                    } else {
                        label = parentEntry[identifierFieldNameInd];
                    }
                    return {
                        label,
                        value: parentEntry.id
                    };
                });
            }
            setControlPolicies2(entries);
        } else {
            setControlPolicies2([]);
        }
        setValue("controlPolicy2", "");
    }, [selectedFramework2, frameworkDetailsData, setValue]);

    const onSubmit = async (data: z.infer<typeof FrameworkMappingSchema>) => {
        const newMapping = {
            id: editMapping?.id || v4(),
            ...data,
        };
        onSave(newMapping);
    };

    function setOpen(open: boolean) {
        closeForm(open);
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormComboboxInput
                            items={frameworkDetailsData
                                .filter(fw => !selectedFramework2 || fw.id !== selectedFramework2)
                                .map(fw => ({ value: fw.id, label: fw.name }))
                            }
                            formControl={form.control}
                            name="framework1"
                            placeholder="Select Framework 1"
                            label="Framework 1*"
                            disabled={!!selectedIdForMapping}
                        />

                        <FormComboboxInput
                            items={
                                (selectedIdForMapping
                                    ? frameworkDetailsData.filter(
                                        fw =>
                                            fw.status === "published" &&
                                            fw.id !== selectedFramework1 // Exclude selected framework1
                                    )
                                    : frameworkDetailsData.filter(
                                        fw => fw.id !== selectedFramework1 // Exclude selected framework1
                                    )
                                ).map(fw => ({ value: fw.id, label: fw.name }))
                            }
                            formControl={form.control}
                            name="framework2"
                            placeholder="Select Framework 2"
                            label="Framework 2*"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <FormComboboxInput
                            items={controlPolicies1}
                            formControl={form.control}
                            name="controlPolicy1"
                            placeholder="Select the element"
                            label="Items 1*"
                            disabled={!selectedFramework1}
                        />
                        <FormComboboxInput
                            items={controlPolicies2}
                            formControl={form.control}
                            name="controlPolicy2"
                            placeholder="Select the element"
                            label="Items 2*"
                            disabled={!selectedFramework2}
                        />
                    </div>
                    <div className="grid grid-cols-1">
                        <Textarea placeholder="Add notes (optional)" {...form.register("notes")} />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add</Button>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </div>
            </form>
        </Form>
    );
}