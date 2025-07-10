'use client';
import { Button } from '@/shadcn/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shadcn/ui/dialog';
import { Form } from '@/shadcn/ui/form';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@/ikon/components/form-fields/input';
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';

export const ImpactFormSchema = z.object({
    RISK_CATEGORY: z.string().min(2, { message: 'Risk Impact must be at least 2 characters long.' }).trim(),
});

export default function RiskCategoryEdit({ open, setOpen, riskCategoryData, profileData }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; riskCategoryData: Record<string, string>[]; profileData: Record<string, string>[] }) {
    const router = useRouter();

    const form = useForm<z.infer<typeof ImpactFormSchema>>({
        resolver: zodResolver(ImpactFormSchema),
        defaultValues: { RISK_CATEGORY: '' },
    });

    const [categoryDataTableData, setCategoryDataTableData] = useState<any[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    useEffect(() => {


        const validData = (riskCategoryData || []).filter(Boolean);

        if (validData.length === 0) {
            setCategoryDataTableData([]);
            return;
        }
        // Initialize the table with incoming data
        // const initialData = (riskCategoryData || []).map((item) => ({
        //     riskCategoryId: v4(),
        //     riskCategory: item.riskCategory
        // }));

        const initialData = Array.isArray(riskCategoryData)
            ? riskCategoryData.flatMap(obj => Object.values(obj ?? {}))
            : [];
        setCategoryDataTableData(initialData);
    }, [riskCategoryData]);

    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: 'slNo',
            header: 'Sl No.',
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: 'riskCategory',
            header: 'Risk Category',
        },

    ];

    const extraParams: DTExtraParamsProps = {
        pagination: false,
        actionMenu: {
            items: [
                {
                    label: 'Edit',
                    onClick: (rowData) => {
                        // Set form values for editing
                        form.setValue('RISK_CATEGORY', rowData.riskCategory);
                        setEditingIndex(categoryDataTableData.findIndex((d) => d.riskCategoryId === rowData.riskCategoryId));
                    },
                },
            ],
        },
    };

    function handleClear() {
        form.reset();
        setEditingIndex(null);
    }

    function handleAddOrUpdate(data: z.infer<typeof ImpactFormSchema>) {
        const newEntry = {
            riskCategoryId: editingIndex === null ? v4() : categoryDataTableData[editingIndex].riskCategoryId,
            riskCategory: data.RISK_CATEGORY,
        };

        if (editingIndex !== null) {
            const updatedData = [...categoryDataTableData];
            updatedData[editingIndex] = newEntry;
            setCategoryDataTableData(updatedData);
            setEditingIndex(null);
        } else {
            // Add new entry
            setCategoryDataTableData((prev) => [newEntry, ...prev]);
        }

        form.reset();

    }

    async function saveImpactDataToBackend() {
        const instances = await getMyInstancesV2({
            processName: 'Metadata - Risk Category',
            predefinedFilters: { taskName: 'Edit Config' },
        });

        const formattedData = categoryDataTableData.reduce((acc, curr) => {
            acc[curr.riskCategoryId] = {
                riskCategoryId: curr.riskCategoryId,
                riskCategory: curr.riskCategory,
                addedOn: new Date().toISOString(),
                addedBy: profileData.USER_ID,
                addedFrom: 'clientAccount'
            };
            return acc;
        }, {} as Record<string, { riskCategoryId: string; riskCategory: string; addedOn: string; addedBy: string; addedFrom: string }>);

        let newRiskCategoryAdded: string[] = [];

        if (instances.length === 0) {
            let finalData: Record<string, any> = {};
            newRiskCategoryAdded = Object.keys(formattedData);

            finalData['activityLog'] = [];
            finalData['riskCategory'] = formattedData;
            finalData['lastUpdatedBy'] = profileData.USER_ID;
            finalData['lastUpdatedOn'] = new Date().toISOString();

            let activityLogEntry = {
                lastUpdatedBy: profileData.USER_ID,
                lastUpdatedOn: new Date().toISOString(),
                type: "Risk Category",
                addedIDs: newRiskCategoryAdded
            }

            finalData['activityLog'].push(activityLogEntry);

            const processId = await mapProcessName({ processName: "Metadata - Risk Category" });

            await startProcessV2({
                processId: processId,
                data: finalData,
                processIdentifierFields: "",
            });
        } else {
            const previousRiskCategoryId = Object.keys(instances[0].data.riskCategory as object);
            const currentRiskCategoryId = Object.keys(formattedData);
            newRiskCategoryAdded = currentRiskCategoryId.filter((id) => !previousRiskCategoryId.includes(id));

            const taskId = instances?.[0]?.taskId;
            const taskData = instances[0].data as Record<string, any>;
            taskData.activityLog.push({
                lastUpdatedBy: profileData.USER_ID,
                lastUpdatedOn: new Date().toISOString(),
                type: "Risk Category",
                addedIDs: newRiskCategoryAdded
            });
            taskData.riskCategory = formattedData;
            taskData.lastUpdatedBy = profileData.USER_ID;
            taskData.lastUpdatedOn = new Date().toISOString();

            await invokeAction({
                taskId,
                data: taskData,
                transitionName: 'Update Edit Config',
                processInstanceIdentifierField: '',
            });
        }
        setOpen(false);
        router.refresh();
    }


    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
                form.reset();
                setEditingIndex(null);
            }
        }}>
            <DialogContent className="max-w-[50%] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Add/Edit Risk Category</DialogTitle>
                    <DialogDescription>Manage your risk category by adding or editing</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleAddOrUpdate)}
                        className="space-y-2"
                    >
                        <FormInput
                            formControl={form.control}
                            name={'RISK_CATEGORY'}
                            label={'Risk Category'}
                            placeholder={'Enter Risk Category'}
                        />

                        <div className="flex justify-end space-x-2">
                            <Button type="submit">{editingIndex === null ? 'ADD' : 'UPDATE'}</Button>
                            <Button type="button" variant="outline" onClick={handleClear}>
                                CLEAR
                            </Button>
                        </div>
                    </form>

                    <div className="max-h-[40%] overflow-y-auto">

                        <DataTable data={categoryDataTableData} columns={columns} extraParams={extraParams} />
                    </div>
                </Form>

                <DialogFooter>
                    <Button onClick={saveImpactDataToBackend}>SAVE</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
