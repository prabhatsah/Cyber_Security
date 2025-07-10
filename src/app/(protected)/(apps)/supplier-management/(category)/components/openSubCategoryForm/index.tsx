"use client"
import React from 'react'
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import SubCategoryForm from '../subCategoryForm';

export default function OpenSubCategoryForm({categoryDataDropdown}:{categoryDataDropdown:Record<string,string>[]}) {
    const [openSubCategoryFrom, setOpenSubCategoryForm] = useState<boolean>(false);
    return (
        <>
            {
                openSubCategoryFrom &&
                <SubCategoryForm open={openSubCategoryFrom} setOpen={setOpenSubCategoryForm} categoryDataDropdown={categoryDataDropdown} editRow={null}/>
            }
            <IconTextButtonWithTooltip tooltipContent={"Create New Sub Category"} onClick={()=>setOpenSubCategoryForm(true)}>
                <UserRoundPlus />
            </IconTextButtonWithTooltip>
        </>
    )
}