import { DynamicFieldFrameworkContext } from '../context/dynamicFieldFrameworkContext';
import React, { useMemo, useState } from 'react'
import { FrameworkStructureDataTable } from './frameworkStructureDataTable';
import FrameworkStructureForm from './frameworkStructureForm';
import { IconButtonWithTooltip } from '@/ikon/components/buttons';
import { Plus, Upload, LogOut } from 'lucide-react';
import UploadTab from './uploadTab';
import MoveEntriesDialog from './moveEntriesDialog';

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

export const nestedData = (data: FlatItem[]): NestedItem[] => {
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

export default function FrameworkStructure() {
    const [openFrameworkStructurecForm, setOpenFrameworkStructurecForm] = useState<boolean>(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
    const [isMoveDialogOpen,setIsMoveDialogOpen] = useState<boolean>(false);

    const {
        frameworkStructureData,
        setFrameworkStructureData,
        frameworkFieldConfigData,
        parentEntries,
        setParentEntries,
        selectedEntries
    } = DynamicFieldFrameworkContext();
    const nestedItems = useMemo(() => nestedData(frameworkStructureData), [frameworkStructureData]);
    console.log(frameworkStructureData);
    const extraParams: any = [
        <IconButtonWithTooltip
            tooltipContent="Add Policies"
            onClick={() => { setOpenFrameworkStructurecForm(true) }}
        >
            <Plus />
        </IconButtonWithTooltip>,
        <IconButtonWithTooltip
            tooltipContent="Upload Policies"
            onClick={() => { setUploadDialogOpen(true) }}
        >
            <Upload />
        </IconButtonWithTooltip>,
        selectedEntries.length > 0 && (
            <IconButtonWithTooltip
                tooltipContent="Move Policies"
                onClick={() => {setIsMoveDialogOpen(true) }}
            >
                <LogOut />
            </IconButtonWithTooltip>
        )

    ]
    return (
        <>
            <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold my-4">
                    Framework Structure
                </h3>
            </div>
            <div className='flex flex-col gap-3'>
                <FrameworkStructureDataTable
                    nesteddata={nestedItems}
                    data={frameworkStructureData}
                    fields={frameworkFieldConfigData}
                    setData={setFrameworkStructureData}
                    parentEntries={parentEntries}
                    setParentEntries={setParentEntries}
                    extraParams={extraParams}
                />
            </div>
            {
                openFrameworkStructurecForm && (
                    <FrameworkStructureForm
                        openDynamicForm={openFrameworkStructurecForm}
                        setOpenDynamicForm={setOpenFrameworkStructurecForm}
                        fields={frameworkFieldConfigData}
                        setData={setFrameworkStructureData}
                        parentEntries={parentEntries}
                        setParentEntries={setParentEntries}
                    />
                )
            }
            {
                uploadDialogOpen && (
                    <UploadTab
                        uploadDialogOpen={uploadDialogOpen}
                        setUploadDialogOpen={setUploadDialogOpen}
                        fields={frameworkFieldConfigData}
                        setParentEntries={setParentEntries}
                    />
                )
            }
            {
                isMoveDialogOpen && (
                    <MoveEntriesDialog  isMoveDialogOpen={isMoveDialogOpen} setIsMoveDialogOpen={setIsMoveDialogOpen} />
                )
            }
        </>
    )
}
