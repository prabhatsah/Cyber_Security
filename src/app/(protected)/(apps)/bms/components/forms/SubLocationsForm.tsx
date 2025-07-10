"use client";

import React, { useRef, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { buildingSubLocationSchema } from "../../lib/validation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { Textarea } from "@/shadcn/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/shadcn/ui/card";

type SubLocationFormValues = z.infer<typeof buildingSubLocationSchema>;

interface SubLocationsFormProps {
  defaultValues?: SubLocationFormValues;
  onSubmit: (values: SubLocationFormValues) => void;
}

const SubLocationsForm = ({
  defaultValues,
  onSubmit,
}: SubLocationsFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<SubLocationFormValues>({
    resolver: zodResolver(buildingSubLocationSchema),
    defaultValues: defaultValues || {
      subLocations: [],
    },
  });

  useEffect(() => {
    (window as any).submitSubLocationsForm = () => {
      console.log("SubLocations manual form submission triggered");
      form.handleSubmit(handleFormSubmit)();
    };
  }, [form]);

  const handleFormSubmit = (values: SubLocationFormValues) => {
    console.log("SubLocations form submitting with data:", values);
    onSubmit(values);
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subLocations",
  });

  const handleAddSubLocation = () => {
    append({
      id: `subloc-${Date.now()}`,
      name: "",
      type: "floor",
      floorNumber: undefined,
      area: undefined,
      description: "",
    });
  };

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No sub-locations added yet</p>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSubLocation}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Sub-Location
              </Button>
            </div>
          ) : (
            fields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`subLocations.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter location name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`subLocations.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="floor">Floor</SelectItem>
                              <SelectItem value="room">Room</SelectItem>
                              <SelectItem value="zone">Zone</SelectItem>
                              <SelectItem value="area">Area</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch(`subLocations.${index}.type`) === "floor" && (
                      <FormField
                        control={form.control}
                        name={`subLocations.${index}.floorNumber`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Floor Number</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter floor number"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value === "" ? undefined : Number(e.target.value);
                                  field.onChange(value);
                                }}
                                value={field.value === undefined ? "" : field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name={`subLocations.${index}.area`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area (sq ft)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter area in square feet"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value === "" ? undefined : Number(e.target.value);
                                field.onChange(value);
                              }}
                              value={field.value === undefined ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`subLocations.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter a description for this location"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="col-span-full flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {fields.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSubLocation}
            className="mt-4 w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Sub-Location
          </Button>
        )}

        <button 
          type="submit" 
          id="sublocations-form-submit" 
          style={{ display: 'none' }}
        >
          Submit
        </button>

        <button 
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => {
            console.log("SubLocations submit button clicked");
            form.handleSubmit(handleFormSubmit)();
          }}
        >
          Submit
        </button>
      </form>
    </Form>
  );
};

export default SubLocationsForm;