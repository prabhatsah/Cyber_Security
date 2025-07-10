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

export const DomainFormSchema = z.object({
    DOMAIN_NAME: z.string().min(2, { message: 'Domain Name must be at least 2 characters long.' }).trim(),
});

export default function DomainEdit({ open, setOpen, domainData,profileData }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; domainData: Record<string, string>[]; profileData: Record<string, string>[]}) {
    const router = useRouter();

    const form = useForm<z.infer<typeof DomainFormSchema>>({
        resolver: zodResolver(DomainFormSchema),
        defaultValues: { DOMAIN_NAME: '' },
    });

    const [doaminDataTableData, setDomainDataTableData] = useState<any[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    useEffect(() => {


        const validData = (domainData || []).filter(Boolean);

        if (validData.length === 0) {
            setDomainDataTableData([]);
            return;
        }
        
        const initialData = domainData.flatMap(obj =>
            obj.domain
                ? Object.values(obj.domain).map(entry => ({
                    ...entry,
                }))
                : []
        );
        setDomainDataTableData(initialData);
    }, [domainData]);

    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: 'slNo',
            header: 'Sl No.',
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: 'domain',
            header: 'Domain',
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
                        form.setValue('DOMAIN_NAME', rowData.domain);
                        setEditingIndex(doaminDataTableData.findIndex((d) => d.domainId === rowData.domainId));
                    },
                },
            ],
        },
    };

    function handleClear() {
        form.reset();
        setEditingIndex(null);
    }

    function handleAddOrUpdate(data: z.infer<typeof DomainFormSchema>) {
        const newEntry = {
            domainId: editingIndex === null ? v4() : doaminDataTableData[editingIndex].domainId,
            domain: data.DOMAIN_NAME,
        };

        if (editingIndex !== null) {
            const updatedData = [...doaminDataTableData];
            updatedData[editingIndex] = newEntry;
            setDomainDataTableData(updatedData);
            setEditingIndex(null);
        } else {
            // Add new entry
            setDomainDataTableData((prev) => [newEntry, ...prev]);
        }

        form.reset();

    }

    async function saveDomainDataToBackend() {
        const instances = await getMyInstancesV2({
            processName: 'Metadata - Domain - Global Account',
            predefinedFilters: { taskName: 'Edit Domain' },
        });

        console.log("Instances found:", instances);

        // Convert array to object with riskCategoryId as key
        const formattedData = doaminDataTableData.reduce((acc, curr) => {
            acc[curr.domainId] = {
                domainId: curr.domainId,
                domain: curr.domain,
                addedOn: new Date().toISOString(),
                addedFrom: 'globalAccount', // Assuming profileData is available in the scope
            };
            return acc;
        }, {} as Record<string, { domainId: string; domain: string; addedOn: string; addedFrom: string }>);

        
        let newDomainAdded: string[] = [];

        if (instances.length === 0) {
            let finalData: Record<string, any> = {};
            newDomainAdded = Object.keys(formattedData);

            finalData['activityLog'] = [];
            finalData['domain'] = formattedData;
            finalData['lastUpdatedBy'] = profileData.USER_ID;
            finalData['lastUpdatedOn'] = new Date().toISOString();
            let activityLogEntry = {
                lastUpdatedBy: profileData.USER_ID,
                lastUpdatedOn: new Date().toISOString(),
                type: "Domain",
                addedIDs:newDomainAdded
            }
            finalData['activityLog'].push(activityLogEntry);


            const processId = await mapProcessName({ processName: "Metadata - Domain - Global Account" });
            await startProcessV2({
                processId: processId,
                data: finalData,
                processIdentifierFields: "",
            });
        } else {
            const previousDomainId = Object.keys(instances[0].data.domain as object);
            const currentDomainId = Object.keys(formattedData);
            newDomainAdded = currentDomainId.filter((id) => !previousDomainId.includes(id));
            
            const taskId = instances?.[0]?.taskId;
            const taskData = instances[0].data as Record<string, any>;

            const lastUpdatedBy = profileData.USER_ID;
            const lastUpdatedOn = new Date().toISOString();
            let activityLogEntry = {
                lastUpdatedBy: lastUpdatedBy,
                lastUpdatedOn: lastUpdatedOn,
                type: "Domain",
                addedIDs: newDomainAdded
            };
            taskData.activityLog.push(activityLogEntry);
            taskData.domain = formattedData;
            taskData.lastUpdatedBy = lastUpdatedBy;
            taskData.lastUpdatedOn = lastUpdatedOn;
            console.log('updateddd data ===========>>>>')
            console.log(taskData);

            await invokeAction({
                taskId,
                data: taskData,
                transitionName: 'update edit domain',
                processInstanceIdentifierField: '',
            });
        }

        setOpen(false);
        router.refresh();
        form.reset();

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
                        <DialogTitle>Add/Edit Domain</DialogTitle>
                        <DialogDescription>Manage your domain by adding or editing</DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleAddOrUpdate)}
                            className="space-y-2"
                        >
                            <FormInput
                                formControl={form.control}
                                name={'DOMAIN_NAME'}
                                label={'Domain'}
                                placeholder={'Enter Domain'}
                            />

                            <div className="flex justify-end space-x-2">
                                <Button type="submit">{editingIndex === null ? 'ADD' : 'UPDATE'}</Button>
                                <Button type="button" variant="outline" onClick={handleClear}>
                                    CLEAR
                                </Button>
                            </div>
                        </form>

                        <div className="h-[30rem] overflow-y-auto">

                            <DataTable data={doaminDataTableData} columns={columns} extraParams={extraParams} />
                        </div>
                    </Form>

                    <DialogFooter>
                        <Button onClick={saveDomainDataToBackend}>SAVE</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }
