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
import { getMyInstancesV2, invokeAction } from '@/ikon/utils/api/processRuntimeService';
import { v4 } from 'uuid';
import { useEffect, useState } from 'react';
import FormTextarea from '@/ikon/components/form-fields/textarea';

export const ImpactFormSchema = z.object({
    RISK_IMPACT: z.string().min(2, { message: 'Risk Impact must be at least 2 characters long.' }).trim(),
    RISK_WEIGHTAGE: z.string().min(1, { message: 'Risk Weightage must be at least 1 character long.' }).regex(/^\d+$/, 'Must be a number').trim(),
    RISK_VALUE: z.string().min(1, { message: 'Risk Value must be at least 1 character long.' }).regex(/^\d+$/, 'Must be a number').trim(),
    DESCRIPTION: z.string().min(2, { message: 'Risk Description must be at least 2 characters long.' }).trim(),
});

export default function RiskImpactEdit({ open, setOpen, riskImpactData }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; riskImpactData: Record<string, string>[] }) {
    const router = useRouter();

    const form = useForm<z.infer<typeof ImpactFormSchema>>({
        resolver: zodResolver(ImpactFormSchema),
        defaultValues: { RISK_IMPACT: '', RISK_WEIGHTAGE: '', RISK_VALUE: '', DESCRIPTION: '' },
    });

    const [impactTableData, setImpactTableData] = useState<any[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    useEffect(() => {
        // Initialize the table with incoming data
        const validData = (riskImpactData || []).filter(Boolean);

        if (validData.length === 0) {
            setImpactTableData([]);
            return;
        }
        // const initialData = (riskImpactData || []).map((item) => ({
        //     riskImpactId: v4(),
        //     riskImpact: item.riskImpact || item.description,
        //     riskImpactWeightage: Number(item.riskWeightage),
        // }));

        const initialData = Array.isArray(riskImpactData)
            ? riskImpactData.flatMap(obj => Object.values(obj ?? {}))
            : [];
        setImpactTableData(initialData);
    }, [riskImpactData]);

    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: 'slNo',
            header: 'Sl No.',
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: 'riskImpact',
            header: 'Risk Impact',
        },
        {
            accessorKey: 'riskValue',
            header: 'Impact Value',
        },
        {
            accessorKey: 'riskImpactWeightage',
            header: 'Impact Weightage',
        },

        {
            accessorKey: 'description',
            header: 'Description',
        },
    ];

    const extraParams: DTExtraParamsProps = {

        grouping: false,
        actionMenu: {
            items: [
                {
                    label: 'Edit',
                    onClick: (rowData) => {
                        // Set form values for editing
                        form.setValue('RISK_IMPACT', rowData.riskImpact);
                        form.setValue('RISK_WEIGHTAGE', rowData.riskImpactWeightage.toString());
                        form.setValue('RISK_VALUE', rowData.riskValue.toString());
                        form.setValue('DESCRIPTION', rowData.description || '');
                        setEditingIndex(impactTableData.findIndex((d) => d.riskImpactId === rowData.riskImpactId));
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
            riskImpactId: editingIndex === null ? v4() : impactTableData[editingIndex].riskImpactId,
            riskImpact: data.RISK_IMPACT,
            riskImpactWeightage: Number(data.RISK_WEIGHTAGE),
            riskValue: data.RISK_VALUE ? Number(data.RISK_VALUE) : 0,
            description: data.DESCRIPTION || '',
        };

        if (editingIndex !== null) {
            const updatedData = [...impactTableData];
            updatedData[editingIndex] = newEntry;
            setImpactTableData(updatedData);
            setEditingIndex(null);
        } else {
            // Add new entry
            setImpactTableData((prev) => [newEntry, ...prev]);
        }

        form.reset();
    }

    async function saveImpactDataToBackend() {
        const instances = await getMyInstancesV2({
            processName: 'Metadata - Risk Impact and Weightage',
            predefinedFilters: { taskName: 'Edit Impact' },
        });



        const taskId = instances?.[0]?.taskId;
        if (!taskId) return;

        // Convert array to object with riskImpactId as key
        const formattedData = impactTableData.reduce((acc, curr) => {
            acc[curr.riskImpactId] = curr;
            return acc;
        }, {} as Record<string, { riskImpactId: string; riskImpact: string; riskImpactWeightage: number }>);

        await invokeAction({
            taskId,
            data: formattedData,
            transitionName: 'Update Edit Impact',
            processInstanceIdentifierField: '',
        });

        console.log('Impact data saved successfully:', formattedData);
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
                    <DialogTitle>Add/Edit Risk Impact</DialogTitle>
                    <DialogDescription>Manage your risk impact by adding or editing</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleAddOrUpdate)}
                        className="space-y-2"
                    >
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <FormInput
                                formControl={form.control}
                                name={'RISK_IMPACT'}
                                label={'Risk Impact'}
                                placeholder={'Enter Risk Impact'}
                            />
                            <FormInput
                                formControl={form.control}
                                type="number"
                                name={'RISK_VALUE'}
                                label={'Impact value'}
                                placeholder={'Enter Impact value'}
                            />

                            <FormInput
                                formControl={form.control}
                                type="number"
                                name={'RISK_WEIGHTAGE'}
                                label={'Impact Weightage'}
                                placeholder={'Enter Impact Weightage'}
                            />


                        </div>

                        <FormTextarea
                            formControl={form.control}
                            name="DESCRIPTION"
                            className="resize-y max-h-[100px] w-full"
                            formItemClass="w-full"
                            label="Description" />

                        <div className="flex justify-end space-x-2">
                            <Button type="submit">{editingIndex === null ? 'ADD' : 'UPDATE'}</Button>
                            <Button type="button" variant="outline" onClick={handleClear}>
                                CLEAR
                            </Button>
                        </div>
                    </form>


                    <div className="max-h-[40%] overflow-y-auto">
                        <DataTable data={impactTableData} columns={columns} extraParams={extraParams} />
                    </div>
                </Form>

                <DialogFooter>
                    <Button onClick={saveImpactDataToBackend}>SAVE</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
