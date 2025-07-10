'use client'
import { useEffect, useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import AddExpenseButton from "./addExpenseButton";
import { calculateFxRate } from "@/app/(protected)/(apps)/sales-crm/utils/Fx-Rate/calculateFxRate";

export interface ExpenseData {
    id: string;
    expenseName: string;
    location: string;
    currency: string;  // Currency should be a string (e.g., "INR", "USD")
    cost: number;
    quantity: number;
    description?: string;
    totalCost?: number;
    totalCostUSD?: number;  // New field for converted cost
}

export default function ExpenseMainDataTable({ expenseData, productIdentifier }: { expenseData: ExpenseData[]; productIdentifier: string }) {
    const [convertedData, setConvertedData] = useState<ExpenseData[]>([]);

    useEffect(() => {
        const convertCurrency = async () => {
            const updatedData = await Promise.all(expenseData.map(async (item) => {
                const fxRate = await calculateFxRate(item.currency, "USD");

                // Calculate total cost if missing
                const totalCost = item.totalCost ?? (item.cost * item.quantity);

                return { 
                    ...item, 
                    totalCost, 
                    totalCostUSD: totalCost * fxRate 
                };
            }));
            setConvertedData(updatedData);
        };

        convertCurrency();
    }, [expenseData]);

    const columnsProductDetails: DTColumnsProps<ExpenseData>[] = [
        { accessorKey: "expenseName", header: () => <div style={{ textAlign: 'center' }}>Expense Name</div> },
        { accessorKey: "location", header: () => <div style={{ textAlign: 'center' }}>Location</div> },
        { accessorKey: "currency", header: () => <div style={{ textAlign: 'center' }}>Currency</div> },
        { accessorKey: "cost", header: () => <div style={{ textAlign: 'center' }}>Cost</div> },
        { accessorKey: "quantity", header: () => <div style={{ textAlign: 'center' }}>Quantity</div> },
        { accessorKey: "totalCost", header: () => <div style={{ textAlign: 'center' }}>Total Cost</div> },
        {
            accessorKey: "totalCostUSD",
            header: () => <div style={{ textAlign: 'center' }}>Total Cost (USD)</div>,
            cell: ({ row }) => <span>{row.original.totalCostUSD?.toFixed(2) || "Loading..."}</span>,
        },
    ];

    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
        extraTools: [<AddExpenseButton productIdentifier={productIdentifier} />],
    };

    return (
        <DataTable columns={columnsProductDetails} data={convertedData} extraParams={extraParams} />
    );
}

