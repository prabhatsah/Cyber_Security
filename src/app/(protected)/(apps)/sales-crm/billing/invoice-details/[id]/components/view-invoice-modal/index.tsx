"use client"
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import ViewInvoiceModal from "./viewInvoiceModal";
import { useState } from "react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Eye, Receipt } from "lucide-react";

export default function ViewInvoice({viewInvoiceContent, quotationDetailsDealTableInvoice} : {viewInvoiceContent : any, quotationDetailsDealTableInvoice: any}) {
    const { openDialog } = useDialog();
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
    return (
        <>
         <IconTextButtonWithTooltip tooltipContent={"Click to View and Download Invoice"} onClick={()=>setIsModalOpen(true)}><Receipt/> Invoice</IconTextButtonWithTooltip>
        <ViewInvoiceModal isOpen={isModalOpen} onClose={handleCloseModal} viewInvoiceContent={viewInvoiceContent} quotationDetailsDealTableInvoice={quotationDetailsDealTableInvoice}/>
        </>
    )
}