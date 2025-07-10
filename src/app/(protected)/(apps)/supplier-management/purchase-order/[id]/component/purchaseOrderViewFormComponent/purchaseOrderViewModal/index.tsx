"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { format } from "date-fns";
import { DataTable } from "@/ikon/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface PurchaseOrderViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: any;
}

const PurchaseOrderViewModal: React.FC<PurchaseOrderViewModalProps> = ({
  isOpen,
  onClose,
  purchaseOrder,
}) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (purchaseOrder) {
      setFormData({
        ...purchaseOrder,
        creationDate: format(
          new Date(purchaseOrder.creationDate),
          "dd-MMM-yyyy"
        ),
        delivaryDate: format(
          new Date(purchaseOrder.delivaryDate),
          "dd-MMM-yyyy"
        ),
      });
    }
  }, [purchaseOrder]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "itemId",
      header: () => <div className="text-center">Item Id</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.itemId}</div>
      ),
    },
    {
      accessorKey: "item",
      header: () => <div className="text-center">Item</div>,
      cell: ({ row }) => <div className="text-center">{row.original.item}</div>,
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-center">Quantity</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.quantity}</div>
      ),
    },
    {
      accessorKey: "unitPrice",
      header: () => <div className="text-center">Amount / Quantity</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.original.unitPrice?.toFixed(2)}</div>
      ),
    },
    {
      accessorKey: "discountAmount",
      header: () => <div className="text-center">Discount Amount</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.discountAmount?.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "finalAmount",
      header: () => <div className="text-center">Amount (USD)</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.finalAmount?.toFixed(2)}
        </div>
      ),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Purchase Order</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="border p-4">
            <h3 className="font-bold mb-2">PURCHASER</h3>
            <p>{formData.organitionName || "N/A"}</p>
            <p>{formData.purchaser || "N/A"}</p>
          </div>
          <div className="border p-4">
            <h3 className="font-bold mb-2">SUPPLIER</h3>
            <p>{formData.vendor || "N/A"}</p>
            <p>{formData.vendorContactEmail || "N/A"}</p>
            <p>{formData.vendorContactPhonenumber || "N/A"}</p>
            <p>{formData.vendorAddress || "N/A"}</p>
          </div>
          <div className="border p-4">
            <h3 className="font-bold mb-2">PURCHASE DETAILS</h3>
            <p>Approval Date: {formData.approvalDate || "Invalid date"}</p>
            <p>Creation Date: {formData.creationDate || "N/A"}</p>
            <p>Delivery Date: {formData.delivaryDate || "N/A"}</p>
            <p>Net Total (USD): {formData.totalSum?.toFixed(2) || "0.00"}</p>
          </div>
        </div>

        <div className="mb-4">
          <Label>Remarks:</Label>
          <Input
            value={formData.note || ""}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        </div>

        <div className="mb-2">
          <DataTable
            columns={columns}
            data={
              formData.updateOrderItem
                ? Object.values(formData.updateOrderItem)
                : []
            }
          />
        </div>

        <div className="w-full md:w-64 bg-gray-50 p-4 rounded-lg">
          <div className="space-y-3">
            <div>
              <p className="text-sm">Discount(%)</p>
              <p className="text-right">
                {purchaseOrder.totalDiscount?.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm">Amount excluding VAT</p>
              <p className="text-right">
                {purchaseOrder.totalAmount?.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm">VAT</p>
              <p className="text-right">
                {purchaseOrder.vatAmount?.toFixed(2)}
              </p>
            </div>
            <div className="pt-2 border-t">
              <p className="font-bold">Final Billing Amount</p>
              <p className="text-right font-bold">
                {purchaseOrder.finalAmount?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseOrderViewModal;
