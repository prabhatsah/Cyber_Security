import Icon from '../icon'
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shadcn/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/ui/select"
import { Card, CardContent } from "@/shadcn/ui/card"

interface SelectFormFieldProps {
    key?: string;
    form: any; // Replace `any` with the appropriate type for your form object
    name: string;
    label: string;
    placeholder?: string;
    iconName?: string;
    selectConfig?: {
        label: string;
        value: string;
    }[];
    setSelectedState?: (value: string) => void;
    viewMode?: boolean;
    required?: boolean;
}
import { cn } from "@/shadcn/lib/utils";
import { useEffect, useState } from "react";

export default function SelectFormField(InputFormFieldProps: SelectFormFieldProps) {
    const { form, name, label, placeholder, iconName, selectConfig, setSelectedState, viewMode, required } = InputFormFieldProps;
    const selectedValue = form.watch(name);
    const [isFocused, setIsFocused] = useState(false);
    // console.log("selectConfig", selectConfig)
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Card className="w-full">
                            <CardContent className="p-3 flex items-center gap-2 border rounded-md">
                                <div className="p-2 border-r flex items-center">
                                    {/* Replace Icon component if needed */}
                                    <Icon name={iconName} className="w-5 h-5 text-gray-500" />
                                </div>
                                <div className="flex-1 relative">
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);         // Update form value
                                            setSelectedState?.(value);     // Also update parent state if setter exists
                                        }}
                                        defaultValue={field.value}
                                        onOpenChange={(open) => setIsFocused(open)}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                disabled={viewMode}
                                                className="peer border-none shadow-none focus:ring-0 focus:ring-offset-0"
                                            >
                                                <SelectValue placeholder="please select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        {/* <SelectContent>{
                                            selectConfig?.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent> */}
                                        <SelectContent>
                                            {selectConfig
                                                ?.filter((item) => item.value !== "") // filter out invalid entries
                                                .map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>

                                    <label
                                        htmlFor={name}
                                        className={cn(
                                            "absolute left-2 transition-all pointer-events-none text-xs -top-2 text-gray-600",
                                            // (isFocused || selectedValue)
                                            //     ? "text-xs -top-2 text-gray-600"
                                            //     : "text-base top-2.5 text-gray-400"
                                        )}
                                    >
                                        {label}
                                        {required && <span className="text-red-500 ml-0.5">*</span>}
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

    )
}