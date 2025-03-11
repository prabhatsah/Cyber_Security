import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form'
import React from 'react'
import { FormDateInputProps } from '../types'
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/ui/popover'
import { Button } from '@/shadcn/ui/button'
import { cn } from '@/shadcn/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/shadcn/ui/calendar'

export default function FormDateInput({ formControl, name, label, placeholder, dateFormat, calendarDateDisabled, formDescription }: FormDateInputProps) {
  return (
    <>
      <FormField
        control={formControl}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <><FormLabel>{label}</FormLabel><br /></>}
            <Popover>
              <PopoverTrigger asChild className='w-full'>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, dateFormat || "PPP")
                    ) : (
                      <span>{placeholder || "Pick a date"}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={calendarDateDisabled}
                  // disabled={(date) =>
                  //   date > new Date() || date < new Date("1900-01-01")
                  // }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formDescription && <FormDescription>{formDescription}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}