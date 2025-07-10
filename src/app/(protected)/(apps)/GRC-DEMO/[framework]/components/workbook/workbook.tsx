"use client";

import { useState } from "react";
import { Table } from "@/shadcn/ui/table";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Plus, Trash2 } from "lucide-react";

interface WorkbookRow {
  id: string;
  cells: string[];
}

interface WorkbookProps {
  headers: string[];
  initialData?: WorkbookRow[];
  onSave?: (data: WorkbookRow[]) => void;
}

export function Workbook({ headers, initialData = [], onSave }: WorkbookProps) {
  const [rows, setRows] = useState<WorkbookRow[]>(initialData);

  const addRow = () => {
    const newRow: WorkbookRow = {
      id: Math.random().toString(36).substr(2, 9),
      cells: Array(headers.length).fill(""),
    };
    setRows([...rows, newRow]);
  };

  const updateCell = (rowId: string, columnIndex: number, value: string) => {
    setRows(
      rows.map((row) => {
        if (row.id === rowId) {
          const newCells = [...row.cells];
          newCells[columnIndex] = value;
          return { ...row, cells: newCells };
        }
        return row;
      })
    );
  };

  const deleteRow = (rowId: string) => {
    setRows(rows.filter((row) => row.id !== rowId));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(rows);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <thead>
            <tr className="bg-muted/50">
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-3 text-left text-sm font-medium">
                  {header}
                </th>
              ))}
              <th className="w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2">
                    <Input
                      value={cell}
                      onChange={(e) => updateCell(row.id, cellIndex, e.target.value)}
                      className="h-8"
                    />
                  </td>
                ))}
                <td className="px-4 py-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRow(row.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="flex justify-between">
        <Button onClick={addRow} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Row
        </Button>
        <Button onClick={handleSave} size="sm">
          Save Changes
        </Button>
      </div>
    </div>
  );
}