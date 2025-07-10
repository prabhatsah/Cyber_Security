import React, { useMemo } from 'react'
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
import { DynamicFieldConfigFormDataWithId, DynamicFieldFrameworkContext } from '../context/dynamicFieldFrameworkContext';

const generateZodSchema = (fields: DynamicFieldConfigFormDataWithId[]) => {
    const shape: Record<string, ZodTypeAny> = {};

    fields.forEach((field) => {
        if (field.type === "dropdown" && field.extraInfo) {
            const options = field.extraInfo.map((opt) => opt.value);
            // shape[field.id] = z.enum([...options] as [string, ...string[]], {
            //     required_error: `${field.name} is required`
            // });
            shape[field.id] = z.enum([...options] as [string, ...string[]]).optional();
        } else {
            // shape[field.id] = z.string().min(1, `${field.name} is required`);
            shape[field.id] = z.string().optional();
        }
    });
    shape.parentId = z.string().nullable().optional();
    shape.treatAsParent = z.boolean().optional();

    return z.object(shape);
};

export default function FrameworkStructureForm({
    openDynamicForm,
    setOpenDynamicForm,
    fields,
    data,
    setData,
    parentEntries,
    setParentEntries,
    updateRows,
    addRows
}: {
    openDynamicForm: boolean;
    setOpenDynamicForm: React.Dispatch<React.SetStateAction<boolean>>;
    fields: DynamicFieldConfigFormDataWithId[];
    data: Record<string, string>[];
    setData: React.Dispatch<React.SetStateAction<Record<string, string>[]>>;
    parentEntries: { value: string, label: string }[];
    setParentEntries: React.Dispatch<React.SetStateAction<{ value: string, label: string }[]>>;
    updateRows?: Record<string, string> | null;
    addRows?: Record<string, string> | null;
}) {
    const { frameworkFieldConfigData, identifier } = DynamicFieldFrameworkContext();
    const formSchema = useMemo(() => generateZodSchema(fields), []);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: fields.reduce((acc, cur) => {
            acc[cur.id] = updateRows?.[cur.id] ?? "";
            return acc;
        }, {
            parentId: updateRows?.parentId || addRows?.id || null,
            treatAsParent: updateRows?.treatAsParent ?? (addRows ? false : true),
        } as Record<string, string> & { parentId: string | null; treatAsParent: boolean; }
        )
    });
    function onSubmit(values: Record<string, string | boolean>) {
        const isUpdate = !!updateRows;
        const id = isUpdate ? updateRows.id : crypto.randomUUID();
        const newEntry = { id, ...values };

        setData((prev) => {
            if (isUpdate) {
                return prev.map((item) => (item.id === updateRows.id ? newEntry : item));
            } else {
                return [...prev, newEntry];
            }
        });

        if (!isUpdate && values.parentId) {
            setData((prev) =>
                prev.map((item) =>
                    item.id === values.parentId
                        ? { ...item, treatAsParent: true }
                        : item
                )
            );

            const parentRow = data.find((item) => item.id === values.parentId);
            if (parentRow) {
                setParentEntries((prev) => {
                    const alreadyExists = prev.some((entry) => entry.value === parentRow.id);
                    if (alreadyExists) return prev;

                    const identifierFieldConfig = frameworkFieldConfigData.find(
                        (data) => data.id === identifier.index
                    );
                    const identifierFieldName = identifierFieldConfig?.name;
                    const index = fields.findIndex(item => item.name === identifierFieldName);
                    const safeIndex = index === -1 ? 0 : index;
                    const label = parentRow[fields[safeIndex].id] as string;

                    return [...prev, { value: parentRow.id, label }];
                });
            }
        }


        if (values.treatAsParent) {
            setParentEntries((prev) => {
                const identifierFieldConfig = frameworkFieldConfigData.find(
                    (data) => data.id === identifier.index
                );
                const identifierFieldName = identifierFieldConfig?.name;
                const index = fields.findIndex(item => item.name === identifierFieldName);
                const safeIndex = index === -1 ? 0 : index;
                const label = values[fields[safeIndex].id] as string;
                if (isUpdate) {
                    const existing = prev.find((p) => p.value === id);
                    if (existing) {
                        return prev.map((p) =>
                            p.value === id ? { ...p, label } : p
                        );
                    } else {
                        return [...prev, { value: id, label }];
                    }
                } else {
                    return [...prev, { value: id, label }];
                }
            });
        } else if (isUpdate) {
            setParentEntries((prev) => prev.filter((p) => p.value !== id));
        }

        setOpenDynamicForm(false);
    }
    console.log(data);
    return (
        <>
            <Dialog open={openDynamicForm} onOpenChange={setOpenDynamicForm}>
                <DialogContent className="max-w-[40%] max-h-[60vh] p-6 pt-4 flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Field Configuration</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form className="space-y-2 p-4 overflow-y-auto flex-1">
                            {fields.map((field) => (
                                <FormField
                                    key={field.id}
                                    control={form.control}
                                    name={field.id}
                                    render={({ field: controller }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">
                                                {field.name}
                                                {/* <span className="text-red-500 font-bold"> *</span> */}
                                            </FormLabel>
                                            <FormControl>
                                                {field.type === "textarea" ? (
                                                    <Textarea {...controller} placeholder={field.description} />
                                                ) : field.type === "dropdown" ? (
                                                    <Select
                                                        onValueChange={controller.onChange}
                                                        value={controller.value}
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
                                                    <Input {...controller} placeholder={field.description} />
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
                                        <FormLabel>Treat As Category?</FormLabel>
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
                                        <FormLabel>Appears Under</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === "no-parent" ? null : value)}
                                            defaultValue={field.value || "no-parent"}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a parent entry (optional)" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="no-parent">No Parent</SelectItem>
                                                {parentEntries
                                                    .filter((entry) => !updateRows || entry.value !== updateRows.id)
                                                    .map((entry) => (
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



// import React, { useMemo } from 'react'
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
// import {
//     Form,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormControl,
//     FormMessage,
// } from "@/shadcn/ui/form";
// import { Button } from '@/shadcn/ui/button';
// import { z, ZodTypeAny } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Textarea } from '@/shadcn/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
// import { Input } from '@/shadcn/ui/input';
// import { RadioGroup, RadioGroupItem } from '@/shadcn/ui/radio-group';
// import { Label } from '@/shadcn/ui/label';
// import { DynamicFieldConfigFormDataWithId, DynamicFieldFrameworkContext } from '../context/dynamicFieldFrameworkContext';

// const generateZodSchema = (fields: DynamicFieldConfigFormDataWithId[]) => {
//     const shape: Record<string, ZodTypeAny> = {};

//     fields.forEach((field) => {
//         if (field.type === "dropdown" && field.extraInfo) {
//             const options = field.extraInfo.map((opt) => opt.value);
//             // shape[field.id] = z.enum([...options] as [string, ...string[]], {
//             //     required_error: `${field.name} is required`
//             // });
//             shape[field.id] = z.enum([...options] as [string, ...string[]]).optional();
//         } else {
//             // shape[field.id] = z.string().min(1, `${field.name} is required`);
//             shape[field.id] = z.string().optional();
//         }
//     });
//     shape.parentId = z.string().nullable().optional();
//     shape.treatAsParent = z.boolean().optional();

//     return z.object(shape);
// };

// export default function FrameworkStructureForm({
//     openDynamicForm,
//     setOpenDynamicForm,
//     fields,
//     setData,
//     parentEntries,
//     setParentEntries,
//     updateRows
// }: {
//     openDynamicForm: boolean;
//     setOpenDynamicForm: React.Dispatch<React.SetStateAction<boolean>>;
//     fields: DynamicFieldConfigFormDataWithId[];
//     setData: React.Dispatch<React.SetStateAction<Record<string, string>[]>>;
//     parentEntries: { value: string, label: string }[];
//     setParentEntries: React.Dispatch<React.SetStateAction<{ value: string, label: string }[]>>;
//     updateRows?: Record<string, string> | null;
// }) {
//     const { frameworkFieldConfigData, identifier } = DynamicFieldFrameworkContext();
//     const formSchema = useMemo(() => generateZodSchema(fields), []);
//     const form = useForm({
//         resolver: zodResolver(formSchema),
//         defaultValues: fields.reduce((acc, cur) => {
//             acc[cur.id] = updateRows?.[cur.id] ?? "";
//             return acc;
//         }, {
//             parentId: updateRows?.parentId ?? null,
//             treatAsParent: updateRows?.treatAsParent ?? false,
//         } as Record<string, string> & { parentId: string | null; treatAsParent: boolean; }
//         )
//     });
//     function onSubmit(values: Record<string, string | boolean>) {
//         const isUpdate = !!updateRows;
//         const id = isUpdate ? updateRows.id : crypto.randomUUID();
//         const newEntry = { id, ...values };

//         setData((prev) => {
//             if (isUpdate) {
//                 return prev.map((item) => (item.id === updateRows.id ? newEntry : item));
//             } else {
//                 return [...prev, newEntry];
//             }
//         });

//         if (values.treatAsParent) {
//             setParentEntries((prev) => {
//                 const identifierFieldConfig = frameworkFieldConfigData.find(
//                     (data) => data.id === identifier.index
//                 );
//                 const identifierFieldName = identifierFieldConfig?.name;
//                 const index = fields.findIndex(item => item.name === identifierFieldName);
//                 const safeIndex = index === -1 ? 0 : index;
//                 const label = values[fields[safeIndex].id] as string;
//                 if (isUpdate) { 
//                     const existing = prev.find((p) => p.value === id);
//                     if (existing) {
//                         return prev.map((p) =>
//                             p.value === id ? { ...p, label } : p
//                         );
//                     } else {
//                         return [...prev, { value: id, label }];
//                     }
//                 } else {
//                     return [...prev, { value: id, label }];
//                 }
//             });
//         } else if (isUpdate) {
//             setParentEntries((prev) => prev.filter((p) => p.value !== id));
//         }

//         setOpenDynamicForm(false);
//     }
//     return (
//         <>
//             <Dialog open={openDynamicForm} onOpenChange={setOpenDynamicForm}>
//                 <DialogContent className="max-w-[40%] max-h-[60vh] p-6 pt-4 flex flex-col">
//                     <DialogHeader>
//                         <DialogTitle>Field Configuration</DialogTitle>
//                     </DialogHeader>
//                     <Form {...form}>
//                         <form className="space-y-2 p-4 overflow-y-auto flex-1">
//                             {fields.map((field) => (
//                                 <FormField
//                                     key={field.id}
//                                     control={form.control}
//                                     name={field.id}
//                                     render={({ field: controller }) => (
//                                         <FormItem>
//                                             <FormLabel>
//                                                 {field.name}
//                                                 <span className="text-red-500 font-bold"> *</span>
//                                             </FormLabel>
//                                             <FormControl>
//                                                 {field.type === "textarea" ? (
//                                                     <Textarea {...controller} placeholder={field.description} />
//                                                 ) : field.type === "dropdown" ? (
//                                                     <Select
//                                                         onValueChange={controller.onChange}
//                                                         value={controller.value}
//                                                     >
//                                                         <SelectTrigger className="w-full">
//                                                             <SelectValue placeholder={`Select ${field.name}`} />
//                                                         </SelectTrigger>
//                                                         <SelectContent>
//                                                             {field.extraInfo?.map((opt) => (
//                                                                 <SelectItem key={opt.value} value={opt.value}>
//                                                                     {opt.label}
//                                                                 </SelectItem>
//                                                             ))}
//                                                         </SelectContent>
//                                                     </Select>
//                                                 ) : (
//                                                     <Input {...controller} placeholder={field.description} />
//                                                 )}
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             ))}

//                             <FormField
//                                 control={form.control}
//                                 name="treatAsParent"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Treat As Category?</FormLabel>
//                                         <FormControl>
//                                             <RadioGroup
//                                                 onValueChange={(value) => field.onChange(value === "true")}
//                                                 value={field.value === true ? "true" : "false"}
//                                                 className="flex flex-row gap-6 mt-2"
//                                             >
//                                                 <div className="flex items-center space-x-2">
//                                                     <RadioGroupItem id="treat-yes" value="true" />
//                                                     <Label htmlFor="treat-yes" className="font-normal">
//                                                         Yes
//                                                     </Label>
//                                                 </div>
//                                                 <div className="flex items-center space-x-2">
//                                                     <RadioGroupItem id="treat-no" value="false" />
//                                                     <Label htmlFor="treat-no" className="font-normal">
//                                                         No
//                                                     </Label>
//                                                 </div>
//                                             </RadioGroup>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="parentId"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Appears Under</FormLabel>
//                                         <Select
//                                             onValueChange={(value) => field.onChange(value === "no-parent" ? null : value)}
//                                             defaultValue={field.value || "no-parent"}
//                                         >
//                                             <FormControl>
//                                                 <SelectTrigger className="w-full">
//                                                     <SelectValue placeholder="Select a parent entry (optional)" />
//                                                 </SelectTrigger>
//                                             </FormControl>
//                                             <SelectContent>
//                                                 <SelectItem value="no-parent">No Parent</SelectItem>
//                                                 {parentEntries
//                                                     .filter((entry) => !updateRows || entry.value !== updateRows.id)
//                                                     .map((entry) => (
//                                                         <SelectItem key={entry.value} value={entry.value}>
//                                                             {entry.label}
//                                                         </SelectItem>
//                                                     ))}
//                                             </SelectContent>
//                                         </Select>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                         </form>
//                     </Form>
//                     <DialogFooter>
//                         <Button onClick={form.handleSubmit(onSubmit)}>Save changes</Button>
//                     </DialogFooter>
//                 </DialogContent>

//             </Dialog>
//         </>
//     )
// }
