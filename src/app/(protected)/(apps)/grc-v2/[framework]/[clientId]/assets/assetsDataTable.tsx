"use client";
import React, { useState } from "react";
import { DataTable } from "@/ikon/components/data-table-grc";
import {
    DTColumnsProps,
    DTExtraParamsProps,
} from "@/ikon/components/data-table-grc/type";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    mapProcessName,
    startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { v4 } from "uuid";
import { Button } from "@/shadcn/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shadcn/ui/alert-dialog';
import { toast } from "sonner";
import AssetsForm from "./assetsForm";




export default function AssetsDataTable({ assetsData ,userIdNameMap,allUser }: {assetsData: Record<string,string>[]; userIdNameMap: { value: string, label: string }[]; allUser: Record<string,string>[]}) {
    const [openAssetsForm, setOpenAssetsForm] = useState<boolean>(false);
    const [selectedAsset, setSelectedAsset] = useState<Record<string, any> | null>(null);

    const router = useRouter();
    
    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: "assetName",
            header: "Asset Name",
            cell: ({ row }) => (
                <div className="truncate max-w-[300px]" title={row.getValue("assetName")}>
                    {row.getValue("assetName")}
                </div>
            ),
        },
        {
            accessorKey: "assetTag",
            header: "Asset Tag",
            cell: ({ row }) => (
                <div className="truncate max-w-[300px]" title={row.getValue("assetTag")}>
                    {row.getValue("assetTag")}
                </div>
            ),
        },
        {
            accessorKey: "classification",
            header: "Classification",
            cell: ({ row }) => {
                return (
                    <div className="truncate max-w-[300px]" title={row.getValue("classification")}>
                        {row.getValue("classification")}
                    </div>
                );
            },
        },
        {
            accessorKey: "assetOwner",
            header: "Owner",
            cell: ({ row }) => {
                const ownerNameId = row.original.assetOwner;
                const ownerName = ownerNameId.length ? allUser[ownerNameId].userName : '';
                return ownerName;
            },
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => {
                return (
                    <div className="truncate max-w-[300px]" title={row.getValue("description")}>
                        {row.getValue("description")}
                    </div>
                );
            },
        },

    ];

    const extraParams: DTExtraParamsProps = {
        pagination: false,
        actionMenu: {
            items: [
                {
                    label: "Edit",
                    onClick: (rowData) => {
                        setSelectedAsset(rowData);
                        setOpenAssetsForm(true);
                    },
                },

            ],
        },
        extraTools: [
            <IconButtonWithTooltip
                key="add-risk-btn"
                tooltipContent="Add Assets"
                onClick={() => {
                    setSelectedAsset(null);
                    setOpenAssetsForm(true);
                }}
            >
                <Plus />
            </IconButtonWithTooltip>,
        ],
    };
   
    return (
        <>
            <div className="h-[90%] overflow-y-auto">
                <DataTable data={assetsData} columns={columns} extraParams={extraParams} />
            </div>
            <AssetsForm open={openAssetsForm} setOpen={setOpenAssetsForm} editAssetData={selectedAsset} userIdNameMap={userIdNameMap} />
        </>
    )
}
