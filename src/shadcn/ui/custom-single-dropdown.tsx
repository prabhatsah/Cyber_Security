// "use client";

// import * as React from "react";
// import { Check, ChevronsUpDown, Plus } from "lucide-react";
// import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
// import { cn } from "@/shadcn/lib/utils";
// import { Button } from "@/shadcn/ui/button";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shadcn/ui/command";
// import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
// import { Input } from "@/shadcn/ui/input";

// export type Option = {
//   value: string;
//   label: string;
// };

// type CustomComboboxInputProps = {
//   formControl: any;
//   name: string;
//   label?: string | React.ReactNode;
//   options: Option[];
//   placeholder?: string;
//   emptyMessage?: string;
//   onValueChange?: (value: string) => void;
//   className?: string;
//   addNewPlaceholder?: string;
//   formDescription?: string;
// };

// export function CustomComboboxInput({
//   formControl,
//   name,
//   label,
//   options,
//   placeholder = "Select an option",
//   emptyMessage = "No options found.",
//   onValueChange,
//   className,
//   addNewPlaceholder = "Add custom value...",
//   formDescription,
// }: CustomComboboxInputProps) {
//   const [open, setOpen] = React.useState(false);
//   const [searchValue, setSearchValue] = React.useState("");
//   const [items, setItems] = React.useState<Option[]>(options);
//   const [isAddingNew, setIsAddingNew] = React.useState(false);
//   const [newValue, setNewValue] = React.useState("");

//   return (
//     <FormField
//       control={formControl}
//       name={name}
//       render={({ field }) => {
//         const selectedItem = items.find((item) => item.value === field.value);

//         const handleAddNewItem = () => {
//           const trimmedValue = newValue.trim();
//           if (!trimmedValue) return;

//           // Prevent duplicates
//           if (items.some((item) => item.value === trimmedValue)) return;

//           const newOption: Option = {
//             value: trimmedValue,
//             label: trimmedValue,
//           };

//           setItems((prev) => [...prev, newOption]);
//           field.onChange(trimmedValue);
//           onValueChange?.(trimmedValue);

//           setNewValue("");
//           setIsAddingNew(false);
//           setOpen(false);
//         };

//         return (
//           <FormItem className="">
//             {label && (
//               <>
//                 <FormLabel>{label}</FormLabel>
//                 <br />
//               </>
//             )}
//             <Popover
//               open={open}
//               onOpenChange={(isOpen) => {
//                 setOpen(isOpen);
//                 if (!isOpen) {
//                   setSearchValue("");
//                   setIsAddingNew(false);
//                   setNewValue("");
//                 }
//               }}
//             >
//               <PopoverTrigger asChild>
//                 <FormControl>
//                   <Button
//                     variant="outline"
//                     role="combobox"
//                     aria-expanded={open}
//                     className={cn("w-full justify-between", className)}
//                   >
//                     <span className="line-clamp-1 text-left">
//                       {selectedItem ? selectedItem.label : placeholder}
//                     </span>
//                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                   </Button>
//                 </FormControl>
//               </PopoverTrigger>
//               <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
//                 <Command>
//                   <CommandInput
//                     placeholder="Search..."
//                     value={searchValue}
//                     onValueChange={setSearchValue}
//                   />
//                   <CommandList>
//                     <CommandEmpty>{emptyMessage}</CommandEmpty>
//                     <CommandGroup>
//                       {items.map((item) => (
//                         <CommandItem
//                           key={item.value}
//                           value={item.value}
//                           onSelect={(currentValue) => {
//                             field.onChange(currentValue);
//                             onValueChange?.(currentValue);
//                             setOpen(false);
//                           }}
//                           className="cursor-pointer"
//                         >
//                           <Check
//                             className={cn(
//                               "mr-2 h-4 w-4",
//                               field.value === item.value
//                                 ? "opacity-100"
//                                 : "opacity-0"
//                             )}
//                           />
//                           {item.label}
//                         </CommandItem>
//                       ))}
//                     </CommandGroup>
//                   </CommandList>
//                   <div className="border-t p-2">
//                     {isAddingNew ? (
//                       <div className="flex items-center gap-2">
//                         <Input
//                           placeholder={addNewPlaceholder}
//                           value={newValue}
//                           onChange={(e) => setNewValue(e.target.value)}
//                           onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                               e.preventDefault();
//                               handleAddNewItem();
//                             }
//                           }}
//                           autoFocus
//                           className="h-8"
//                         />
//                         <Button
//                           size="sm"
//                           variant="ghost"
//                           onClick={() => setIsAddingNew(false)}
//                           className="h-8"
//                         >
//                           Cancel
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="default"
//                           onClick={handleAddNewItem}
//                           className="h-8"
//                           disabled={!newValue.trim()}
//                         >
//                           Add
//                         </Button>
//                       </div>
//                     ) : (
//                       <Button
//                         variant="outline"
//                         className="w-full justify-start"
//                         onClick={() => setIsAddingNew(true)}
//                       >
//                         <Plus className="mr-2 h-4 w-4" />
//                         Add new option
//                       </Button>
//                     )}
//                   </div>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//             {formDescription && (
//               <FormDescription>{formDescription}</FormDescription>
//             )}
//             <FormMessage />
//           </FormItem>
//         );
//       }}
//     />
//   );
// }


"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shadcn/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { Input } from "@/shadcn/ui/input";

export type Option = {
    value: string;
    label: string;
};

type CustomComboboxInputProps = {
    formControl: any; // Typically Control<FieldValues> from react-hook-form
    name: string;
    label?: string | React.ReactNode;
    options: Option[];
    placeholder?: string;
    emptyMessage?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    addNewPlaceholder?: string;
    formDescription?: string;
    // Consider adding a disabled prop if needed for the whole component
    // disabled?: boolean;
};

export function CustomComboboxInput({
    formControl,
    name,
    label,
    options,
    placeholder = "Select an option",
    emptyMessage = "No options found.",
    onValueChange,
    className,
    addNewPlaceholder = "Add custom value...",
    formDescription,
    // disabled, // If you add a top-level disabled prop
}: CustomComboboxInputProps) {
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [items, setItems] = React.useState<Option[]>(options);
    const [isAddingNew, setIsAddingNew] = React.useState(false);
    const [newValue, setNewValue] = React.useState("");

    // **FIX 1: Synchronize internal `items` state with `options` prop**
    // This ensures that if the `options` prop changes (e.g., async loading),
    // the internal list used for display and selection is updated.
    React.useEffect(() => {
        setItems(options);
    }, [options]);

    return (
        <FormField
            control={formControl}
            name={name}
            render={({ field }) => {
                // Use the internal `items` state to find the selected item.
                // `items` is now reactive to the `options` prop thanks to the useEffect above.
                const selectedItem = items.find((item) => item.value === field.value);

                const handleAddNewItem = () => {
                    const trimmedValue = newValue.trim();
                    if (!trimmedValue) return;

                    // Prevent duplicates in the current `items` list
                    if (items.some((item) => item.value === trimmedValue)) {
                        // Optionally, select the existing item if a duplicate is entered
                        const existingItem = items.find(i => i.value === trimmedValue);
                        if (existingItem) {
                            field.onChange(existingItem.value);
                            onValueChange?.(existingItem.value);
                            setNewValue("");
                            setIsAddingNew(false);
                            setOpen(false);
                            setSearchValue("");
                        }
                        return;
                    }

                    const newOption: Option = {
                        value: trimmedValue,
                        label: trimmedValue, // New items use their value as the label
                    };

                    setItems((prev) => [...prev, newOption]);
                    field.onChange(trimmedValue);
                    onValueChange?.(trimmedValue);

                    setNewValue("");
                    setIsAddingNew(false);
                    setOpen(false);
                    setSearchValue("");
                };

                return (
                    <FormItem className={cn(className)}> {/* Apply className to FormItem */}
                        {label && (
                            <>
                                <FormLabel>{label}</FormLabel>
                                <br />
                            </>
                        )}
                        <Popover
                            open={open}
                            onOpenChange={(isOpen) => {
                                setOpen(isOpen);
                                if (!isOpen) {
                                    setSearchValue(""); // Reset search on close
                                    setIsAddingNew(false); // Reset adding state on close
                                    setNewValue("");      // Reset new value input on close
                                }
                            }}
                        >
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className={cn(
                                            "w-full justify-between",
                                            // Use foreground/50 if no value and placeholder is shown, similar to old component
                                            !field.value && "text-foreground/50",
                                            className // It was here before, ensure it doesn't conflict with FormItem className usage
                                        )}
                                    // disabled={disabled || field.disabled} // Handle disabled state
                                    >
                                        <span className="line-clamp-1 text-left">
                                            {/* **FIX 2: Update button text display logic** */}
                                            {/* If field.value exists:
                          - Show selectedItem.label if found.
                          - Else, show field.value itself (like the old component's fallback).
                          If field.value doesn't exist, show placeholder.
                      */}
                                            {field.value
                                                ? selectedItem
                                                    ? selectedItem.label
                                                    : field.value
                                                : placeholder}
                                        </span>
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
                                <Command shouldFilter={true}> {/* Explicitly enable filtering based on CommandInput */}
                                    <CommandInput
                                        placeholder="Search..."
                                        value={searchValue}
                                        onValueChange={setSearchValue}
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            {/* Show different message if search yields no results vs. options truly empty */}
                                            {searchValue && items.length > 0 ? "No results found." : emptyMessage}
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {items
                                                .filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase()) || item.value.toLowerCase().includes(searchValue.toLowerCase()))
                                                .map((item) => (
                                                    <CommandItem
                                                        key={item.value}
                                                        value={item.value} // Value used for selection and filtering
                                                        onSelect={(currentValue) => { // currentValue is item.value
                                                            field.onChange(currentValue);
                                                            onValueChange?.(currentValue);
                                                            setOpen(false);
                                                            setSearchValue(""); // Reset search value on select
                                                        }}
                                                        className="cursor-pointer"
                                                    // disabled={item.disabled} // If you re-introduce item-level disabling
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                field.value === item.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {item.label}
                                                    </CommandItem>
                                                ))}
                                        </CommandGroup>
                                    </CommandList>
                                    {/* "Add new" feature UI */}
                                    <div className="border-t p-2">
                                        {isAddingNew ? (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    placeholder={addNewPlaceholder}
                                                    value={newValue}
                                                    onChange={(e) => setNewValue(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            handleAddNewItem();
                                                        }
                                                        if (e.key === "Escape") {
                                                            setIsAddingNew(false);
                                                            setNewValue("");
                                                        }
                                                    }}
                                                    autoFocus
                                                    className="h-8"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setIsAddingNew(false);
                                                        setNewValue("");
                                                    }}
                                                    className="h-8"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    onClick={handleAddNewItem}
                                                    className="h-8"
                                                    disabled={!newValue.trim() || items.some(item => item.value === newValue.trim())}
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start"
                                                onClick={() => setIsAddingNew(true)}
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add new option
                                            </Button>
                                        )}
                                    </div>
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