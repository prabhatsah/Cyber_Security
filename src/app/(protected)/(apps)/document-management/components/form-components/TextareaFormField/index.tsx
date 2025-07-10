import { FormField, FormItem, FormLabel, FormControl } from "@/shadcn/ui/form";
import { Textarea } from "@/shadcn/ui/textarea";
import { TextareaFormFieldProps } from "../types";

export const TextareaFormField: React.FC<TextareaFormFieldProps> = ({ field }) => {
    return (
        <FormField
            name={field.name}
            render={({ field: textareaField }) => (
                <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={field.placeholder}
                            className="h-32 mt-5 resize-none"
                            {...textareaField}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    );
};
