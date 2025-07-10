"use client"
import React from 'react'
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import RequisitionForm from './requisitionForm';



export default function OpenRequisitionForm({vendabledata}:{vendabledata: Record<string,any>[]|undefined}) {
    const [openRequisitionForm, setOpenRequisitionForm] = useState<boolean>(false);
    return (
        <>
            {
                openRequisitionForm &&
                <RequisitionForm open={openRequisitionForm} setOpen={setOpenRequisitionForm} vendabledata={vendabledata} editRow={null}/>
            }
            <IconTextButtonWithTooltip tooltipContent={"Create New Category"} onClick={()=>setOpenRequisitionForm(true)}>
                <UserRoundPlus />
            </IconTextButtonWithTooltip>
        </>
    )
}
