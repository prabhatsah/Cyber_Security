import FormInput from '@/ikon/components/form-fields/input'
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService'
import { Button } from '@/shadcn/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { Form } from '@/shadcn/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { v4 } from 'uuid'
import { z } from 'zod'

export const CategoryFormSchema = z.object({
    CATEGORY_NAME: z
        .string()
        .min(2, { message: 'Category Name must be at least 2 characters long.' })
        .trim(),
})

export default function CategoryForm({ open, setOpen }: any) {

    async function saveCategoryInfo(data: z.infer<typeof CategoryFormSchema>) {
        console.log(data)

        const vendorCategoryInstance = await getMyInstancesV2({
            processName: "Vendor Category",
            predefinedFilters: { taskName: "Edit Asset Configuration" }
        })
        console.log(vendorCategoryInstance)
        let taskId = "";
        let newData: Record<string, any> = {};
        let categoryData: Record<string, string> = {};
        
        if (vendorCategoryInstance.length) {
            if (vendorCategoryInstance[0].data) {
                taskId = vendorCategoryInstance[0].taskId;
                newData = vendorCategoryInstance[0].data;
                categoryData = vendorCategoryInstance[0].data?.categoryData
            } else if (!vendorCategoryInstance[0].data) {
                newData = {};
                taskId = vendorCategoryInstance[0].taskId
            }
            const uuid = v4();
            if (Object.keys(categoryData).length) {
                categoryData[uuid] = data.CATEGORY_NAME;
            } else {
                categoryData = {};
                categoryData[uuid] = data.CATEGORY_NAME;
            }
            if (!newData) {
                newData = {};
            }
            if (!newData.categoryData) {
                newData.categoryData = {};
            }
            newData.categoryData[uuid] = data.CATEGORY_NAME;

            console.log(newData);
            await invokeAction({
                taskId: taskId,
                transitionName: "Update Edit Asset Configuration",
                data: newData,
                processInstanceIdentifierField: ""
            })
        }
        else {
            const processId = await mapProcessName({ processName: "Vendor Category" })
            await startProcessV2({
                processId: processId,
                data: {},
                processIdentifierFields: ""
            });
        }

        setOpen(false);

    }

    const form = useForm<z.infer<typeof CategoryFormSchema>>({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            CATEGORY_NAME: '',
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[40%]">
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form>
                            <div className='grid grid-cols-1'>
                                <FormInput formControl={form.control} name={"CATEGORY_NAME"} label={"Category Name"} placeholder={"Enter Category Name"} />
                            </div>
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={form.handleSubmit(saveCategoryInfo)}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
