"use client"

import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/shadcn/ui/dialog";
import { m } from "framer-motion";
import { useEffect, useState } from "react";
import ContactDataTable from "./view-contact-datatable";


interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    accountId?: any | undefined;
}

const ViewContactModal: React.FC<ContactModalProps> = ({
    isOpen,
    onClose,
    accountId
}) => {
    console.log('accountId', accountId)
    const [contactData, setContactData] = useState<any[]>([]);
    useEffect(() => {
        const fetchContactData = async () => {
            console.log("accountId", accountId);
             const contactInsData = await getMyInstancesV2({
                processName: "Contact",
                predefinedFilters: { taskName: "View Contact" },
                projections: ["Data"],
                mongoWhereClause: `this.Data.accountIdentifier == "${accountId}"`,
              });
            
              const contactDetails = contactInsData.map((e: any) => e.data);
              console.log('contactDetails', contactDetails)
              setContactData(contactDetails);
        }
        fetchContactData();
    }, [accountId])
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()} >
                <DialogHeader>
                    <DialogTitle>View Contact</DialogTitle>
                </DialogHeader>
                <div>
                <ContactDataTable contactData={contactData}/>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ViewContactModal;