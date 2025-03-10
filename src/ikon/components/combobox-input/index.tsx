import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ComboBoxInputProps } from "./type";

export default function ComboboxInput({
  placeholder,
  items,
  disabled,
  onSelect,
}: ComboBoxInputProps) {
  const [value, setValue] = useState("");
  return (
    <>
      <Popover>
        <PopoverTrigger asChild className="w-full">
          <Button
            variant="outline"
            role="combobox"
            className={cn("justify-between", !value && "text-muted-foreground")}
            disabled={disabled == true || (disabled && disabled(...arguments))}
          >
            {value
              ? items.find((item) => item.value === value)?.label || value
              : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    value={item.value}
                    key={item.value}
                    disabled={
                      item.disabled == true ||
                      (item.disabled && item.disabled(item))
                    }
                    onSelect={(value) => {
                      setValue(value);
                      onSelect && onSelect(value);
                    }}
                  >
                    {item?.label || item.value}
                    <Check
                      className={cn(
                        "ml-auto",
                        item.value === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
