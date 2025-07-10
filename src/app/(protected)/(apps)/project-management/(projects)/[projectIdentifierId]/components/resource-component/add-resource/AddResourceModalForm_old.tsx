"use client";
import { Form } from "@/shadcn/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import { useForm } from "react-hook-form";
import * as React from 'react';
import { Spreadsheet } from '@progress/kendo-react-spreadsheet';
import { TextButton } from "@/ikon/components/buttons";
import { useThemeOptions } from "@/ikon/components/theme-provider";
import { generateThemeVariables } from "@/ikon/utils/actions/theme/generator";

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectIdentifier: string;
  resourceDataWithAllocation: any[];
  userMaps: UserMaps;
}

interface UserMaps {
  userDetailsMap: any;
  rolesMap: any;
}

// Define the structure for the Kendo Spreadsheet data
interface Cell {
  index?: number;
  value?: string | number;
  fontSize?: number;
  background?: string;
  textAlign?: string;
  color?: string;
  format?: string;
  formula?: string;
  bold?: boolean;
  verticalAlign?: string;
}

interface Row {
  height?: number;
  index?: number;
  cells: Cell[];
}

interface Sheet {
  name: string;
  mergedCells?: string[];
  rows: Row[];
  columns: { width: number }[];
}

type SpreadsheetData = Sheet[];

// Function to get the months range from the resource data
const getMonthsRange = (resourceData: any[]) => {
  if (resourceData.length === 0) return [];

  let allMonths = new Set<string>();

  // Collect all month keys from the allocation objects
  resourceData.forEach((resource) => {
    Object.keys(resource.allocation || {}).forEach((month) => allMonths.add(month));
  });

  // Convert months to Date objects for sorting
  const sortedMonths = Array.from(allMonths)
    .map((monthYear) => {
      const [month, year] = monthYear.split('_');
      return {
        monthYear,
        date: new Date(`${month} 1, ${year}`)
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime()) // Sort by date

    .map(({ monthYear }) => monthYear); // Extract sorted month-year strings

  return sortedMonths;
};

const transformResourceDataToSpreadsheetByTaskName = (resourceData: any[], userNames: any, roles: any): SpreadsheetData => {
  const months = getMonthsRange(resourceData); // Get the dynamic month range
  const { state } = useThemeOptions();
  const theme = generateThemeVariables(state[state.mode], state.mode === 'dark');
  
  // Generate headers for the spreadsheet
  const headers: Cell[] = [
    { value: 'Task Name', background: theme["--primary"], textAlign: 'center', color: theme["--primary-foreground"] },
    { value: 'Employee Name', background: theme["--primary"], textAlign: 'center', color: theme["--primary-foreground"]  },
    { value: 'Role', background: theme["--primary"], textAlign: 'center', color: theme["--primary-foreground"]  },
    { value: 'FTE', background: theme["--primary"], textAlign: 'center', color: theme["--primary-foreground"]  },
    ...months.map(month => ({
      value: month, background: theme["--primary"], textAlign: 'center', color: theme["--primary-foreground"] ,
    })),
  ];

  // Group data by taskName
  const groupedData: { [key: string]: any[] } = resourceData.reduce((acc, resource) => {
    if (!acc[resource.taskName]) acc[resource.taskName] = [];
    acc[resource.taskName].push(resource);
    return acc;
  }, {} as { [key: string]: any[] });

  const rows: Row[] = [];
  let totalFTEPerMonth: number[] = Array(months.length).fill(0); // Store sum of allocations for each month

  // Loop through grouped data
  Object.entries(groupedData).forEach(([taskName, employees]) => {
    // First row of the group (Task Name)
    rows.push({
      cells: [
        { value: taskName, bold: true },
        ...Array(headers.length - 1).fill({}), // Empty cells for alignment
      ],
    });

    let taskSubtotal: number[] = Array(months.length).fill(0); // Store subtotal for each task

    // Rows for each employee under the task
    employees.forEach((employee, index) => {
      const employeeAllocations = months.map(month => employee.allocation?.[month] || 0);
      const totalFTE = employeeAllocations.reduce((sum, value) => sum + value, 0);

      // Update total month-wise FTEs
      totalFTEPerMonth = totalFTEPerMonth.map((sum, i) => sum + employeeAllocations[i]);
      taskSubtotal = taskSubtotal.map((sum, i) => sum + employeeAllocations[i]); // Update task subtotal

      rows.push({
        cells: [
          { value: '', }, // Empty cell for grouping
          { value: employee.employeeName },
          { value: employee.role },
          { value: totalFTE },
          ...employeeAllocations.map(value => ({ value })),
        ],
      });
    });

    // Subtotal row for the current task
    rows.push({
      cells: [
        { value: `Subtotal - ${taskName}`, bold: true, color: theme["--primary"]},
        ...Array(2).fill({}), // Empty cells for alignment
        { value: taskSubtotal.reduce((sum, value) => sum + value, 0), bold: true }, // Subtotal FTE
        ...taskSubtotal.map(value => ({ value, bold: true })), // Month-wise subtotals
      ],
    });

    // **Empty row after Subtotal**
    rows.push({
      cells: Array(headers.length).fill({ value: '' }), // Empty row
    });

  });

  // Add Total Row (Grand Total)
  rows.push({
    cells: [
      { value: 'Total', bold: true, background: theme["--primary"], color: theme["--primary-foreground"] },
      ...Array(2).fill({}), // Empty cells for alignment
      { value: totalFTEPerMonth.reduce((sum, value) => sum + value, 0), bold: true }, // Grand Total FTE
      ...totalFTEPerMonth.map(value => ({ value, bold: true })), // Month-wise totals
    ],
  });

  const sheet: Sheet = {
    name: 'Resource Allocation',
    rows: [
      { height: 25, cells: headers }, // Header row
      ...rows, // Data rows
    ],
    columns: [
      { width: 500 }, // Task Name
      { width: 150 }, // Employee Name
      { width: 200 }, // Role
      { width: 100 }, // FTE Column
      ...months.map(() => ({ width: 150 })), // Allocation columns
    ],
  };

  return [sheet];
};

const ResourceModalOld: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  projectIdentifier,
  resourceDataWithAllocation,
  userMaps,
}) => {
  const form = useForm();
  const [selectedValues, setSelectedValues] = React.useState<{ [taskName: string]: { employeeName: string; role: string } }>({});
  const userNames = Object.values(userMaps.userDetailsMap).map((user: any) => user.userName);
  const roles = userMaps.rolesMap.map((role: any) => role.roleName);

  const updateSelection = (taskName: string, field: "employeeName" | "role", value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [taskName]: {
        ...prev[taskName],
        [field]: value,
      },
    }));
  };

  // Transform the resource data into Kendo Spreadsheet format
  const spreadsheetData = transformResourceDataToSpreadsheetByTaskName(resourceDataWithAllocation, userNames, roles);
  console.log("spreadsheetData", spreadsheetData);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Resource Allocation</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => { })}
            className="grid grid-cols-1 gap-3"
          >
            <Spreadsheet
              style={{
                width: '100%',
                height: '680px',
              }}
              onSelect={(e) => console.log(e)}
              toolbar={false}
              
              defaultProps={{
                sheets: spreadsheetData.map(sheet => ({
                  ...sheet,
                  frozenColumns: 4,
                  frozenRows: 1,
                }))
              }}

            />
          </form>
        </Form>

        <DialogFooter>
          <TextButton>Save</TextButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceModalOld;