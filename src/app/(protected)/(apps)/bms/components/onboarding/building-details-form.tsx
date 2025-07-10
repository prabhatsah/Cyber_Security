"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/shadcn/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form"
import { Input } from "@/shadcn/ui/input"
import { Textarea } from "@/shadcn/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group"
import { Switch } from "@/shadcn/ui/switch"

const buildingFormSchema = z.object({
  name: z.string().min(2, { message: "Building name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zipCode: z.string().min(5, { message: "Please enter a valid ZIP code." }),
  buildingType: z.string({
    required_error: "Please select a building type.",
  }),
  description: z.string().optional(),
  totalFloors: z.coerce.number().min(1).max(200),
  yearBuilt: z.coerce.number().min(1800).max(new Date().getFullYear()),
  grossArea: z.coerce.number().min(100),
  hasBacnetNetwork: z.boolean().default(false),
})

type BuildingFormValues = z.infer<typeof buildingFormSchema>

export function BuildingDetailsForm() {
  const defaultValues: Partial<BuildingFormValues> = {
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    buildingType: "commercial",
    description: "",
    totalFloors: 1,
    yearBuilt: new Date().getFullYear(),
    grossArea: 10000,
    hasBacnetNetwork: true,
  }

  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingFormSchema),
    defaultValues,
  })

  function onSubmit(data: BuildingFormValues) {
    // Would handle form submission here in a real app
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Building Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter building name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="buildingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Building Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="mixed">Mixed Use</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="ZIP Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Brief description of the building" 
                    {...field} 
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="totalFloors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Floors</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="yearBuilt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Built</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min={1800} max={new Date().getFullYear()} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="grossArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gross Floor Area (sq ft)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hasBacnetNetwork"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">BACnet Network</FormLabel>
                  <FormDescription>
                    Does this building have a BACnet/IP network?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}