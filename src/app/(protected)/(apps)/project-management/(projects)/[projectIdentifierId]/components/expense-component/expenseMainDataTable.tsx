'use client'
import { useEffect, useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import AddExpenseButton from "./addExpenseButton";
import { calculateFxRate } from "@/app/(protected)/(apps)/sales-crm/utils/Fx-Rate/calculateFxRate";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import ComboboxInput from "@/ikon/components/combobox-input";
import NoDataComponent from "@/ikon/components/no-data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import ExpenseModal from "./AddExpenseModal";

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

const expenseVersionArray = [
    { value: "Forecasted", label: "Forecast" },
    { value: "0", label: "Baseline" },
]

export default function ExpenseMainDataTable({ expenseData, projectIdentifier }: { expenseData: ExpenseData[]; projectIdentifier: string }) {

    const [convertedData, setConvertedData] = useState<ExpenseData[]>([]);
    const [expenseVersion, setExpenseVersion] = useState<string>("Forecasted");
    const [editExpenseData,setEditExpenseData] = useState<boolean>(false);
    const [editInstData,setEditInstData] = useState<any>({});


    const handleCloseModal = () => {
        setEditExpenseData(false);
    };
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

    function editTableInstance(expenseDataEdit: any){
        setEditExpenseData(true);
        setEditInstData(expenseDataEdit);
        console.log(expenseDataEdit);
    }

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
        {
            id: "actions",
            cell: ({ row }) => {
              const expenseData = row.original
         
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Button onClick={()=>editTableInstance(expenseData)} className="w-full">Edit</Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            },
        }
    ];

    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
        extraTools: [<AddExpenseButton projectIdentifier={projectIdentifier} editInstData={{}}/>],
    };

    return (
        <>
            <div className="w-[20%] mb-1">
                <ComboboxInput
                    items={expenseVersionArray}
                    placeholder="Please Select the month"
                    onSelect={(selectedVersion: any) => setExpenseVersion(selectedVersion)}
                    defaultValue="Forecasted"
                />
            </div>

            {
                expenseVersion !== '0' ?
                <div className="h-[95%]">
                    <DataTable columns={columnsProductDetails} data={convertedData} extraParams={extraParams} /> 
                </div>: <NoDataComponent />
            }
            {
                editExpenseData &&
                <ExpenseModal isOpen={editExpenseData} onClose={handleCloseModal} projectIdentifier={projectIdentifier} editInstData={editInstData}/>
            }

        </>
    );
}

