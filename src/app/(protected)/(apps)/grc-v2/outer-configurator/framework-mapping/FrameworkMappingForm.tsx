'use client';
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shadcn/ui/form";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Textarea } from "@/shadcn/ui/textarea";
import { v4 } from 'uuid';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
// Zod schema for validation
const FrameworkMappingSchema = z.object({
    framework1: z.string().nonempty({ message: "Framework 1 is required." }),
    controlPolicy1: z.string().nonempty({ message: "Control Policy 1 is required." }),
    framework2: z.string().nonempty({ message: "Framework 2 is required." }),
    controlPolicy2: z.string().nonempty({ message: "Control Policy 2 is required." }),
    notes: z.string().optional(),
});
export default function FrameworkMappingForm({
    open,
    setOpen,
    onSave,
    editMapping,
    frameworkMappingData,
    frameworkDetailsData
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: (data: Record<string, any>) => void;
    editMapping: Record<string, string> | null;
    frameworkMappingData: Record<string, any>[];
    frameworkDetailsData: Record<string, any>[]
}) {
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

    const { handleSubmit, setValue, watch } = form;
    const [controlPolicies1, setControlPolicies1] = useState<Record<string, any>[]>([]);
    const [controlPolicies2, setControlPolicies2] = useState<Record<string, any>[]>([]);
    const selectedFramework1 = watch("framework1");
    const selectedFramework2 = watch("framework2");

    const getControlPolicyDetails = (frameworkId: string, controlPolicyId: string) => {
        const framework = frameworkDetailsData.find(fd => fd.id === frameworkId);
        if (framework && framework.entries) {
            const entry = framework.entries[controlPolicyId];
            if (entry) {
                if (entry.title) {
                    return `${entry.index} - ${entry.title}`;
                } else if (entry.description) {
                    return `${entry.index} - ${entry.description}`;
                }
            }
        }
        return "N/A";
    };



    useEffect(() => {
        if (editMapping?.framework1) {
            const framework = frameworkDetailsData.find(fw => fw.id === editMapping.framework1);
            const controlPolicy1Id = editMapping?.controlPolicy1

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

            let label: string = '';


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
                        value: controlPolicy1Id ? controlPolicy1Id : parentEntry.id
                    };
                });
            }

            setControlPolicies1(entries);
        }

        if (editMapping?.framework2) {
            const framework = frameworkDetailsData.find(fw => fw.id === editMapping.framework2);
            const controlPolicy2Id = editMapping?.controlPolicy2

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

            let label: string = '';


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
                        value: controlPolicy2Id ? controlPolicy2Id : parentEntry.id
                    };
                });
            }

            setControlPolicies2(entries);
        }
    }, [editMapping, frameworkDetailsData]);

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
        }
    }, [selectedFramework1, frameworkDetailsData]);

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
        }
    }, [selectedFramework2, frameworkDetailsData]);




    const mergeMappingData = (frameworkData, mappingData) => {
        const invokeData = [];
        const startData = [];

        mappingData.forEach(newItem => {
            const existingItem = frameworkData.find(prevItem => prevItem.id === newItem.id);

            if (existingItem) {
                // ✅ New mappings come first, so they override existing ones
                const allMappings = [...newItem.mapping, ...existingItem.mapping];

                const uniqueMappingsMap = new Map();
                allMappings.forEach(map => {
                    if (!uniqueMappingsMap.has(map.id)) {
                        uniqueMappingsMap.set(map.id, map);
                    }
                });

                invokeData.push({
                    id: newItem.id,
                    mapping: Array.from(uniqueMappingsMap.values()),
                });
            } else {
                // New framework entirely
                startData.push(newItem);
            }
        });

        return { invokeData, startData };
    };




    const onSubmit = async (data: z.infer<typeof FrameworkMappingSchema>) => {
        const newMapping = {
            id: editMapping?.id || v4(), // Retain the existing ID if editing, otherwise generate a new one
            ...data,
        };

        onSave(newMapping); // Pass the new mapping object to the parent

        console.log("here it is the normal data which is coming from the form **************", newMapping);


        const resultMap: Record<string, any> = {};
        const ids = [newMapping.framework1, newMapping.framework2].sort();
        const key = `${ids[0]}_${ids[1]}`;
        resultMap[key] = {
            id: key,
            mapping: []
        };
        resultMap[key].mapping.push(newMapping);
        const result = Object.values(resultMap);

        const { invokeData, startData } = mergeMappingData(frameworkMappingData, result);

        console.log("here it is the final data which is coming from the form **************", invokeData);
        console.log("here it is the final data which is coming from the form ************** startttttt ", startData);

        setOpen(false); // Close the modal after saving

        if (editMapping) {
            if (invokeData.length > 0) {
                await Promise.all(
                    invokeData.map(async (newMapping) => {
                        const frameworkMapInstances = await getMyInstancesV2({
                            processName: "Framework Mapping",
                            predefinedFilters: { taskName: "Edit FrameworkMapping" },
                            mongoWhereClause: `this.Data.id == "${newMapping.id}"`,
                        });

                        if (frameworkMapInstances.length > 0) {
                            const taskId = frameworkMapInstances[0].taskId;

                            await invokeAction({
                                taskId: taskId,
                                data: newMapping,
                                transitionName: 'Update Edit FrameMap',
                                processInstanceIdentifierField: 'id',
                            });
                        } else {
                            console.warn(`No instance found for id: ${newMapping.id}`);
                        }
                    })
                );
            }
        }

        // if (editMapping) {
        // const frameworkMapInstances = await getMyInstancesV2({
        //     processName: "Framework Mapping",
        //     predefinedFilters: { taskName: "Edit FrameworkMapping" },
        //     mongoWhereClause: `this.Data.id == "${editMapping.id}"`,
        // });
        // const taskId = frameworkMapInstances[0].taskId;
        // await invokeAction({
        //     taskId: taskId,
        //     data: newMapping,
        //     transitionName: 'Update Edit FrameMap',
        //     processInstanceIdentifierField: 'id',
        // });
        // } else {
        //     const frameworkMappingProcessId = await mapProcessName({ processName: "Framework Mapping" });
        //     console.log(frameworkMappingProcessId);
        //     await startProcessV2({
        //         processId: frameworkMappingProcessId,
        //         data: newMapping,
        //         processIdentifierFields: "id",
        //     })

        // }

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[60%]">
                <DialogHeader>
                    <DialogTitle>
                        <div>
                            <h1 className="text-lg font-semibold">Map Frameworks</h1>
                            <p className="text-sm text-muted-foreground">
                                Select frameworks, control policies, and objectives to create mappings.
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}> {/* Pass the full form instance */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                {/* Framework Selection */}
                                <FormComboboxInput
                                    items={frameworkDetailsData.map((fw) => ({ value: fw.id, label: fw.name }))}
                                    formControl={form.control}
                                    name="framework1"
                                    placeholder="Select Framework 1"
                                    label="Source Framework 1*"
                                />
                                <FormComboboxInput
                                    items={frameworkDetailsData.map((fw) => ({ value: fw.id, label: fw.name }))}
                                    formControl={form.control}
                                    name="framework2"
                                    placeholder="Select Framework 2"
                                    label="Destination Framework 2*"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Control Policy Selection */}
                                <FormComboboxInput
                                    items={controlPolicies1}
                                    formControl={form.control}
                                    name="controlPolicy1"
                                    placeholder="Select Control Policy 1"
                                    label="Item 1*"
                                    disabled={!selectedFramework1}
                                />
                                <FormComboboxInput
                                    items={controlPolicies2}
                                    formControl={form.control}
                                    name="controlPolicy2"
                                    placeholder="Select Control Policy 2"
                                    label="Item 2*"
                                    disabled={!selectedFramework2}
                                />
                            </div>
                            <div className="grid grid-cols-1">
                                <Textarea placeholder="Add notes (optional)" {...form.register("notes")} />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save</Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}