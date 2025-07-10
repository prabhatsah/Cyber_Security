import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { InputFormFieldProps } from "../types";

export const InputFormField: React.FC<InputFormFieldProps> = ({ field }) => {
    return (
        // <FormField
        //     name={field.name}
        //     render={({ field: textareaField }) => (
        //         <FormItem>
        //             <FormLabel></FormLabel>
        //             <FormControl>
        //                 <Textarea
        //                     placeholder={field.placeholder}
        //                     className="h-32 mt-5"
        //                     {...textareaField}
        //                 />
        //             </FormControl>
        //         </FormItem>
        //     )}
        // />
        <FormField
            name={field.name}
            render={({ field: formField }) => ( // Correct aliasing to avoid conflicts
                <FormItem>
                    <FormLabel>{field.label || ""}</FormLabel>{ /*Add a label dynamically*/}
                    <FormControl>
                        <Input
                            placeholder={field.placeholder}
                            {...formField} // Use the `formField` prop for proper field registration
                        />
                    </FormControl>
                    {/* Uncomment these if necessary */}
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage /> {/* Displays validation errors */}
                </FormItem>
            )}
        />

    );
};
