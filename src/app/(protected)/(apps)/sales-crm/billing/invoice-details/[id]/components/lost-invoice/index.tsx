"use client"

import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons"
import { X } from "lucide-react"
import { useState } from "react";
import LostInvoiceModal from "./lostInvoiceModal";

export default function LostInvoice({invoiceIdentifier}:{invoiceIdentifier:string}){
    const { openDialog } = useDialog();
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
    return(
        <>
        <IconTextButtonWithTooltip tooltipContent={"Lost Invoice"} onClick={()=>setIsModalOpen(true)}><X/> Lost</IconTextButtonWithTooltip>
        <LostInvoiceModal isOpen={isModalOpen} onClose={handleCloseModal} invoiceIdentifier={invoiceIdentifier}/>
   
        </>
    )
}