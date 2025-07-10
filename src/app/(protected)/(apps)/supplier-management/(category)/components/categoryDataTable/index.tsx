"use client"
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import OpenCategoryForm from "../openCategoryForm";
import OpenSubCategoryForm from "../openSubCategoryForm";
import SubCategoryForm from "../subCategoryForm";
import { useState } from "react";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";


export default function CategoryDataTable({ vendorCategoryData, categoryDataDropdown }: { vendorCategoryData: { categoryId: string; category: any; subcategory: string }[], categoryDataDropdown: Record<string, string>[] }) {
    const [openSubCategoryEditFrom, setOpenSubCategoryEditForm] = useState<boolean>(false);
    const [editRowData, setEditRowData] = useState<Record<string, string>>({});

    async function deleteCategoryRow(rowData: Record<string,string>){
        const vendorCategoryInstance = await getMyInstancesV2({
            processName: "Vendor Category",
            predefinedFilters: { "taskName": "Edit Asset Configuration" }
        })
        const vendorCategoryData: { assetData: Record<string, string>[], categoryData: Record<string, string>, currentData: Record<string, string>[] } = vendorCategoryInstance[0]?.data
        const { assetData,categoryData } = vendorCategoryData;

        let childrenOfCategory = assetData.filter((asset) => asset.category === rowData.category);
        if(childrenOfCategory.length != 0){
            console.log("Cannot Be deleted")
        }else{
            for(var i in categoryData){
                if(rowData.category === categoryData[i]){
                    delete categoryData[i];
                    break;
                }    
            }
            vendorCategoryData.categoryData = categoryData;
            const taskId = vendorCategoryInstance[0].taskId;
            await invokeAction({
                taskId: taskId,
                transitionName: "Update Edit Asset Configuration",
                data: vendorCategoryData,
                processInstanceIdentifierField: ""
            })
            console.log("Category Deleted");
        }
        console.log(vendorCategoryData);
        
    }

    async function deleteSubCategoryRow(rowData: Record<string, string>) {
        const vendorCategoryInstance = await getMyInstancesV2({
            processName: "Vendor Category",
            predefinedFilters: { "taskName": "Edit Asset Configuration" }
        })

        const vendorCategoryData: { assetData: Record<string, string>[], categoryData: Record<string, string>, currentData: Record<string, string>[] } = vendorCategoryInstance[0]?.data
        const { assetData } = vendorCategoryData;
        const index = assetData.findIndex(item => item.id === rowData.id);
        console.log(index);
        if (index !== -1) {
            assetData.splice(index, 1);
        }
        vendorCategoryData.assetData = assetData;
        console.log(vendorCategoryData);
        const taskId = vendorCategoryInstance[0].taskId;
        await invokeAction({
            taskId: taskId,
            transitionName: "Update Edit Asset Configuration",
            data: vendorCategoryData,
            processInstanceIdentifierField: ""
        });
        console.log("Sub Category Deleted");
    }
    const columnsCategoryDetails: DTColumnsProps<{ categoryId: string; category: any; subcategory: string }>[] = [
        {
            accessorKey: "category",
            header: "Category"
        },
        {
            accessorKey: "subcategory",
            header: "Sub Category"
        },
    ];
    const extraParams: DTExtraParamsProps = {
        defaultGroups: ["category"],
        actionMenu: {
            items: [
                {
                    label: "Edit",
                    onClick: (rowData) => {
                        console.log(rowData);
                        setEditRowData(rowData);
                        setOpenSubCategoryEditForm(true);

                    },
                },
                {
                    label: "Delete",
                    onClick: (rowData) => {
                        console.log(rowData)
                        deleteSubCategoryRow(rowData);
                    },
                },
            ]
        },
        groupActionMenu: {
            items: [
                {
                    label: "Delete",
                    onClick: (rowData) => {
                        console.log(rowData);
                        deleteCategoryRow(rowData);
                    },
                },
            ]
        },
        extraTools: [
            <OpenCategoryForm />,
            <OpenSubCategoryForm categoryDataDropdown={categoryDataDropdown} />
        ]
    };
    return (
        <>
            {
                openSubCategoryEditFrom &&
                <SubCategoryForm open={openSubCategoryEditFrom} setOpen={setOpenSubCategoryEditForm} categoryDataDropdown={categoryDataDropdown} editRow={editRowData} />
            }
            <DataTable columns={columnsCategoryDetails} data={vendorCategoryData} extraParams={extraParams} />
        </>
    )
}