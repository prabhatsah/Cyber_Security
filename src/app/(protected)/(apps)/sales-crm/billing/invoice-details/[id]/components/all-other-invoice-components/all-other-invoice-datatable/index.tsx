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
import { getDateFormat, getFormattedAmountWithDecimal } from "@/ikon/utils/actions/format";
import { InvoiceData } from "@/app/(protected)/(apps)/sales-crm/components/type";


function AllInvoiceDataTable({ invoiceData }: { invoiceData: InvoiceData[] }) {
  
    const columns: DTColumnsProps<InvoiceData>[] = [
        {
            accessorKey: "invoiceNumber",
            header: ({ column }) => (
                <div style={{ textAlign: "center" }}>
                   Invoice Number
                </div>
            ),
            getGroupingValue: (row) => `${row.invoiceNumber}`,
            // cell: (info: any) => (
            //     <Link className="underline" href={"../billing/invoice-details/" + info.row.original.invoiceIdentifier + ""}>
            //         {info.getValue()}
            //     </Link>
            // ),
        },
       
        {
            accessorKey: "deal",
            header: () => <div style={{ textAlign: "center" }}>Deal Name</div>,
            
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

export default AllInvoiceDataTable;
