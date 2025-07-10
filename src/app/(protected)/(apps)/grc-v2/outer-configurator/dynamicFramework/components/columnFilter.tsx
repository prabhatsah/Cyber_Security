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
import { DataTableViewOptionsProps } from "@/ikon/components/data-table/type";
import { Tooltip } from "@/ikon/components/tooltip";
import { IconTextButton } from "@/ikon/components/buttons";
import { DynamicFieldFrameworkContext } from "../context/dynamicFieldFrameworkContext";

function DataTableFrameworkColumnFilter<TData>({
    table,
}: DataTableViewOptionsProps<TData>) {
    const { frameworkFieldConfigData } = DynamicFieldFrameworkContext();

    const getColumnTitle = (id: string) => {
        const columnNameObj = frameworkFieldConfigData.filter((data)=> data.id===id);
        return columnNameObj[0].name;
    }
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
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-black dark:border-white",
                                                    isVisbile
                                                        ? "bg-black dark:bg-white text-white dark:text-black"
                                                        : "opacity-50 [&_svg]:invisible"
                                                )}
                                            >
                                                <Check />
                                            </div>
                                            <span
                                                className="overflow-hidden text-ellipsis"
                                                title={getColumnTitle(column.id)}
                                            >
                                                {getColumnTitle(column.id)}
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

export default DataTableFrameworkColumnFilter;
