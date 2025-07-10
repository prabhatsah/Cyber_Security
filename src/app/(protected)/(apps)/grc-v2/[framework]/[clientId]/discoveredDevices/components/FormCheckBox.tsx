import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shadcn/ui/form';
import { Checkbox } from '@/shadcn/ui/checkbox';
import React from 'react';
import { useController } from 'react-hook-form';

interface FormCheckboxProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formControl: any;
    name: string;
    label?: string;
    value: string;  // Unique identifier for each checkbox
    onChange?:Function
}

export default function FormCheckbox({
    formControl,
    name,
    label,
    value,
    onChange,
    ...props
}: FormCheckboxProps) {
    const { field } = useController({
        control: formControl,
        name,
        defaultValue: [], // Ensure array format for checkbox selections
    });

    const isChecked = Array.isArray(field.value) && field.value.includes(value);

    console.log('Checkbox Value:', value);
    console.log('Field Value:', field.value);
    console.log('Is Checked:', isChecked);

    return (
        <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
                <Checkbox className='h-[1.2rem] bg-white'
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                        const updatedValues = checked
                            ? [...field.value, value]  // Add if checked
                            : field.value.filter((v: string) => v !== value); // Remove if unchecked

                        field.onChange(updatedValues);
                    }}
                    {...props}
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}
