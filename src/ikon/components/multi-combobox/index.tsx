import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover'
import { Button } from '@/shadcn/ui/button'
import { cn } from '@/shadcn/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shadcn/ui/command'

export default function MultiCombobox({ placeholder, items, onValueChange }) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  useEffect(() => {
    onValueChange(selectedItems)
  }, [selectedItems])
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "justify-between",
              selectedItems.length == 0 && "text-muted-foreground"
            )}
          >
            {selectedItems && selectedItems.length > 0 ? (
              <div className='flex gap-2 items-center'>
                {
                  selectedItems.map((value: string) => (
                    <span
                      key={value}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md"
                    >
                      {
                        (items.find(
                          (item) => item.value === value
                        )?.label || value)
                      }
                    </span>
                  ))
                }
              </div>
            ) : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align='start'>
          <Command>
            <CommandInput
              placeholder="Search..."
            />
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                {
                  items.map((item) => {
                    const isSelected = selectedItems.includes(item.value);
                    return (
                      <CommandItem
                        value={item.value}
                        key={item.value}
                        onSelect={(value) => {
                          let updatedItems;
                          if (selectedItems.includes(value)) {
                            updatedItems = selectedItems.filter((val) => val !== value);
                          } else {
                            updatedItems = [...selectedItems, value];
                          }
                          setSelectedItems(updatedItems);
                        }}
                      >
                        {item?.label || item.value}
                        <Check
                          className={cn(
                            "ml-auto",
                            isSelected
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    )
                  })
                }
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}