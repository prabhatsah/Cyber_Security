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
import { Check, Columns, PlusCircle, Settings2 } from "lucide-react";
import { DataTableViewOptionsProps } from "../type";
import { getDataTableColumnTitle } from "../function";
import { Tooltip } from "../../tooltip";
import { IconButton, IconTextButton } from "../../buttons";

function DataTableColumnFilter<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <Popover>
      <Tooltip tooltipContent="Column View">
        <PopoverTrigger asChild>
          <IconTextButton>
            <Settings2 />
            View
          </IconTextButton>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent className="w-[220px] p-0" align="end">
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
                  const isVisbile = column.getIsVisible();
                  return (
                    <CommandItem
                      key={column.id}
                      onSelect={() => {
                        column.toggleVisibility(!isVisbile);
                      }}
                      disabled={column.getIsGrouped()}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isVisbile
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
  );
}

export default DataTableColumnFilter;
