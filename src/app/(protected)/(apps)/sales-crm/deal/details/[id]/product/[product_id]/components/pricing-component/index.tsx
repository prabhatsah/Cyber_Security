"use client"
import { PricingTableData } from "@/app/(protected)/(apps)/sales-crm/components/type";
//import ButtonWithTooltip from "@/ikon/components/buttonWithTooltip";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { Button } from "@/shadcn/ui/button";
import { Link, Plus } from "lucide-react";
import { useState } from "react";
import PricingModal from "./add-pricing/AddPricingModalForm";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";

export default function PricingComponent({ pricingData, productIdentifier }: { pricingData: {} , productIdentifier: string}) {
    const [isModalOpen, setModalOpen] = useState(false);
    const pricingDataArray: PricingTableData[] = Object.values(pricingData);
    console.log("pricingDataArray", pricingDataArray)
    const columnsPricingTable: DTColumnsProps<PricingTableData>[] = [
        {
            accessorKey: "role",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Role
                </div>
            ),
           
        }, {
            accessorKey: "totalFTE",
            header: () => (
                <div style={{ textAlign: 'end' }}>
                    FTE
                </div>
            )
        },
        {
            accessorKey: "scr",
            header: () => (
                <div style={{ textAlign: 'end' }}>
                    scr
                </div>
            )
        },
        {
            accessorKey: "expenses",
            header: () => (
                <div style={{ textAlign: 'end' }}>
                    Expenses
                </div>
            ),
            cell: ({ row }) => <span>{row.original?.expenses?.toFixed(2) ?? "n/a"}</span>,
        },
        {
            accessorKey: "otherCosts",
            header: () => (
                <div style={{ textAlign: 'end' }}>
                    Other Costs
                </div>
            ),
            cell: ({ row }) => <span>{row.original?.otherCosts?.toFixed(2) || "n/a"}</span>,
        },
        {
            accessorKey: "billingAmount",
            header: () => (
                <div style={{ textAlign: 'end' }}>
                    Billing Amount
                </div>
            ),
            cell: ({ row }) => <span>{row.original?.billingAmount?.toFixed(2) || "n/a"}</span>,
        },

    ];
    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
        extraTools: [<IconButtonWithTooltip tooltipContent="Add Pricing"  onClick={() => { setModalOpen(true)}} ><Plus/></IconButtonWithTooltip>],
    };
    return (
        <>
            <div className="flex flex-col gap-3 h-full w-full">
              
                <DataTable columns={columnsPricingTable} data={pricingDataArray} extraParams={extraParams} />
            </div>
            <PricingModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} pricingData={pricingData} productIdentifier={productIdentifier}/>
        </>
    )
}