import React, { useMemo } from 'react'
import { Field } from './fieldConfigurationForm';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/shadcn/ui/form";
import { Button } from '@/shadcn/ui/button';
import { z, ZodTypeAny } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/shadcn/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Input } from '@/shadcn/ui/input';
import { RadioGroup, RadioGroupItem } from '@/shadcn/ui/radio-group';
import { Label } from '@/shadcn/ui/label';

const generateZodSchema = (fields: Field[]) => {
    const shape: Record<string, ZodTypeAny> = {};

    fields.forEach((field) => {
        if (field.type === "dropdown" && field.extraInfo) {
            const options = field.extraInfo.map((opt) => opt.value);
            shape[field.name] = z.enum([...options] as [string, ...string[]], {
                required_error: `${field.name} is required`
            });
        } else {
            shape[field.name] = z.string().min(1, `${field.name} is required`);
        }
    });
    shape.parentId = z.string().nullable().optional();
    shape.treatAsParent = z.boolean().optional();

    return z.object(shape);
};

export default function DynamicFieldForm({
    openDynamicForm,
    setOpenDynamicForm,
    fields,
    setData,
    parentEntries,
    setParentEntries
}: {
    openDynamicForm: boolean;
    setOpenDynamicForm: React.Dispatch<React.SetStateAction<boolean>>;
    fields: Field[];
    setData: React.Dispatch<React.SetStateAction<Record<string, string>[]>>;
    parentEntries: { value: string, label: string }[];
    setParentEntries: React.Dispatch<React.SetStateAction<{ value: string, label: string }[]>>;
}) {


    const formSchema = useMemo(() => generateZodSchema(fields), []);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: fields.reduce((acc, cur) => {
            acc[cur.name] = "";
            return acc;
        }, {
            parentId: null,
            treatAsParent: false,
        } as Record<string, string> & { parentId: string | null; treatAsParent: boolean; }
        )
    });
    function onSubmit(values: Record<string, string>) {
        console.log("Form submitted:", values);
        const id = crypto.randomUUID();
        setData((prev) => [...prev, { id: id, ...values }]);
        if(values.treatAsParent){
            setParentEntries((prev) => [...prev, { value: id, label: values[fields[0].name]}])
        }
        setOpenDynamicForm(false);
    }
    return (
        <>
            <Dialog open={openDynamicForm} onOpenChange={setOpenDynamicForm}>
                <DialogContent className="max-w-[50%] max-h-[50vh] p-6 pt-4 flex flex-col overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Field Configuration</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form className="space-y-2 p-4">
                            {fields.map((field) => (
                                <FormField
                                    key={field.name}
                                    control={form.control}
                                    name={field.name}
                                    render={({ field: controller }) => (
                                        <FormItem>
                                            <FormLabel>{field.name}</FormLabel>
                                            <FormControl>
                                                {field.type === "textarea" ? (
                                                    <Textarea {...controller} />
                                                ) : field.type === "dropdown" ? (
                                                    <Select
                                                        onValueChange={controller.onChange}
                                                        value={controller.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={`Select ${field.name}`} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {field.extraInfo?.map((opt) => (
                                                                <SelectItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <Input {...controller} />
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}

                            <FormField
                                control={form.control}
                                name="treatAsParent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Treat As Parent?</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={(value) => field.onChange(value === "true")}
                                                value={field.value === true ? "true" : "false"}
                                                className="flex flex-row gap-6 mt-2"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem id="treat-yes" value="true" />
                                                    <Label htmlFor="treat-yes" className="font-normal">
                                                        Yes
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem id="treat-no" value="false" />
                                                    <Label htmlFor="treat-no" className="font-normal">
                                                        No
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="parentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Parent Entry</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === "no-parent" ? null : value)}
                                            defaultValue={field.value || "no-parent"}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a parent entry (optional)" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="no-parent">No Parent</SelectItem>
                                                {parentEntries.map((entry) => (
                                                    <SelectItem key={entry.value} value={entry.value}>
                                                        {entry.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </form>
                    </Form>
                    <DialogFooter>
                        <Button onClick={form.handleSubmit(onSubmit)}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        </>
    )
}
