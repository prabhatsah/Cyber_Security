import React, { useEffect, useMemo, useState } from 'react'
import { Field } from './fieldConfigurationForm';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Button } from '@/shadcn/ui/button';
import DynamicFieldForm from './dynamicFieldForm';
import { DynamicTable } from './dynamicTable';

interface FlatItem {
    id: string;
    parentId: string | null;
    [key: string]: string | null; 
}

interface NestedItem {
    id: string;
    parentId: string | null;
    [key: string]: string | null | NestedItem[] | undefined;
    subRows?: NestedItem[];
}

const nestedData = (data: FlatItem[]): NestedItem[] => {
    const buildTree = (items: FlatItem[], parentId: string | null): NestedItem[] => {
        const children = items.filter(item => item.parentId === parentId);

        return children.map(({ id, parentId: _, ...rest }) => {
            const subRows = buildTree(items, id);

            const nestedItem: NestedItem = {
                id,
                parentId, // retain parentId to match the interface
                ...rest,
                ...(subRows.length > 0 && { subRows }),
            };

            return nestedItem;
        });
    };

    return buildTree(data, null);
};

export default function FrameworkForm({
    openFrameworkForm,
    setOpenFrameworkForm,
    setFieldSelectionModal,
    fields
}: {
    openFrameworkForm: boolean;
    setOpenFrameworkForm: React.Dispatch<React.SetStateAction<boolean>>;
    setFieldSelectionModal: React.Dispatch<React.SetStateAction<boolean>>;
    fields: Field[]
}) {
    const [openDynamicForm, setOpenDynamicForm] = useState<boolean>(false);
    const [data, setData] = useState<Record<string, string>[]>([]);
    const [parentEntries, setParentEntries] = useState<{ value: string, label: string }[]>([]);

    const nestedItems = useMemo(() => nestedData(data), [data]);

    console.log(data);
    console.log(parentEntries);

    return (
        <>
            <Dialog open={openFrameworkForm} onOpenChange={setOpenFrameworkForm}>
                <DialogContent className="!max-w-none !w-screen !h-screen p-6 pt-4 flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Field Configuration</DialogTitle>
                    </DialogHeader>
                    <div className='flex flex-row justify-between mt-5'>
                        <h1>Framework</h1>
                        <Button onClick={() => { setOpenDynamicForm(true) }}>
                            Framework Form
                        </Button>
                    </div>
                    <DynamicTable data={nestedItems} fields={fields} />

                    {/* <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter> */}
                </DialogContent>
            </Dialog>

            {
                openDynamicForm && (
                    <DynamicFieldForm
                        openDynamicForm={openDynamicForm}
                        setOpenDynamicForm={setOpenDynamicForm}
                        fields={fields}
                        setData={setData}
                        parentEntries={parentEntries}
                        setParentEntries={setParentEntries}
                    />
                )
            }
        </>
    )
}
