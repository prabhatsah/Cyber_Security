"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shadcn/ui/command";
import { Badge } from "@/shadcn/ui/badge";

type Option = { value: string; label: string };

type MultiSelectProps = {
  options: Option[];
  placeholder?: string;
  name?: string;
  label?: string;
  defaultValue?: string[]; // array of values (like ["one", "two"])
};

export function MultiSelect({
  options,
  placeholder = "Select options...",
  name,
  label,
  defaultValue = [],
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Internal selected state for uncontrolled mode
  const [internalSelected, setInternalSelected] = React.useState<Option[] | null>(null);

  // Set internal selected values only once when defaultValue and options are available
  React.useEffect(() => {
    if (internalSelected === null && options.length) {
      const mapped = options.filter((opt) => defaultValue.includes(opt.value));
      setInternalSelected(mapped);
    }
  }, [defaultValue, options, internalSelected]);

  // Until internalSelected is set, don’t render anything
  if (internalSelected === null) return null;

  const handleChange = (values: Option[]) => {
    setInternalSelected(values);
  };

  const handleUnselect = (value: string) => {
    handleChange(internalSelected.filter((s) => s.value !== value));
  };

  const selectables = options.filter(
    (option) => !internalSelected.some((s) => s.value === option.value)
  );

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-muted-foreground"
        >
          {label}
        </label>
      )}

      <Command className="overflow-visible bg-transparent">
        <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex gap-1 flex-wrap">
            {internalSelected.map((option) => (
              <Badge key={option.value} variant="secondary">
                {option.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUnselect(option.value);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option.value)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}

            <CommandInput
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
            />
          </div>

          {/* Hidden inputs for form submission */}
          {name &&
            internalSelected.map((option) => (
              <input
                key={option.value}
                type="hidden"
                name={name}
                value={option.value}
              />
            ))}
        </div>

        <div className="relative mt-2">
          {open && selectables.length > 0 && (
            <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup className="h-full overflow-auto">
                  {selectables.map((option) => (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue("");
                        handleChange([...internalSelected, option]);
                      }}
                      className="cursor-pointer"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleChange([...internalSelected, option]);
                          setInputValue("");
                        }
                      }}
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </div>
          )}
        </div>
      </Command>
    </div>
  );
}
