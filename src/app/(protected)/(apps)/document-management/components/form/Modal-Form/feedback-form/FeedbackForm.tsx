"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formData } from "./questions";
import { Form } from "@/components/ui/form";
import { TextareaFormField } from "@/components/ikon-components/form-components/TextareaFormField";
import { RadioFormField } from "@/components/ikon-components/form-components/RadioFormField";
import { CheckboxFormField } from "@/components/ikon-components/form-components/CheckboxFormField";
import { FeedbackFormProps, FormField } from "./types";
import { toast } from "sonner";
import { useAppSelector } from '@/store/store';
import { useAppDispatch } from "@/store/store";
import { clearOverallFeedback } from "@/store/redux/slices/overallFeedbackSlice";

const createFormSchema = (formData: FormField[]) => {
    const schema: Record<string, any> = {};
    formData.forEach((field: any) => {
        switch (field.type) {
            case "radio":
                schema[field.name] = z.enum(field.options).optional();
                break;
            case "checkbox":
                schema[field.name] = z.array(z.string()).optional().refine((value) => value === undefined || value.some((item) => item), {
                    message: "You have to select at least one item.",
                });
                break;
            default:
                schema[field.name] = z.string().optional();
        }
    });
    return z.object(schema);
};

export default function FeedbackForm({ showCheckbox, onConfirmLogout }: FeedbackFormProps) {

    // Retrieve the selected emoji and feedback using the selector
    const selectedFeedback = useAppSelector((state) => state.overallFeedback);
    const selectedEmoji = selectedFeedback.selectedEmoji;

    const dispatch = useAppDispatch();

    // Generate the dynamic schema
    const FormSchema = createFormSchema(formData);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (!selectedEmoji) {
            // alert("Please Select Overall rating");
            toast.error("Please Select Overall rating");
            return;
        }
        const updatedData = {
            ...data,
            overallRating: selectedEmoji,
        };
        toast.success("Your feedback has been submitted successfully");
        onConfirmLogout();
        // dispatch(clearOverallFeedback());
        // alert(JSON.stringify(updatedData, null, 2));
        // window.location.reload();
    }

    return (
        <Form {...form}>
            <form id="feedBackForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <TextareaFormField
                    key={formData[0].name}
                    field={formData[0]}
                />
                {showCheckbox && formData.map((field) => {
                    switch (field.type) {
                        case "radio":
                            return (
                                <RadioFormField
                                    key={field.name}
                                    field={field}
                                />
                            );
                        case "checkbox":
                            return (
                                <CheckboxFormField
                                    key={field.name}
                                    field={field}
                                />
                            );
                        default:
                            return null;
                    }
                })}
            </form>
        </Form>
    );
}
