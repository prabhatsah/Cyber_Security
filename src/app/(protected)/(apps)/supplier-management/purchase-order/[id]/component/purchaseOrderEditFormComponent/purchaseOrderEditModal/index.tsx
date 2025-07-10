"use client";
import React, { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Form } from "@/shadcn/ui/form";
import FormInput from "@/ikon/components/form-fields/input";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { v4 as uuid } from "uuid";
import { POEditFormInvoke } from "../purchaseOrderEditModalInvoke";

interface Item {
  item: string;
  itemId: string;
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  discountAmount: number;
  finalAmount: number;
}

const formSchema = z.object({
  discount: z.string().optional(),
  vatRate: z.string().optional(),
});

interface EditPurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseData: any;
  itemData: any[];
}

const EditPurchaseOrderModal: React.FC<EditPurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  purchaseData,
  itemData = [],
}) => {
  const [items, setItems] = useState<Item[]>(() => {
    const hasPurchaseItems =
      purchaseData?.purchaseData?.[0]?.purchaseOrderObj?.length > 0;

    if (hasPurchaseItems) {
      return purchaseData.purchaseData[0].purchaseOrderObj.map((item: any) => ({
        itemId: item.itemId || "undefined",
        item: item.item || "",
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        discount: item.discount || 0,
        total: item.total || 0,
        discountAmount: item.discountAmount || 0,
        finalAmount: item.finalAmount || 0,
      }));
    } else {
      return [
        {
          itemId: "undefined",
          item: "",
          quantity: 0,
          unitPrice: 0,
          discount: 0,
          total: 0,
          discountAmount: 0,
          finalAmount: 0,
        },
      ];
    }
  });

  const [totals, setTotals] = useState({
    subTotal: 0,
    discountAmount: 0,
    totalBeforeVat: 0,
    vatAmount: 0,
    finalTotal: 0,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discount: "0",
      vatRate: "0",
    },
  });

  const calculateTotals = useCallback(() => {
    const updatedItems = items.map((item) => {
      const total = item.quantity * item.unitPrice;
      const discountAmount = (total * item.discount) / 100;
      const finalAmount = total - discountAmount;
      return { ...item, total, discountAmount, finalAmount };
    });

    const subTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const itemDiscounts = updatedItems.reduce(
      (sum, item) => sum + item.discountAmount,
      0
    );
    const totalBeforeVat = subTotal - itemDiscounts;

    const discountPercentage = parseFloat(form.watch("discount") || "0");
    const additionalDiscount = (totalBeforeVat * discountPercentage) / 100;
    const totalAfterAdditionalDiscount = totalBeforeVat - additionalDiscount;

    const vatRate = parseFloat(form.watch("vatRate") || "0");
    const vatAmount = (totalAfterAdditionalDiscount * vatRate) / 100;
    const finalTotal = totalAfterAdditionalDiscount + vatAmount;

    return {
      updatedItems,
      totals: {
        subTotal,
        discountAmount: itemDiscounts + additionalDiscount,
        totalBeforeVat: totalAfterAdditionalDiscount,
        vatAmount,
        finalTotal,
      },
    };
  }, [items, form.watch("discount"), form.watch("vatRate")]);

  useEffect(() => {
    const { updatedItems, totals: newTotals } = calculateTotals();

    if (JSON.stringify(updatedItems) !== JSON.stringify(items)) {
      setItems(updatedItems);
    }

    if (JSON.stringify(newTotals) !== JSON.stringify(totals)) {
      setTotals(newTotals);
    }
  }, [calculateTotals, items, totals]);

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "itemId",
      header: "Item ID",
      cell: ({ row }) => (
        <div className="text-center">{row.original?.itemId}</div>
      ),
    },
    {
      accessorKey: "item",
      header: "Item",
      cell: ({ row }) => (
        <div className="text-center">{row.original?.item || "undefined"}</div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => (
        <input
          type="number"
          value={row.original.quantity}
          onChange={(e) => {
            const newItems = [...items];
            newItems[row.index].quantity = parseFloat(e.target.value) || 0;
            setItems(newItems);
          }}
          className="w-full text-center border rounded px-2 py-1"
        />
      ),
    },
    {
      accessorKey: "unitPrice",
      header: "Unit Price",
      cell: ({ row }) => (
        <input
          type="number"
          value={row.original.unitPrice}
          onChange={(e) => {
            const newItems = [...items];
            newItems[row.index].unitPrice = parseFloat(e.target.value) || 0;
            setItems(newItems);
          }}
          className="w-full text-center border rounded px-2 py-1"
        />
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.total.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      ),
    },
    {
      accessorKey: "discount",
      header: "Discount (%)",
      cell: ({ row }) => (
        <input
          type="number"
          value={row.original.discount}
          onChange={(e) => {
            const newItems = [...items];
            newItems[row.index].discount = parseFloat(e.target.value) || 0;
            setItems(newItems);
          }}
          className="w-full text-center border rounded px-2 py-1"
        />
      ),
    },
    {
      accessorKey: "discountAmount",
      header: "Discount Amount",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.discountAmount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      ),
    },
    {
      accessorKey: "finalAmount",
      header: "Final Amount",
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.finalAmount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      ),
    },
  ];

  const onSubmit = async (data: any) => {
    const updaetOrderItem: Record<string, any> = {};

    items.forEach((item) => {
      updaetOrderItem[uuid()] = {
        itemId: item.itemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        discount: item.discount,
        discountAmount: item.discountAmount,
        finalAmount: item.finalAmount,
        item: item.item,
      };
    });

    const formData = {
      creationDate: purchaseData?.purchaseData[0]?.creationDate || new Date().toISOString(),
      delivaryDate: purchaseData?.purchaseData[0]?.delivaryDate || "",
      note: purchaseData?.purchaseData[0]?.note || "",
      payment_terms: purchaseData?.purchaseData[0]?.payment_terms || "",
      purchaseOrderId: purchaseData?.purchaseData[0]?.purchaseOrderId || "",
      purchaseOrderObj: purchaseData?.purchaseData[0]?.purchaseOrderObj || [],
      purchaser: purchaseData?.purchaseData[0]?.purchaser || {},
      vendor: purchaseData?.purchaseData[0]?.vendor || {},
      updaetOrderItem,
      saveCheck: 2,
      totalSum: totals.subTotal,
      totalDiscount: parseFloat(data.discount) || 0,
      totalDiscountAmount: totals.discountAmount,
      totalAmount: totals.totalBeforeVat,
      vatPercent: parseFloat(data.vatRate) || 0,
      vatAmount: totals.vatAmount,
      finalAmount: totals.finalTotal,
      gstOrVat:
      purchaseData?.purchaseData[0]?.selVatGst === "gst"
          ? "GST"
          : purchaseData?.purchaseData[0]?.["selVatGst-manually"] === "gst"
          ? "GST"
          : "VAT",
    };

    console.log("Form data to po submit:", formData);
    await POEditFormInvoke(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit Purchase Order</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-6">
              <DataTable columns={columns} data={items} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex justify-between items-center">
                <label className="font-medium">Discount (%):</label>
                <FormInput
                  formControl={form.control}
                  type="number"
                  name="discount"
                  className="w-24 text-right"
                />
              </div>

              <div className="flex justify-between">
                <label className="font-medium">
                  Discounted Billing Amount (USD):
                </label>
                <span>{totals.totalBeforeVat.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <label className="font-medium">VAT (%):</label>
                <FormInput
                  formControl={form.control}
                  type="number"
                  name="vatRate"
                  className="w-24 text-right"
                />
              </div>

              <div className="flex justify-between">
                <label className="font-medium">VAT Amount (USD):</label>
                <span>{totals.vatAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between border-t pt-4">
              <label className="font-bold text-lg">
                Final Billing Amount (USD):
              </label>
              <span className="font-bold text-lg">
                {totals.finalTotal.toFixed(2)}
              </span>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPurchaseOrderModal;
