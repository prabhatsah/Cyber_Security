import React, { useState } from 'react'
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { DynamicFieldConfigFormDataWithId, DynamicFieldFrameworkContext } from '../context/dynamicFieldFrameworkContext'
import { DataTable } from '@/ikon/components/data-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import DynamicFieldForm from './dynamicFieldForm';
import { RadioGroup, RadioGroupItem } from '@/shadcn/ui/radio-group';
import { Button } from '@/shadcn/ui/button';
import { IconButtonWithTooltip } from '@/ikon/components/buttons';


export default function DynamicFieldTable() {
    const [openDynamicFieldForm, setOpenDynamicFormField] = useState<boolean>(false);
    const { frameworkFieldConfigData, setFrameworkFieldConfigData } = DynamicFieldFrameworkContext();
    const [updateDynamicFieldForm, setUpdateDynamicFieldForm] = useState<boolean>(false);
    const [updateRow, setUpdatedRow] = useState<DynamicFieldConfigFormDataWithId | null>(null);
    console.log(frameworkFieldConfigData);
    const columnsFrameworkConfigTable: DTColumnsProps<DynamicFieldConfigFormDataWithId>[] = [
        // {
        //     id: "select",
        //     header: "Identifer Field",
        //     cell: ({ row }) => (
        //         <RadioGroup
        //             value={identifierField ?? ""}
        //             onValueChange={(val) => setIdentifierField(val)}
        //         >
        //             <RadioGroupItem
        //                 value={row.original.name}
        //                 id={`radio-${row.id}`}
        //                 className="ml-6"
        //             />
        //         </RadioGroup>
        //     ),
        //     size: 50,
        // },
        {
            accessorKey: "name",
            header: "Field Name",
            cell: ({ row }) => (
                <div className="capitalize" title={row.original.name}>{row.original.name}</div>
            ),
        },
        {
            accessorKey: "type",
            header: "Field Type",
            cell: ({ row }) => (
                <div className="capitalize" title={row.original.type}>{row.original.type}</div>
            ),
        },
        {
            accessorKey: "description",
            header: "Form Placeholder",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[300px]" title={row.original.description}>{row.original.description}</div>
            ),
        },
        {
            accessorKey: "extraInfo",
            header: "Extra Information",
            cell: ({ row }) => {
                const extraInfoData = row.original?.extraInfo && row.original?.extraInfo.length > 0 ? row.original.extraInfo.map((extraInfo) => extraInfo.label).join(",") : "N/A";
                return (
                    <div className='truncate w-[300px]'>{extraInfoData}</div>
                )
            }
        },
        {
            id: 'actions',
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => (
                <div className="flex gap-2 justify-center">
                    <Button variant="ghost" size="icon" onClick={() => { setUpdatedRow(row.original), setUpdateDynamicFieldForm(true) }}>
                        <Pencil className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => {
                        setFrameworkFieldConfigData(prev =>
                            prev.filter(item => item.id !== row.original.id)
                        );
                    }}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            ),
        }

    ];
    const extraParamsFrameworkConfigTable: DTExtraParamsProps = {
        grouping: false,
        paginationBar: false,
        defaultTools: ["search", "columnFilter"],
        extraTools: [
            <IconButtonWithTooltip
                tooltipContent="Add Field"
                onClick={() => { setOpenDynamicFormField(true) }}
            >
                <Plus />
            </IconButtonWithTooltip>,
        ],

    };

    return (
        <>

            <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="text-lg font-semibold my-4">
                    Framework Field Configuration
                </h3>
            </div>

            <div className='h-[65vh] overflow-y-auto'>
                <DataTable
                    columns={columnsFrameworkConfigTable}
                    data={frameworkFieldConfigData}
                    extraParams={extraParamsFrameworkConfigTable}
                />
            </div>

            {
                openDynamicFieldForm && (
                    <DynamicFieldForm openDynamicFieldForm={openDynamicFieldForm} setOpenDynamicFormField={setOpenDynamicFormField} />
                )
            }
            {
                updateDynamicFieldForm && (
                    <DynamicFieldForm openDynamicFieldForm={updateDynamicFieldForm} setOpenDynamicFormField={setUpdateDynamicFieldForm} updateRow={updateRow} />
                )
            }
        </>
    )
}
