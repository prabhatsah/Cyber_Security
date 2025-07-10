"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Trash, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { Switch } from "@/shadcn/ui/switch";
import { DialogDescription } from "@radix-ui/react-dialog";

interface LibraryRow {
  id: number;
  packageName: string;
  packageVersion: string;
}

interface UpdateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  envName?: string;
  envId?: string;
}

export const UpdateLibraryModal: React.FC<UpdateLibraryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  envName,
  envId,
}) => {
  const [rows, setRows] = useState<LibraryRow[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      { id: Date.now(), packageName: "", packageVersion: "" },
    ]);
  };

  const handleRowChange = (
    id: number,
    key: keyof LibraryRow,
    value: string
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const handleDeleteRow = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const filteredRows = rows.filter(
    (row) =>
      row.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.packageVersion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Library List</DialogTitle>
        </DialogHeader>

        {/* Rows */}
        {rows.map((row) => (
          <div key={row.id} className="flex gap-2 mb-2">
            <Input
              placeholder="Enter package name"
              value={row.packageName}
              onChange={(e) =>
                handleRowChange(row.id, "packageName", e.target.value)
              }
            />
            <Input
              placeholder="Enter package version"
              value={row.packageVersion}
              onChange={(e) =>
                handleRowChange(row.id, "packageVersion", e.target.value)
              }
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDeleteRow(row.id)}
            >
              <Trash className="w-16 h-12" />
            </Button>
          </div>
        ))}

        {/* Add Row Button */}
        <Button
          variant="outline"
          onClick={handleAddRow}
          className="mb-4 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add rows
        </Button>

        {/* Search Bar */}
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package Name</TableHead>
              <TableHead>Package Version</TableHead>
              <TableHead>Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.packageName || "N/A"}</TableCell>
                <TableCell>{row.packageVersion || "N/A"}</TableCell>
                <TableCell>
                  <Switch />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setRows([])}>
            Delete Selected
          </Button>
          <Button onClick={() => onConfirm(rows)}>Proceed</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateLibraryModal;
