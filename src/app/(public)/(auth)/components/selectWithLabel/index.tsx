import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";



type Props<S> = {
    fieldTitle: string,
    nameInSchema: keyof S & string,
    data: Record<string, string>[]; // Data as an array of objects with dynamic keys
    idField: string; // Field name for the `id`
    descriptionField: string; // Field name for the `description`
    className?: string,
    placeholder: string,
}

export function SelectWithLabel<S>({
    fieldTitle, nameInSchema, data, idField, descriptionField, className, placeholder
}: Props<S>) {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem>
                    <FormLabel
                        className="text-base"
                        htmlFor={nameInSchema}
                    >
                        {fieldTitle}
                    </FormLabel>
                    <Select {...field }onValueChange={field.onChange}>
                        <FormControl>
                            <SelectTrigger
                                id={nameInSchema}
                                className={`w-full ${className}`}
                            >
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {data.map(item => (
                                <SelectItem
                                    key={`${nameInSchema}_${item[idField]}`}
                                    value={item[idField]}
                                >
                                    {item[descriptionField]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
