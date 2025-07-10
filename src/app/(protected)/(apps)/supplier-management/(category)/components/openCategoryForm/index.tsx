"use client"
import React from 'react'
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import CategoryForm from '../categoryForm';

export default function OpenCategoryForm() {
    const [openCategoryFrom, setOpenCategoryForm] = useState<boolean>(false);
    return (
        <>
            {
                openCategoryFrom &&
                <CategoryForm open={openCategoryFrom} setOpen={setOpenCategoryForm} />
            }
            <IconTextButtonWithTooltip tooltipContent={"Create New Category"} onClick={()=>setOpenCategoryForm(true)}>
                <UserRoundPlus />
            </IconTextButtonWithTooltip>
        </>
    )
}







