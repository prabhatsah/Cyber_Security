import { TextButtonWithTooltip } from "@/ikon/components/buttons"
import { Plus, Trash, Settings, Play, History, BookX } from "lucide-react"
import { FC } from "react"
import { TableToolButtonProps } from "../types"

export const TableToolButton_Add: FC<TableToolButtonProps> = ({ onclick, classes }) => {
    return(
        <>
            <TextButtonWithTooltip variant='outline' onClick={onclick} className={`bg-[#0d0d0d] h-8 ${classes}`} tooltipContent='Add Device'>
                <Plus />
            </TextButtonWithTooltip>
        </>
    )
}

export const TableToolButton_Delete: FC<TableToolButtonProps> = ({ onclick, classes }) => {
    return(
        <>
            <TextButtonWithTooltip variant='outline' onClick={onclick} className={`bg-[#0d0d0d] h-8 ${classes}`} tooltipContent='Delete Device'>
                <Trash />
            </TextButtonWithTooltip>
        </>
    )
}

export const TableToolButton_StartDiscovery: FC<TableToolButtonProps> = ({ onclick, classes }) => {
    return(
        <>
            <TextButtonWithTooltip variant='outline' onClick={onclick} className={`bg-[#0d0d0d] h-8 ${classes}`} tooltipContent='Start discovery'>
                <Play />
            </TextButtonWithTooltip>
        </>
    )
}

export const TableToolButton_ConfigureDevice: FC<TableToolButtonProps> = ({ onclick, classes }) => {
    return(
        <>
            <TextButtonWithTooltip variant='outline' onClick={onclick} className={`bg-[#0d0d0d] h-8 ${classes}`} tooltipContent='Configure device'>
                <Settings />
            </TextButtonWithTooltip>
        </>
    )
}

export const TableToolButton_DeletedDeviceHistory: FC<TableToolButtonProps> = ({ onclick, classes }) => {
    return(
        <>
            <TextButtonWithTooltip variant='outline' onClick={onclick} className={`bg-[#0d0d0d] h-8 ${classes}`} tooltipContent='Deleted device history'>
                <BookX />
            </TextButtonWithTooltip>
        </>
    )
}

export const TableToolButton_DiscoverHistory: FC<TableToolButtonProps> = ({ onclick, classes }) => {
    return(
        <>
            <TextButtonWithTooltip variant='outline' onClick={onclick} className={`bg-[#0d0d0d] h-8 ${classes}`} tooltipContent='Discovery history'>
                <History />
            </TextButtonWithTooltip>
        </>
    )
}