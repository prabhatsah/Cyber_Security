"use client";
import React from "react";
import { DatasetModalProps } from "../../../../components/type";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/shadcn/ui/dialog";
export default function DatasetTypeSelectModal({
  isOpen,
  onClose,
  onDatasetSelect,
}: DatasetModalProps & { onDatasetSelect: (type: string) => void }) {
  function onTypeSelection(type: string) {
    onDatasetSelect(type);
    onClose();
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-sm"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Select Dataset Type</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between w-1/2 mx-auto">
          <div
            className="flex flex-col items-center"
            onClick={() => onTypeSelection("Excel")}
          >
            <img src="/assets/images/excel-icon.png" alt="Excel"></img>
            Excel
          </div>
          <div
            onClick={() => onTypeSelection("CSV")}
            className="flex flex-col items-center"
          >
            <img src="/assets/images/csv-file-icon.png" alt="Excel"></img>
            CSV
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
