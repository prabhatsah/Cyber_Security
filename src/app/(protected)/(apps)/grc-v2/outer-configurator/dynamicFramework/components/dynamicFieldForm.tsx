import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/ui/dialog";
import { Button } from '@/shadcn/ui/button';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import { DynamicFieldConfigFormData, DynamicFieldConfigFormDataWithId, DynamicFieldFrameworkContext, dynamicFieldschema } from '../context/dynamicFieldFrameworkContext';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shadcn/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/ui/select";
import { Input } from "@/shadcn/ui/input";
import { Plus, Trash } from 'lucide-react';
import { Textarea } from '@/shadcn/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';


export default function DynamicFieldForm(
    {
        openDynamicFieldForm,
        setOpenDynamicFormField,
        updateRow
    }: {
        openDynamicFieldForm: boolean;
        setOpenDynamicFormField: React.Dispatch<React.SetStateAction<boolean>>;
        updateRow?: DynamicFieldConfigFormDataWithId | null;
    }
) {

    const { setFrameworkFieldConfigData } = DynamicFieldFrameworkContext();

    const form = useForm<DynamicFieldConfigFormData>({
        resolver: zodResolver(dynamicFieldschema),
        defaultValues: {
            name: updateRow?.name || '',
            type: updateRow?.type || 'text',
            description: updateRow?.description || '',
            extraInfo: updateRow?.extraInfo || [],
        },
    })

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = form

    const type = watch('type')
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'extraInfo',
    })

    const onSubmit = (data: DynamicFieldConfigFormData) => {

        if (updateRow) {
            setFrameworkFieldConfigData((prev) =>
                prev.map((item) =>
                    item.id === updateRow.id
                        ? { ...data, id: updateRow.id }
                        : item
                )
            );
        } else {
            setFrameworkFieldConfigData((prev) => [...prev, { ...data, id: `FormField${crypto.randomUUID()}` }]);
        }

        form.reset();
        setOpenDynamicFormField(false);
    }

    return (
        <>
            <Dialog open={openDynamicFieldForm} onOpenChange={setOpenDynamicFormField}>
                <DialogContent className="!max-w-none w-[30vw] h-[60vh] p-6 pt-4 flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Field Configurator</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                            {/* Scrollable form fields */}
                            <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                                {/* Name */}
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Name
                                                <span className="text-red-500 font-bold"> *</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Enter name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Placeholder
                                                <span className="text-red-500 font-bold"> *</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Provide a description of the field..."
                                                    className="min-h-[50px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Type + Add Button */}
                                <FormField
                                    control={control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Type
                                                <span className="text-red-500 font-bold"> *</span>
                                            </FormLabel>
                                            <div className="flex items-center gap-2">
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="text">Text</SelectItem>
                                                        <SelectItem value="textarea">Textarea</SelectItem>
                                                        <SelectItem value="dropdown">Dropdown</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                {type === 'dropdown' && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => append({ label: '', value: crypto.randomUUID() })}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Dropdown Options */}
                                {type === 'dropdown' && fields.length > 0 ? (
                                    <div className="space-y-3 border p-4 rounded-md bg-muted max-h-40 overflow-y-auto">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex gap-2 items-end">
                                                <FormField
                                                    control={control}
                                                    name={`extraInfo.${index}.label`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormLabel>
                                                                Label
                                                                <span className="text-red-500 font-bold"> *</span>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="Label" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* <FormField
                                                    control={control}
                                                    name={`extraInfo.${index}.value`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormLabel>
                                                                Value
                                                                <span className="text-red-500 font-bold"> *</span>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="Value" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                /> */}

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) :
                                    <div className="space-y-4 border p-4 rounded-md bg-muted min-h-40 flex flex-row justify-center items-center">
                                        Select DropDown and Press Plus to add extra Information
                                    </div>
                                }
                            </div>

                            {/* Fixed Submit Button */}
                            <DialogFooter className="pt-4">
                                <Button type="submit" className="ml-auto">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

        </>
    )
}
