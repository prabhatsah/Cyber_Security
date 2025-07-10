import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Form } from '@/shadcn/ui/form';
import FormInput from '@/ikon/components/form-fields/input';
import { Button } from '@/shadcn/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
import { getMyInstancesV2, invokeAction } from '@/ikon/utils/api/processRuntimeService';
import { v4 } from 'uuid';

export const SubCategoryFormSchema = z.object({
    SUB_CATEGORY_NAME: z
        .string()
        .min(2, { message: 'Sub Category Name must be at least 2 characters long.' })
        .trim(),
    CATEGORY_NAME: z
        .string()
        .min(1, { message: 'Category Name must be selected.' })
        .trim(),
})

export default function SubCategoryForm({ open, setOpen, categoryDataDropdown, editRow }: any) {

    async function saveCategoryInfo(data: z.infer<typeof SubCategoryFormSchema>) {
        console.log(data);

        const vendorCategoryInstance = await getMyInstancesV2({
            processName: "Vendor Category",
            predefinedFilters: { taskName: "Edit Asset Configuration" },
        })


        if (vendorCategoryInstance.length) {
            const vendorCategoryData: { assetData: Record<string, string>[], categoryData: Record<string, string>, currentData: Record<string, string>[] } = vendorCategoryInstance[0]?.data
            const { assetData, categoryData, currentData } = vendorCategoryData

            var categoryId = data.CATEGORY_NAME

            var assetObjData = {
                "id": editRow ? editRow.id : v4(),
                "categoryId": categoryId,
                "subcategory": data.SUB_CATEGORY_NAME,
                "category": categoryData[categoryId]
            }
            const currentAssetData = [assetObjData];

            // assetData.push(assetObjData);

            if (editRow) {
                // Find index of the existing row
                const index = assetData.findIndex(item => item.id === editRow.id);
                console.log(index);
                if (index !== -1) {
                    assetData[index] = assetObjData;
                }
            } else {
                assetData.push(assetObjData);
            }

            const extractData = {
                "assetData": assetData,
                "categoryData": categoryData,
                "currentData": currentAssetData
            }
            const taskId = vendorCategoryInstance[0]?.taskId;

            console.log(extractData);
            console.log(taskId);

            await invokeAction({
                taskId: taskId,
                transitionName: "Update Edit Asset Configuration",
                data: extractData,
                processInstanceIdentifierField: ""
            })

            setOpen(false);
        }
    }

    const form = useForm<z.infer<typeof SubCategoryFormSchema>>({
        resolver: zodResolver(SubCategoryFormSchema),
        defaultValues: {
            SUB_CATEGORY_NAME: editRow ? editRow.subcategory : '',
            CATEGORY_NAME: editRow ? editRow.categoryId : ''
        },
    });

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[40%]">
                    <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Form {...form}>
                            <form>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <FormComboboxInput items={categoryDataDropdown} formControl={form.control} name={"CATEGORY_NAME"} placeholder={"Choose Category"} label={"Category Name"} />
                                    <FormInput formControl={form.control} name={"SUB_CATEGORY_NAME"} label={"Sub Category Name"} placeholder={"Enter Sub Category Name"} />
                                </div>
                            </form>
                        </Form>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={form.handleSubmit(saveCategoryInfo)}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    )
}
