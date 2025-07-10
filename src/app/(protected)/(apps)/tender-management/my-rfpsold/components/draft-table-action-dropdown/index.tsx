"use client";
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
import Link from "next/link";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { FilePenLine } from "lucide-react";

interface ActionDropdownProps<T> {
  row: T; // Generic type for row data
  draftId: string;
  onSelectTemplate: (row: T) => void;
  onFinalizeDraft: (row: T) => void;
}

const DraftTableActionDropdown = <T extends { id: string }>({
  row,
  draftId,
  onSelectTemplate,
  onFinalizeDraft,
}: ActionDropdownProps<T>) => {
  console.log("draftId inside action.............", draftId);
  console.log("row inside action.............", row);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 text-center">
            <span className="sr-only">Open menu</span>⋮{" "}
            {/* Icon for dropdown trigger */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Link
            href={{
              pathname: "./Tender",
              query: { draftId: draftId },
            }}
            passHref
          >
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default DraftTableActionDropdown;
