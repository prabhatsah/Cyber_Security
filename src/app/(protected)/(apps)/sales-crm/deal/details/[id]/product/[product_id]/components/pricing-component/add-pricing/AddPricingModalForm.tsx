import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel,FormMessage} from "@/shadcn/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { useForm } from "react-hook-form";
import { PricingTableData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";
import { InvokePricingData } from "../invoke-pricing/InvokePricingData";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricingData: any;
  productIdentifier: string;
}

const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  productIdentifier,
  pricingData,
}) => {
  const [pricingDataArray, setPricingDataArray] = useState<PricingTableData[]>(
    () => {
      const initialData = Object.values(pricingData).map((item, index) => {
        if (typeof item === "object" && item !== null) {
          return {
            ...item,
          //  id: `row-${index}`, // Add unique identifier to each row
          };
        }
      //  return { id: `row-${index}` }; // Handle non-object items
      });
      const totalObject: any = initialData.reduce(
        (acc: { [key in keyof PricingTableData]?: number }, obj: any) => {
          Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === "number") {
              acc[key as keyof PricingTableData] =
                (acc[key as keyof PricingTableData] || 0) +
                obj[key as keyof PricingTableData];
            }
          });
          return acc;
        },
        {}
      );
      totalObject.role = "Total";
      totalObject.id = "total-row"; // Unique ID for the total row
      return [...initialData, totalObject];
    }
  );

  const handleInputChange = (
    id: string,
    key: keyof PricingTableData,
    value: number
  ) => {
    setPricingDataArray((prev) => {
      const updatedData = prev.map((row) => {
        if (row.id === id && row.role !== "Total") {
          // Update the value for the specific key
          row[key] = value;

          // Recalculate Billing Amount
          row.billingAmount =
            (row.totalFTE || 0) * (row.scr || 0) + // FTE * SCR
            (row.expenses || 0) +
            (row.otherCosts || 0);
        }
        return row;
      });

      // Update total row
      const totalRow = updatedData.find((row) => row.id === "total-row");
      if (totalRow) {
        Object.keys(totalRow).forEach((k) => {
          if (k !== "role" && k !== "id" && k !== "billingAmount") {
            totalRow[k] = updatedData
              .filter((row) => row.id !== "total-row")
              .reduce((sum, curr) => sum + (curr[k] || 0), 0);
          }
        });

        // Recalculate the total billingAmount
        totalRow.billingAmount = updatedData
          .filter((row) => row.id !== "total-row")
          .reduce(
            (sum, curr) =>
              sum +
              ((curr.totalFTE || 0) * (curr.scr || 0) +
                (curr.expenses || 0) +
                (curr.otherCosts || 0)),
            0
          );
      }

      return updatedData;
    });
  };

  const columnsPricingTable: DTColumnsProps<PricingTableData>[] = [
    {
      accessorKey: "role",
      header: () => <div style={{ textAlign: "center" }}>Role</div>,
    },
    {
      accessorKey: "totalFTE",
      header: () => <div style={{ textAlign: "end" }}>FTE</div>,
      cell: ({ row }) => (<span>{row.original.totalFTE}</span>)
      // cell: ({ row }) =>
      //     <Input value={row.original.totalFTE} type="number" disabled />
        
    },
    {
      accessorKey: "scr",
      header: () => <div style={{ textAlign: "end" }}>SCR</div>,
      cell: ({ row }) =>
        row.original.role !== "Total" ? (
          <Input
            value={row.original.scr}
            type="number"
            placeholder="SCR"
            onChange={(e) =>
              handleInputChange(
                row.original.id,
                "scr",
                parseFloat(e.target.value) || 0
              )
            }
          />
        ) : (
          <Input value={row.original.scr} type="number" disabled />
        ),
    },
    {
      accessorKey: "expenses",
      header: () => <div style={{ textAlign: "end" }}>Expenses</div>,
      cell: ({ row }) => (<span>{row.original.expenses}</span>)
        // row.original.role !== "Total" ? (
        //   <Input
        //     value={row.original.expenses}
        //     type="number"
        //     placeholder="Expenses"
        //     onChange={(e) =>
        //       handleInputChange(
        //         row.original.id,
        //         "expenses",
        //         parseFloat(e.target.value) || 0
        //       )
        //     }
        //   />
        // ) : (
        //   <Input value={row.original.expenses} type="number" disabled />
        // ),
    },
    {
      accessorKey: "otherCosts",
      header: () => <div style={{ textAlign: "end" }}>Other Costs</div>,
      cell: ({ row }) =>
        row.original.role !== "Total" ? (
          <Input
            value={row.original.otherCosts}
            type="number"
            placeholder="Other Costs"
            onChange={(e) =>
              handleInputChange(
                row.original.id,
                "otherCosts",
                parseFloat(e.target.value) || 0
              )
            }
          />
        ) : (
          <Input value={row.original.otherCosts} type="number" disabled />
        ),
    },
    {
      accessorKey: "billingAmount",
      header: () => <div style={{ textAlign: "end" }}>Billing Amount</div>,
      cell: ({ row }) => (
        <Input value={row.original.billingAmount} type="number" disabled />
      ),
    },
  ];

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
  };

  const form = useForm();

  const submitPricing = () => {
      const pricingObj: { [key: string]: PricingTableData } = {};
      for (let i = 0; i < pricingDataArray.length; i++) {
          if (pricingDataArray[i].role !== "Total") {
              pricingObj[pricingDataArray[i].id] = pricingDataArray[i];
          }
      }
      console.log("Pricing data", pricingObj);
      InvokePricingData(productIdentifier, pricingObj);
      onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
            <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>Pricing</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(()=>{})} className="grid grid-cols-1 gap-3">
             
                         <DataTable columns={columnsPricingTable} data={pricingDataArray} extraParams={extraParams} />
                        <DialogFooter>
                            <Button type="submit" onClick={submitPricing}>
                                Submit
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default PricingModal;
