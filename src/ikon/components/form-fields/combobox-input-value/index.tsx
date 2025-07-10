import React from "react";
import { useController, Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
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

// Updated type definition to include 'value' and 'onChange'
export interface FormComboboxInputProps {
  formControl: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  formDescription?: string;
  items: { value: string; label: string; disabled?: boolean | ((item: any) => boolean) }[];
  disabled?: boolean | ((...args: any[]) => boolean);
  onSelect?: (value: any) => void;
  value?: string; // added for controlled component
  onChange?: (value: any) => void; // added for controlled component
}

export default function FormComboboxInputWithValue(props: FormComboboxInputProps) {
  const { field } = useController({ name: props.name, control: props.formControl });
  // Use the external value if provided, otherwise use the field's value.
  const currentValue = props.value !== undefined ? props.value : field.value;
  return (
    <FormField
      control={props.formControl}
      name={props.name}
      render={({ field }) => (
        <FormItem className="">
          {props.label && (
            <>
              <FormLabel>{props.label}</FormLabel>
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
                    !currentValue && "text-muted-foreground"
                  )}
                  disabled={
                    typeof props.disabled === "function" ? props.disabled() : props.disabled
                  }
                >
                  {currentValue
                    ? props.items.find((item) => item.value === currentValue)
                        ?.label || currentValue
                    : props.placeholder}
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
                    {props.items.map((item) => (
                      <CommandItem
                        value={item.value}
                        key={item.value}
                        disabled={
                          typeof item.disabled === "function"
                            ? item.disabled(item)
                            : item.disabled
                        }
                        onSelect={(value) => {
                          field.onChange(value);
                          props.onSelect && props.onSelect(value);
                          props.onChange && props.onChange(value);
                        }}
                      >
                        {item?.label || item.value}
                        <Check
                          className={cn(
                            "ml-auto",
                            item.value === currentValue ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {props.formDescription && (
            <FormDescription>{props.formDescription}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
