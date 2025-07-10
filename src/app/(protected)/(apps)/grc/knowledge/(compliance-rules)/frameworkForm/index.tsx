'use client'
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
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

export const FrameworkFormSchema = z.object({
    FRAMEWORK_TITLE: z
        .string()
        .min(2, { message: 'Please enter framework type.' })
        .trim(),
    FRAMEWORK_TYPE: z
        .string()
        .min(2, { message: 'Please enter framework name.' })
        .trim(),
    FRAMEWORK_DESCRIPTION: z
        .string()
        .min(2, { message: 'Please enter description.' })
        .trim()
})

export const frameworkType = [
    { value: "bestPractice", label: "Best Practice" },
    { value: "standard", label: "Standard" },
    { value: "rulesAndRegulation", label: "Rules & Regulation" },
]

export const bestPractice = [
    { value: "NIST CSF", label: "NIST CSF" },
    { value: "COBIT 2019", label: "COBIT 2019" },
    { value: "COSO ERM", label: "COSO ERM" },
    { value: "HIPPA", label: "HIPPA" }
]

export const standard = [
    { value: "ISO 27001", label: "ISO 27001" },
    { value: "ISO 31000", label: "ISO 31000" },
    { value: "ISO 9001", label: "ISO 9001" },
    { value: "ISO 22301", label: "ISO 22301" }
]

export default function FrameworkForm({ open, setOpen, editFramework }:
    { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, editFramework: Record<string, string> | null }) {
    
    const router = useRouter();
    const form = useForm<z.infer<typeof FrameworkFormSchema>>({
        resolver: zodResolver(FrameworkFormSchema),
        defaultValues: {
            FRAMEWORK_TITLE: editFramework ? editFramework.frameworkTitle : '',
            FRAMEWORK_TYPE: editFramework ? editFramework.frameworkType : '',
            FRAMEWORK_DESCRIPTION: editFramework ? editFramework.frameworkDescription : '',
        },
    });

    const selectedFrameworkType = form.watch("FRAMEWORK_TYPE");

    async function saveframeworkInfo(data: z.infer<typeof FrameworkFormSchema>) {
        console.log(data);

        const frameworkData = {
            frameworkId: editFramework ? editFramework.frameworkId : v4(),
            frameworkAddTime: editFramework ? editFramework.frameworkAddTime : new Date().toISOString(),
            frameworkTitle: data.FRAMEWORK_TITLE,
            frameworkType: data.FRAMEWORK_TYPE,
            frameworkDescription: data.FRAMEWORK_DESCRIPTION,
        }

        if (editFramework) {
            const editframeworkId = editFramework.frameworkId;
            const frameworkInstances = await getMyInstancesV2<any>({
                processName: "Add Framework",
                predefinedFilters: { taskName: "view framework" },
                mongoWhereClause: `this.Data.frameworkId == "${editframeworkId}"`,
            })
            const taskId = frameworkInstances[0].taskId;

            await invokeAction({
                taskId: taskId,
                data: frameworkData,
                transitionName: 'update view framework',
                processInstanceIdentifierField: 'frameworkId, frameworkTitle'
            })
        }
        else {
            const frameworkInstances = await mapProcessName({ processName: "Add Framework" });
            await startProcessV2({processId: frameworkInstances, data: frameworkData, processIdentifierFields: 'frameworkId, frameworkTitle'})
        }

        setOpen(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-[40%]">
            <DialogHeader>
              <DialogTitle>Framework Form</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Form {...form}>
                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormComboboxInput items={frameworkType} formControl={form.control} name={"FRAMEWORK_TYPE"} placeholder={"Choose Framework Type"} label={"Framework Type"}/>
    
                    {/* Conditional Rendering of Framework Title */}
                    {selectedFrameworkType === "bestPractice" && (
                      <FormComboboxInput items={bestPractice} formControl={form.control} name={"FRAMEWORK_TITLE"} placeholder={"Choose Best Practice Title"} label={"Framework Title"}/>
                    )}
    
                    {selectedFrameworkType === "standard" && (
                      <FormComboboxInput items={standard} formControl={form.control} name={"FRAMEWORK_TITLE"} placeholder={"Choose Standard Title"} label={"Framework Title"}/>
                    )}
    
                    {selectedFrameworkType === "rulesAndRegulation" && (
                      <FormInput formControl={form.control} name={"FRAMEWORK_TITLE"} label={"Framework Title"} placeholder={"Enter Rules & Regulation Framework Title"}/>
                    )}
    
                    <div className="grow h-100 col-span-1 md:col-span-2">
                      <FormTextarea formControl={form.control} name={"FRAMEWORK_DESCRIPTION"} placeholder={"Description"} formItemClass="h-full" className="h-full"/>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={form.handleSubmit(saveframeworkInfo)}>
                {editFramework ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
}
