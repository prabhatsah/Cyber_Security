import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shadcn/ui/form";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FormComboboxInputProps } from "@/ikon/components/form-fields/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { Button } from "@/shadcn/ui/button";
import { cn } from "@/shadcn/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/shadcn/ui/command";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shadcn/ui/tooltip";
import { X } from "lucide-react";

export default function FormMultiComboboxInput({
    formControl,
    name,
    label,
    placeholder,
    formDescription,
    items = [], // fallback to empty array
    disabled,
    onSelect,
    defaultValue = [],
}: FormComboboxInputProps) {
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    debugger
    // Filter items based on search
    const filteredItems = items.filter((item) =>
        item.label?.toLowerCase().includes(search.toLowerCase())
    )
        .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""));



    return (
        <FormField
            control={formControl}
            name={name}
            render={({ field }) => {
                // Initialize defaultValue if field.value is undefined
                useEffect(() => {
                    if (
                        (field.value === undefined || field.value === null) &&
                        defaultValue.length > 0
                    ) {
                        field.onChange(defaultValue);
                    }
                }, [defaultValue, field]);

                // field.value is the selected array, default to [] if undefined
                const selectedItems = field.value || [];
                const [visibleCount, setVisibleCount] = useState(selectedItems.length);

                const calculateVisibleItems = useCallback(() => {
                    const container = containerRef.current;
                    if (!container) return visibleCount;
                    debugger
                    const children = Array.from(container.children) as HTMLElement[];

                    let availableWidth = container.offsetWidth;
                    let usedWidth = 0;
                    let fitCount = 0;

                    for (const child of children) {
                        const childWidth = child.offsetWidth + 4; // gap/margin
                        if (usedWidth + childWidth <= availableWidth) {
                            usedWidth += childWidth;
                            fitCount++;
                        } else {
                            break;
                        }
                    }

                    return fitCount;
                }, []); // No dependencies

                useEffect(() => {
                    const container = containerRef.current;
                    if (!container) return;

                    let animationFrameId: number | null = null;

                    const resizeObserver = new ResizeObserver(() => {
                        if (animationFrameId) cancelAnimationFrame(animationFrameId);
                        animationFrameId = requestAnimationFrame(() => {
                            const newVisibleCount = calculateVisibleItems();
                            setVisibleCount((prevVisibleCount:number) => {
                                debugger
                                if (prevVisibleCount !== newVisibleCount) {
                                    return newVisibleCount;
                                }
                                return prevVisibleCount;
                            });
                        });
                    });

                    resizeObserver.observe(container);

                    // Initial calculation
                    setVisibleCount(calculateVisibleItems());

                    // Cleanup
                    return () => {
                        if (animationFrameId) cancelAnimationFrame(animationFrameId);
                        resizeObserver.disconnect();
                    };
                }, [calculateVisibleItems]); // Only depend on calculateVisibleItems

                // Toggle select/unselect item
                const toggleItem = (value: string) => {
                    let updatedItems;
                    if (selectedItems.includes(value)) {
                        updatedItems = selectedItems.filter((v: string) => v !== value);
                    } else {
                        updatedItems = [...selectedItems, value];
                    }
                    field.onChange(updatedItems);
                    onSelect && onSelect(updatedItems);
                };

                const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
                    const el = e.currentTarget;
                    el.scrollTop += e.deltaY; // manually scroll
                    e.preventDefault(); // prevent parent scroll
                };

                return (
                    <FormItem>
                        {label && <FormLabel>{label}</FormLabel>}

                        <Popover>
                            <PopoverTrigger asChild className="w-full">
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "justify-between",
                                            !selectedItems.length && "text-muted-foreground"
                                        )}
                                        disabled={
                                            disabled === true || (disabled && disabled(...arguments))
                                        }
                                    >
                                        {selectedItems.length > 0 ? (
                                            <TooltipProvider>
                                                <div ref={containerRef} className="flex flex-wrap gap-2 items-center max-w-[80%] overflow-hidden">
                                                    {selectedItems.slice(0, 3).map((value: string) => {
                                                        const label = items.find((item) => item.value === value)?.label || value;
                                                        return (
                                                            <span
                                                                key={value}
                                                                className="flex items-center px-2 py-1 bg-secondary text-secondary-foreground rounded-md truncate max-w-full"
                                                                title={label}
                                                            >
                                                                <span className="truncate max-w-[120px]">{label}</span>
                                                                <span
                                                                    role="button"
                                                                    tabIndex={0}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // prevent popover toggle
                                                                        const updated = selectedItems.filter((v: string) => v !== value);
                                                                        field.onChange(updated);
                                                                        onSelect && onSelect(updated);
                                                                    }}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            const updated = selectedItems.filter((v: string) => v !== value);
                                                                            field.onChange(updated);
                                                                            onSelect && onSelect(updated);
                                                                        }
                                                                    }}
                                                                    className="ml-1 text-muted-foreground hover:text-destructive cursor-pointer outline-none"
                                                                >
                                                                    <X className="w-3 h-3 ml-1" />
                                                                </span>
                                                            </span>
                                                        );
                                                    })}

                                                    {selectedItems.length > 3 && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md cursor-pointer">
                                                                    +{selectedItems.length - 3} more
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="max-w-xs break-words">
                                                                <div
                                                                    onWheel={onWheel}
                                                                    className="flex flex-col gap-1 max-h-[200px] overflow-auto"
                                                                >
                                                                    {selectedItems.slice(3).map((value: string) => (
                                                                        <span key={value} className="text-sm">
                                                                            {items.find((item) => item.value === value)?.label || value}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </TooltipProvider>
                                        ) : (
                                            placeholder
                                        )}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>

                            <PopoverContent id="multiSelectPopover" className="p-0 w-full max-w-[300px]" align="start">
                                <Command id="commandPopover">
                                    <CommandInput
                                        placeholder="Search..."
                                        value={search}
                                        onValueChange={setSearch}
                                        autoFocus
                                    />
                                    <CommandList
                                        className="max-h-60 overflow-auto"
                                        onWheel={onWheel}
                                    >
                                        <CommandEmpty>No items found.</CommandEmpty>
                                        <CommandGroup>
                                            {filteredItems.map((item) => {
                                                const isSelected = selectedItems.includes(item.value);
                                                return (
                                                    <CommandItem
                                                        value={item.label ?? ""}
                                                        key={item.value}
                                                        onSelect={() => toggleItem(item.value)}
                                                    >
                                                        {item.label}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                isSelected ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {formDescription && (
                            <FormDescription>{formDescription}</FormDescription>
                        )}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}
