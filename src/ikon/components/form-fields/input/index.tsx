import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form'
import { Input } from '@/shadcn/ui/input'
import React from 'react'
import { FormInputProps } from '../types'

export default function FormInput({ formControl, label, formDescription, extraFormComponent, name, ...inputProps }: FormInputProps) {
  return (
    <>
      <FormField
        control={formControl}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input {...field} {...inputProps} />
            </FormControl>
            {extraFormComponent && extraFormComponent(field.value)}
            {formDescription && <FormDescription>{formDescription}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}