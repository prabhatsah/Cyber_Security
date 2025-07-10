"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/shadcn/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { Checkbox } from "@/shadcn/ui/checkbox";

export interface Option {
  id: string;
  label: string;
  description?: string;
}

export interface OptionGroup {
  id: string;
  label: string;
  options: Option[];
}

interface GroupedCheckboxDropdownProps {
  groups: OptionGroup[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  addNewItemLabel?: string;
  onAddNewItem?: () => void;
  multiSelect?: boolean;
  disabled?: boolean;
}

export function GroupedCheckboxDropdown({
  groups,
  value,
  onChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search options...",
  addNewItemLabel,
  onAddNewItem,
  multiSelect = true,
  disabled = false,
}: GroupedCheckboxDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSelect = (optionId: string) => {
    if (disabled) return;
    if (multiSelect) {
      onChange(
        value.includes(optionId)
          ? value.filter((v) => v !== optionId)
          : [...value, optionId]
      );
    } else {
      onChange([optionId]);
      setOpen(false);
    }
  };

  const getSelectedLabel = () => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      for (const group of groups) {
        const option = group.options.find((opt) => opt.id === value[0]);
        if (option) return option.label;
      }
    }
    return `${value.length} items selected`;
  };

  return (
    <Popover open={open} onOpenChange={(val) => !disabled && setOpen(val)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          // className="w-full justify-between"
          className={cn(
            "w-full justify-between",
            !value.length && "text-foreground/50"
          )}
          disabled={disabled}
        >
          <span className="truncate">{getSelectedLabel()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" hidden={disabled}>
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            disabled={disabled}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {groups.map((group) => {
              const filteredOptions = group.options.filter(
                (option) =>
                  option?.label.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
                  option?.description?.toLowerCase()?.includes(searchQuery.toLowerCase())
              );

              if (filteredOptions.length === 0) return null;

              return (
                <React.Fragment key={group.id}>
                  <CommandGroup heading={group.label}>
                    {filteredOptions.map((option) => {
                      const isSelected = value.includes(option.id);
                      return (
                        <CommandItem
                          key={option.id}
                          onSelect={() => handleSelect(option.id)}
                          className="flex items-start py-2"
                          disabled={disabled}
                        >
                          <div className="flex items-center h-6">
                            {multiSelect ? (
                              <Checkbox
                                checked={isSelected}
                                className="mr-2"
                                onCheckedChange={() => handleSelect(option.id)}
                                disabled={disabled}
                              />
                            ) : (
                              isSelected && (
                                <Check className="mr-2 h-4 w-4 shrink-0" />
                              )
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span>{option.label}</span>
                            {option.description && (
                              <span className="text-sm text-muted-foreground truncate w-[200px]" title={option.description}>
                                {option.description}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  <CommandSeparator />
                </React.Fragment>
              );
            })}
            {addNewItemLabel && !disabled && (
              <CommandItem
                onSelect={onAddNewItem}
                className="cursor-pointer text-sm"
              >
                {addNewItemLabel}
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}