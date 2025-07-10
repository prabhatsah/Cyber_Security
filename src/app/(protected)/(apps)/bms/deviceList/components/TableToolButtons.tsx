'use client'

import { TextButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus, Upload, Import } from "lucide-react";
import { FC } from "react";

type TableToolButtonProps = {
    onclick: () => void,
    classes: string
}

export const TableToolButton_Add: FC<TableToolButtonProps> = ({onclick, classes}) => {
    return(
        <>
            <TextButtonWithTooltip variant='outline' onClick={onclick} className={`bg-[#0d0d0d] h-8 ${classes}`} tooltipContent='Add Device'>
                <Plus />
            </TextButtonWithTooltip>
        </>
    )
}

export const TableToolButton_Upload: FC<TableToolButtonProps> = ({onclick, classes}) => {
    return(
        <>
            <TextButtonWithTooltip variant='outline' onClick={onclick} className={`bg-[#0d0d0d] h-8 ${classes}`} tooltipContent='Upload Devices'>
                <Upload />
            </TextButtonWithTooltip>
        </>
    )
}

export const TableToolButton_Import: FC<TableToolButtonProps> = ({onclick, classes}) => {
    return(
        <>
            <TextButtonWithTooltip variant='outline' onClick={onclick} className={`bg-[#0d0d0d] h-8 ${classes}`} tooltipContent='Import Devices'>
                <Import />
            </TextButtonWithTooltip>
        </>
    )
}