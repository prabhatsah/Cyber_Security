'use client'
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { Button } from "@/shadcn/ui/button";
import { SquarePenIcon } from "lucide-react";

interface ExpenseData {
    expenseName: string;
    location: string;
    currency: string;
    cost: number;
    quantity: number;
    description: string;
    totalCost?: number;
    [key: string]: any;
}

export default function ExpenseDataTable({ expenseDetails, onEdit }: { expenseDetails: ExpenseData[]; onEdit: (id: string) => void; }) {

    const columnsProuductDetails: DTColumnsProps<ExpenseData>[] = [
        {
            accessorKey: "expenseName",
            header: () => (
                <div style={{ textAlign: 'center' }}>Expense Name</div>
            ),
        },
        {
            accessorKey: "location", 
            header: () => (
                <div style={{ textAlign: 'center' }}>Location</div>
            ),
        },
        {
            accessorKey: "currency", 
            header: () => (
                <div style={{ textAlign: 'center' }}>Currency</div>
            ),
        },
        {
            accessorKey: "cost", 
            header: () => (
                <div style={{ textAlign: 'center' }}>Cost</div>
            ),
        },
        {
            accessorKey: "quantity", 
            header: () => (
                <div style={{ textAlign: 'center' }}>Quantity</div>
            ),
        },
        {
            accessorKey: "totalCost", 
            header: () => (
                <div style={{ textAlign: 'center' }}>Total Cost</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => (
                <Button onClick={() => onEdit(row.original.uuid)}>
                    <SquarePenIcon />
                </Button>
            ),
        },
    ];
    const extraParams: any = {
        defaultTools: false
    };

    return (
        <DataTable columns={columnsProuductDetails} data={expenseDetails} extraParams={extraParams} />
    );
}
