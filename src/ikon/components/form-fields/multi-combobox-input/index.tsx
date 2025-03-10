import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import React, { useState } from "react";
import { ComboboxItemProps, FormComboboxInputProps } from "../types";
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

export default function FormMultiComboboxInput({
  formControl,
  name,
  label,
  placeholder,
  formDescription,
  items,
  disabled,
  onSelect,
}: FormComboboxInputProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const onItemSelect = (
    value: string,
    fieldOnChange: (updatedItems: string[]) => void
  ) => {
    let updatedItems;
    if (selectedItems.includes(value)) {
      updatedItems = selectedItems.filter((val) => val !== value);
    } else {
      updatedItems = [...selectedItems, value];
    }
    setSelectedItems(updatedItems);
    fieldOnChange(updatedItems);
  };
  return (
    <>
      <FormField
        control={formControl}
        name={name}
        render={({ field }) => (
          <FormItem className="">
            {label && (
              <>
                <FormLabel>{label}</FormLabel>
                <br />
              </>
            )}
            <Popover>
              <PopoverTrigger asChild className="w-full">
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={
                      disabled == true ||
                      (disabled && disabled(...arguments))
                    }
                  >
                    {field?.value && field.value.length > 0 ? (
                      <div className="flex gap-2 items-center">
                        {field.value.map((value: string) => (
                          <span
                            key={value}
                            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md"
                          >
                            {items.find((item) => item.value === value)
                              ?.label || value}
                          </span>
                        ))}
                      </div>
                    ) : (
                      placeholder
                    )}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search..." />
                  <CommandList>
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup>
                      {items.map((item) => {
                        const isSelected = selectedItems.includes(item.value);
                        return (
                          <CommandItem
                            value={item.value}
                            key={item.value}
                            onSelect={(value) => {
                              let updatedItems;
                              if (selectedItems.includes(value)) {
                                updatedItems = selectedItems.filter(
                                  (val) => val !== value
                                );
                              } else {
                                updatedItems = [...selectedItems, value];
                              }
                              setSelectedItems(updatedItems);
                              field.onChange(updatedItems);
                              onSelect && onSelect(updatedItems);
                            }}
                          >
                            {item?.label || item.value}
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
        )}
      />
    </>
  );
}
