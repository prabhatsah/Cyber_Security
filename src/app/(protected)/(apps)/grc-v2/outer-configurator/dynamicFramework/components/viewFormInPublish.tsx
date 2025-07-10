import React, { useMemo } from 'react'
import { DynamicFieldConfigFormDataWithId } from '../context/dynamicFieldFrameworkContext';
import { z, ZodTypeAny } from 'zod';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/shadcn/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Input } from '@/shadcn/ui/input';

const generateZodSchema = (fields: DynamicFieldConfigFormDataWithId[]) => {
    const shape: Record<string, ZodTypeAny> = {};

    fields.forEach((field) => {
        if (field.type === "dropdown" && field.extraInfo) {
            const options = field.extraInfo.map((opt) => opt.value);
            // shape[field.id] = z.enum([...options] as [string, ...string[]], {
            //     required_error: `${field.name} is required`
            // });
            shape[field.name] = z.enum([...options] as [string, ...string[]]).optional();
        } else {
            // shape[field.id] = z.string().min(1, `${field.name} is required`);
            shape[field.name] = z.string().optional();
        }
    });

    return z.object(shape);
};

export default function ViewFormInPublish({
    openViewPublishForm,
    setOpenViewPublishForm,
    frameworkFieldConfigData,
    updateRows
}: {
    openViewPublishForm: boolean;
    setOpenViewPublishForm: React.Dispatch<React.SetStateAction<boolean>>;
    frameworkFieldConfigData: DynamicFieldConfigFormDataWithId[];
    updateRows?: Record<string, string> | null;
}) {

    const formSchema = useMemo(() => generateZodSchema(frameworkFieldConfigData), []);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: frameworkFieldConfigData.reduce((acc, cur) => {
            acc[cur.name] = updateRows?.[cur.name] ?? "";
            return acc;
        }, {} as Record<string, string>
        )
    });

    return (
        <>
            <Dialog open={openViewPublishForm} onOpenChange={setOpenViewPublishForm}>
                <DialogContent className="max-w-[50%] max-h-[80vh] p-6 pt-4 flex flex-col">
                    <DialogHeader>
                        <DialogTitle>View Details</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form className="space-y-2 p-4 overflow-y-auto flex-1">
                            {frameworkFieldConfigData.map((field) => (
                                <FormField
                                    key={field.id}
                                    control={form.control}
                                    name={field.name}
                                    render={({ field: controller }) => (
                                        <FormItem>
                                            <FormLabel className='capitalize'>
                                                {field.name}
                                                <span className="text-red-500 font-bold"> *</span>
                                            </FormLabel>
                                            <FormControl>
                                                {field.type === "textarea" ? (
                                                    <Textarea {...controller} placeholder={field.description} disabled className='h-20 '/>
                                                ) : field.type === "dropdown" ? (
                                                    <Select
                                                        onValueChange={controller.onChange}
                                                        value={controller.value}
                                                        disabled
                                                    >
                                                        <SelectTrigger className="w-full">
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
                                                    <Input {...controller} placeholder={field.description} disabled />
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}



                        </form>
                    </Form>
                    <DialogFooter>
                        <Button onClick={()=>{setOpenViewPublishForm(false)}}>Close</Button>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        </>
    )
}
