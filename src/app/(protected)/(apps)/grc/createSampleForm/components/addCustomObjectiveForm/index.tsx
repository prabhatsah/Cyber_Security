import FormComboboxInput from '@/ikon/components/form-fields/combobox-input'
import FormInput from '@/ikon/components/form-fields/input'
import { Button } from '@/shadcn/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { Form } from '@/shadcn/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'


const newCustomPolicySchema = z.object({
    FRAMEWORK: z
        .string()
        .min(2, { message: 'Please Enter Framework' })
        .trim(),
    FRAMEWORK_NAME: z
        .string()
        .min(2, { message: 'Please Enter Framework Name' })
        .trim(),
    INDEX: z
        .string()
        .min(2, { message: 'Please Enter Index' })
        .trim(),
    CONTROL_NAME: z
        .string()
        .min(2, { message: 'Please Enter Control Name' })
        .trim(),
    OBJECTIVE_NAME: z
        .string()
        .min(2, { message: 'Please Enter Objective Name' })
        .trim(),
    OBJECTIVE_TYPE: z
        .string()
        .min(2, { message: 'Please Select Objective Type' })
        .trim(),

})

export const objectiveType = [
    { value: "Managerial", label: "Managerial" },
    { value: "Technical", label: "Technical" },
    { value: "Operational", label: "Operational" },
]


export default function AddCustomObjectiveForm({ open, setOpen }: any) {

    const form = useForm<z.infer<typeof newCustomPolicySchema>>({
        resolver: zodResolver(newCustomPolicySchema),
        defaultValues: {
            FRAMEWORK: '',
            FRAMEWORK_NAME: '',
            INDEX: '',
            CONTROL_NAME: '',
            OBJECTIVE_NAME: '',
            OBJECTIVE_TYPE: ''
        }
    })
    async function onSubmit(data: z.infer<typeof newCustomPolicySchema>) {
        console.log(data)
    }
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>

                <DialogContent className="max-w-[60%]">
                    <DialogHeader>
                        <DialogTitle>Add Control Objective</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form className="space-y-6">
                            <div className='flex flex-col gap-3'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <FormInput formControl={form.control} name={"FRAMEWORK"} label={"Framework"} placeholder={"Enter Framework"} />
                                    <FormInput formControl={form.control} name={"FRAMEWORK_NAME"} label={"Framework Name"} placeholder={"Enter Framewor Name"} />
                                    <FormInput formControl={form.control} name={"INDEX"} label={"Index"} placeholder={"Enter Control Index"} />
                                    <FormInput formControl={form.control} name={"CONTROL_NAME"} label={"Control Name"} placeholder={"Enter Control Name"} />
                                    <FormInput formControl={form.control} name={"OBJECTIVE_NAME"} label={"Objective Name"} placeholder={"Enter Objective Name"} />
                                    <FormComboboxInput items={objectiveType} formControl={form.control} name={"OBJECTIVE_TYPE"} placeholder={"Choose Objective Tyoe"} label={"Objective Type"} />
                                </div>
                            </div>
                        </form>
                    </Form>
                    <DialogFooter>
                        <Button type="submit" onClick={form.handleSubmit(onSubmit)} className='mt-3'>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
