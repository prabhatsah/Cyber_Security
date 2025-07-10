import { BasicDettailsForm } from "../forms/basic-details-form"
import { Form } from "@/shadcn/ui/form"
import type { UseFormReturn } from "react-hook-form"

export function BasicDetailsTab({ form }: { form: UseFormReturn<any> }) {
    return (
        <Form {...form}>
            <BasicDettailsForm form={form} />
        </Form>
    )
}
