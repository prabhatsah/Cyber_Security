"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shadcn/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { cn } from "@/shadcn/lib/utils";
import { DataTableFilterProps } from "../type";
import { useState } from "react";
import { Tooltip } from "../../tooltip";
import { IconButton, IconTextButton } from "../../buttons";
import { Check, Filter } from "lucide-react";
import { getDataTableColumnTitle } from "../function";
import DataTableFacetedFilter from "../datatable-faceted-filter";

function DataTableFilterMenu<TData>({ table }: DataTableFilterProps<TData>) {
  const [selectedFilterItems, setSelectedFilterItems] = useState<string[]>([]);

  return (
    <div className="flex-grow flex gap-3 items-center overflow-hidden">
      <Popover>
        <Tooltip tooltipContent="Filter">
          <PopoverTrigger asChild>
            <IconTextButton>
              <Filter />
              Filter
            </IconTextButton>
          </PopoverTrigger>
        </Tooltip>
        <PopoverContent className="w-[220px] p-0" align="start">
          <Command>
            <CommandInput placeholder={"Search..."} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    const previousValues = new Set(selectedFilterItems);
                    const isSelected = previousValues.has(column.id);
                    return (
                      <CommandItem
                        key={column.id}
                        onSelect={() => {
                          if (isSelected) {
                            previousValues.delete(column.id);
                          } else {
                            previousValues.add(column.id);
                          }
                          setSelectedFilterItems([...previousValues]);
                        }}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <Check />
                        </div>
                        <span
                          className="overflow-hidden text-ellipsis"
                          title={getDataTableColumnTitle(column)}
                        >
                          {getDataTableColumnTitle(column)}
                        </span>
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex-grow flex gap-3 items-center overflow-auto">
        {selectedFilterItems.map((columnId) => {
          const column = table.getColumn(columnId);
          if (column) {
            return <DataTableFacetedFilter column={column} key={columnId} />;
          }
        })}
      </div>
    </div>
  );
}

export default DataTableFilterMenu;
