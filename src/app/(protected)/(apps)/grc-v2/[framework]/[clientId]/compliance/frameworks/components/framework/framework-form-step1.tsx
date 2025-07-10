"use client";

import { UseFormReturn } from "react-hook-form";
import { FrameworkFormValues } from "./framework-form";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/shadcn/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { Button } from "@/shadcn/ui/button";
import { Calendar } from "@/shadcn/ui/calendar";
import { cn } from "@/shadcn/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import FormInput from "@/ikon/components/form-fields/input";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import FormDateInput from "@/ikon/components/form-fields/date-input";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormTextarea from "@/ikon/components/form-fields/textarea";

interface FrameworkFormStep1Props {
  form: UseFormReturn<FrameworkFormValues>;
  allUsers: { value: string, label: string }[]
}

export function FrameworkFormStep1({ form, allUsers }: FrameworkFormStep1Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Framework Details</h2>
        <p className="text-muted-foreground">
          Provide the basic information about your framework.
        </p>
      </div>

      <Card className="transition-all duration-300 hover:shadow-md">
        <CardContent className="pt-6">
          <Form {...form}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                {/* <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Framework Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., ISO 27001:2022" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormInput
                  formControl={form.control}
                  name="name"
                  label="Framework Name"
                  placeholder="e.g., ISO 27001:2022"
                />

                {/* <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Compliance Team" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormComboboxInput items={allUsers} formControl={form.control} name="owner" placeholder="Select Owner" label="Owner" />

                <div className="grid grid-cols-2 gap-4">
                  {/* <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Version</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 1.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormInput
                    formControl={form.control}
                    name="version"
                    label="Version"
                    placeholder="e.g., 1.0"
                  />

                  {/* <FormField
                    control={form.control}
                    name="effectiveDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Effective Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <FormDateInput
                    formControl={form.control}
                    name="effectiveDate"
                    label="Effective Date"
                    placeholder="Select Effective date"
                    dateFormat={SAVE_DATE_FORMAT_GRC}
                  />

                </div>
              </div>

              <div>
                {/* <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a detailed description of the framework..."
                          className="min-h-[180px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormTextarea
                  formControl={form.control}
                  name="description"
                  placeholder="Provide a detailed description of the framework..."
                  label="Description"
                  className="resize-none min-h-[180px] w-full"
                  formItemClass="w-full"
                />
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}