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
    objective1: z.string().nonempty({ message: "Control Objective 1 is required." }),
    framework2: z.string().nonempty({ message: "Framework 2 is required." }),
    controlPolicy2: z.string().nonempty({ message: "Control Policy 2 is required." }),
    objective2: z.string().nonempty({ message: "Control Objective 2 is required." }),
    notes: z.string().optional(),
});
export default function MultipleFrameworkMappingForm({
    frameworksData,
    onSave,
    editMapping,
    closeForm,
}: {
    frameworksData: Record<string, any>[]; // List of frameworks
    onSave: (data: Record<string, any>) => void;
    editMapping: Record<string, string> | null;
    closeForm: (open: boolean) => void;
}) {
    const form = useForm<z.infer<typeof FrameworkMappingSchema>>({
        resolver: zodResolver(FrameworkMappingSchema),
        defaultValues: {
            //framework1: editMapping?.framework1 || "",
            controlPolicy1: editMapping?.controlPolicy1 || "",
            objective1: editMapping?.objective1 || "",
            framework2: editMapping?.framework2 || "",
            controlPolicy2: editMapping?.controlPolicy2 || "",
            objective2: editMapping?.objective2 || "",
            notes: editMapping?.notes || "",
        },
    });

    const { handleSubmit, setValue, watch } = form;
    const [controlPolicies1, setControlPolicies1] = useState<Record<string, any>[]>([]);
    const [controlPolicies2, setControlPolicies2] = useState<Record<string, any>[]>([]);
    const [controlObjectives1, setControlObjectives1] = useState<Record<string, any>[]>([]);
    const [controlObjectives2, setControlObjectives2] = useState<Record<string, any>[]>([]);
    const [frameworkId1, setFrameworkId1] = useState('');
    const [frameworkId2, setFrameworkId2] = useState('');

    const selectedFramework1 = watch("framework1");
    const selectedFramework2 = watch("framework2");
    const selectedControlPolicy1 = watch("controlPolicy1");
    const selectedControlPolicy2 = watch("controlPolicy2");

    // Populate control policies and objectives based on editMapping during initialization
    useEffect(() => {
        if (editMapping?.framework1) {
            const framework = frameworksData.find((fw) => fw.policyName === editMapping.framework1);
            setControlPolicies1(framework ? framework.controls : []);
        }

        if (editMapping?.framework2) {
            const framework = frameworksData.find((fw) => fw.policyName === editMapping.framework2);
            setControlPolicies2(framework ? framework.controls : []);
        }
    }, [editMapping, frameworksData]);

    useEffect(() => {
        if (editMapping?.controlPolicy1) {
            const policy = controlPolicies1.find((cp) => cp.controlName === editMapping.controlPolicy1);
            setControlObjectives1(policy ? policy.controlObjectives : []);
        }

        if (editMapping?.controlPolicy2) {
            const policy = controlPolicies2.find((cp) => cp.controlName === editMapping.controlPolicy2);
            setControlObjectives2(policy ? policy.controlObjectives : []);
        }
    }, [editMapping, controlPolicies1, controlPolicies2]);

    // Dynamically update control policies based on framework selection
    useEffect(() => {
        if (selectedFramework1) {
            const framework = frameworksData.find((fw) => fw.policyName === selectedFramework1);
            setFrameworkId1(framework ? framework.frameworkId : '')
            setControlPolicies1(framework ? framework.controls : []);
        }
    }, [selectedFramework1, frameworksData]);

    useEffect(() => {
        if (selectedFramework2) {
            const framework = frameworksData.find((fw) => fw.policyName === selectedFramework2);
            setFrameworkId2(framework ? framework.frameworkId : '')
            setControlPolicies2(framework ? framework.controls : []);
        }
    }, [selectedFramework2, frameworksData]);

    // Dynamically update control objectives based on control policy selection
    useEffect(() => {
        if (selectedControlPolicy1) {
            const policy = controlPolicies1.find((cp) => cp.controlName === selectedControlPolicy1);
            setControlObjectives1(policy ? policy.controlObjectives : []);
        }
    }, [selectedControlPolicy1, controlPolicies1]);

    useEffect(() => {
        if (selectedControlPolicy2) {
            const policy = controlPolicies2.find((cp) => cp.controlName === selectedControlPolicy2);
            setControlObjectives2(policy ? policy.controlObjectives : []);
        }
    }, [selectedControlPolicy2, controlPolicies2]);

    const onSubmit = async (data: z.infer<typeof FrameworkMappingSchema>) => {
        const newMapping = {
            id: editMapping?.id || v4(),
            frameworkId1: frameworkId1,
            frameworkId2: frameworkId2,
            // mapData:[
            //     {

            //     }
            // ]
            ...data,
        };

        console.log("New Mapping Data: from create framewrokkkkkk  ======>>>>>>>   ", newMapping); // Log the new mapping object

        onSave(newMapping); // Pass the new mapping object to the parent

        // if (editMapping) {
        //     const frameworkMapInstances = await getMyInstancesV2({
        //         processName: "Framework Mapping",
        //         predefinedFilters: { taskName: "Edit FrameworkMapping" },
        //         mongoWhereClause: `this.Data.id == "${editMapping.id}"`,
        //     });
        //     const taskId = frameworkMapInstances[0].taskId;
        //     await invokeAction({
        //         taskId: taskId,
        //         data: newMapping,
        //         transitionName: 'Update Edit FrameMap',
        //         processInstanceIdentifierField: 'id',
        //     });
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

    function setOpen(open: boolean) {
        closeForm(open);
    }

    return (
        <Form {...form}> {/* Pass the full form instance */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        {/* Framework Selection */}
                        <FormComboboxInput
                            items={frameworksData.map((fw) => ({ value: fw.policyName, label: fw.policyName }))}
                            formControl={form.control}
                            name="framework1"
                            placeholder="Select Framework 1"
                            label="Framework 1*"
                        />
                        <FormComboboxInput
                            items={frameworksData.map((fw) => ({ value: fw.policyName, label: fw.policyName }))}
                            formControl={form.control}
                            name="framework2"
                            placeholder="Select Framework 2"
                            label="Framework 2*"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Control Policy Selection */}
                        <FormComboboxInput
                            items={controlPolicies1.map((cp) => ({ value: cp.controlName, label: cp.controlName }))}
                            formControl={form.control}
                            name="controlPolicy1"
                            placeholder="Select Control Policy 1"
                            label="Control Policy 1*"
                            disabled={!selectedFramework1}
                        />
                        <FormComboboxInput
                            items={controlPolicies2.map((cp) => ({ value: cp.controlName, label: cp.controlName }))}
                            formControl={form.control}
                            name="controlPolicy2"
                            placeholder="Select Control Policy 2"
                            label="Control Policy 2*"
                            disabled={!selectedFramework2}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Control Objective Selection */}
                        <FormComboboxInput
                            items={controlObjectives1.map((obj) => ({ value: obj.name, label: obj.name }))}
                            formControl={form.control}
                            name="objective1"
                            placeholder="Select Control Objective 1"
                            label="Control Objective 1*"
                            disabled={!selectedControlPolicy1}
                        />
                        <FormComboboxInput
                            items={controlObjectives2.map((obj) => ({ value: obj.name, label: obj.name }))}
                            formControl={form.control}
                            name="objective2"
                            placeholder="Select Control Objective 2"
                            label="Control Objective 2*"
                            disabled={!selectedControlPolicy2}
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