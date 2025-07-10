"use client";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import { AccountData, InvoiceData } from "../../../../components/type";
import { Button } from "@/shadcn/ui/button";
import { ArrowUpDown, Contact, Eye, Plus, SquarePenIcon } from "lucide-react";
import Link from "next/link";
//import CreateDealButtonWithModal from "../create-deal";
import { format } from "date-fns";
import { VIEW_DATE_TIME_FORMAT } from "@/ikon/utils/config/const";
// import CreateAccountButtonWithModal from "../create-account";
// import { UserIdWiseUserDetailsMapProps } from "@/ikon/utils/actions/users/type";
// import CreateAccountModalForm from "../create-account/components/account-form-definition";
// import ContactModal from "../../../../components/contact-component/add-contact/CreateContactModalForm";
// import ViewContactModal from "../view-contact";
import { UserIdWiseUserDetailsMapProps } from "@/ikon/utils/actions/users/type";
import { getFormattedAmountWithDecimal } from "@/ikon/utils/actions/format";


function InvoiceDataTable({ invoiceData }: { invoiceData: InvoiceData[] }) {
  
    const columns: DTColumnsProps<InvoiceData>[] = [
        {
            accessorKey: "invoiceNumber",
            header: ({ column }) => (
                <div style={{ textAlign: "center" }}>
                   Invoice Number
                </div>
            ),
            getGroupingValue: (row) => `${row.invoiceNumber}`,
            cell: (info: any) => (
                <Link className="underline" href={"../billing/invoice-details/" + info.row.original.invoiceIdentifier + ""}>
                    {info.getValue()}
                </Link>
            ),
        },
        {
            accessorKey: "client",
            header: () => <div style={{ textAlign: "center" }}>Default Contact</div>,
            cell: ({ row }) => {
                return <span>{row.original?.client}</span>;
            },
        },
        {
            accessorKey: "deal",
            header: () => <div style={{ textAlign: "center" }}>Deal Name</div>,
            // cell: ({ row }) => {
            //     return <span>{dealIdWiseDealNameMap[row.original.dealIdentifier]? dealIdWiseDealNameMap[row.original.dealIdentifier] : "n/a"}</span>;
            // },
        },
        {
            accessorKey: "invoicedAmounts",
            header: () => (
                <div style={{ textAlign: "center" }}>Invoiced Amount (USD)</div>
            ),
            cell: ({ row }) => {
                return <span>{getFormattedAmountWithDecimal(row.original.invoicedAmounts)}</span>;
            },
        },
        {
            accessorKey: "accountName",
            header: () => (
                <div style={{ textAlign: "center" }}>Account</div>
            ),
            
        },
        {
            accessorKey: "accountManager",
            header: () => (
                <div style={{ textAlign: "center" }}>Account Manager</div>
            ),
            
        },
        {
            accessorKey: "invoiceDates",
            header: () => (
                <div style={{ textAlign: "center" }}>Invoice Date</div>
            ),
            
        },
        {
            accessorKey: "receiptDates",
            header: () => (
                <div style={{ textAlign: "center" }}>Due Date</div>
            ),
        },
        {
            accessorKey: "invoiceStatus",
            header: () => (
                <div style={{ textAlign: "center" }}>Status</div>
            ),
        }
        // {
        //     accessorKey: "updatedOn",
        //     header: () => <div style={{ textAlign: "center" }}>Updated On</div>,
        //     cell: ({ row }) => {
        //         const formattedDate =
        //             (row?.original?.updatedOn &&
        //                 format(row.original.updatedOn, VIEW_DATE_TIME_FORMAT)) ||
        //             "n/a";
        //         return <span>{formattedDate}</span>;
        //     },
        // }

    ];
    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
        
    };
    return (
        <>
        <DataTable columns={columns} data={invoiceData} extraParams={extraParams} />
       
        </>
    );
}

export default InvoiceDataTable;
