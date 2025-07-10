"use client";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import React, { useState } from "react";

import { Button } from "@/shadcn/ui/button";
import { ArrowUpDown, Contact, Eye, Plus, SquarePenIcon } from "lucide-react";
import Link from "next/link";
//import CreateDealButtonWithModal from "../create-deal";
import { format } from "date-fns";
import { VIEW_DATE_TIME_FORMAT } from "@/ikon/utils/config/const";

import { ContactData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import EditContactModal from "@/app/(protected)/(apps)/sales-crm/components/contact-component/edit-contact/EditContactModalForm";

// const getShortAbbreviation = (
//   prodObj: Record<string, { productType: string }>
// ): string => {
//   let shortHandString = "";

//   for (const eachProduct in prodObj) {
//     if (prodObj.hasOwnProperty(eachProduct)) {
//       const productType = prodObj[eachProduct].productType;
//       let productOutput = "";

//       const words = productType.split(" ");
//       for (const word of words) {
//         productOutput += word.charAt(0);
//       }
//       productOutput += "-";
//       shortHandString += productOutput;
//     }
//   }

//   // Remove the trailing '-' and return the result
//   return shortHandString.slice(0, -1);
// };

// Column Schema
//interface SelectedContact { firstName: string; middleName: string; lastName: string; email: string; phoneNo: string; mobileNo: string; department: string; fax: string; address1: string; city: string; state: string; pinCode: string; country: string; contactIdentifier: string; source: string; leadIdentifier: string; } ;


function ContactDataTable({ contactData }: { contactData: ContactData[] }) {
   
    console.log("contactData", contactData);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<ContactData | null>(null);
    const toggleModal = () => {
        setModalOpen((prev) => !prev);
    };
    const handleOpenModalEdit = (contact: ContactData) => {
        console.log("Edit clicked", contact)
        setSelectedContact(contact);
        toggleModal();
        
    }
    const columns: DTColumnsProps<ContactData>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <div style={{ textAlign: "center" }}>
                    Name
                </div>
            ),
            cell: ({ row }) => <span>{row.original.firstName +" "+ row.original.middleName +" "+ row.original.lastName}</span>,
            
        },
        {
            accessorKey: "email",
            header: () => <div style={{ textAlign: "center" }}>Email</div>,
            //cell: ({ row }) => <span>{row.original?.accountManager || "n/a"}</span>,
            
        },
        {
            accessorKey: "phone",
            header: () => <div style={{ textAlign: "center" }}>Mobile Number</div>,
           
        },
        {
            accessorKey: "address",
            header: () => <div style={{ textAlign: "center" }}>Address</div>,
            
        }

    ];
    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
         actionMenu: {
                    items: [
                        {
                            label: "Edit Contact",
                            icon: SquarePenIcon,
                            onClick: (row: any) => {
                                console.log("Edit clicked", row);
                                handleOpenModalEdit(row)
                            }
                        },
                    ]
        }    
       
    };
    return (
        <>
        <DataTable columns={columns} data={contactData} extraParams={extraParams} />
      <EditContactModal isOpen={isModalOpen} onClose={toggleModal} selectedContact={selectedContact} />
        </>
    );
}

export default ContactDataTable;
