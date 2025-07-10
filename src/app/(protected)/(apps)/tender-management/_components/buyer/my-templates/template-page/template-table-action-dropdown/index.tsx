'use client'
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";

interface ActionDropdownProps<T> {
  row: T; // Generic type for row data
  onEdit: (row: T) => void;
}

const TemplateTableActionDropdown = <T extends { templateId: string }>({
    row,
    onEdit,
} : ActionDropdownProps<T>) => {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>⋮{" "}
              {/* Icon for dropdown trigger */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(row)}>
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
}

export default TemplateTableActionDropdown;