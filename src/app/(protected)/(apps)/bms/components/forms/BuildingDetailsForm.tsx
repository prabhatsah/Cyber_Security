"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { buildingDetailsSchema } from "../../lib/validation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";

type BuildingDetailsValues = z.infer<typeof buildingDetailsSchema>;

interface BuildingDetailsFormProps {
  defaultValues?: BuildingDetailsValues;
  onSubmit: (values: BuildingDetailsValues) => void;
}

const BuildingDetailsForm = ({
  defaultValues,
  onSubmit,
}: BuildingDetailsFormProps) => {
  console.log("BuildingDetailsForm defaultValues:", defaultValues);

  // Create a ref to access the form from outside
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<BuildingDetailsValues>({
    resolver: zodResolver(buildingDetailsSchema),
    defaultValues: {
      floorArea: defaultValues?.floorArea || 0,
      constructionYear: defaultValues?.constructionYear || new Date().getFullYear(),
      floors: defaultValues?.floors || 1,
    },
    values: {
      floorArea: defaultValues?.floorArea || 0,
      constructionYear: defaultValues?.constructionYear || new Date().getFullYear(),
      floors: defaultValues?.floors || 1,
    },
  });

  // Create a function to manually trigger form submission
  React.useEffect(() => {
    // Expose the submit function to the window for debugging
    (window as any).submitDetailsForm = () => {
      console.log("Building details manual form submission triggered");
      form.handleSubmit((data) => {
        console.log("Building details form submitted with data:", data);
        onSubmit(data);
      })();
    };
  }, [form, onSubmit]);

  const handleFormSubmit = (data: BuildingDetailsValues) => {
    console.log("BuildingDetailsForm submitted with:", data);
    onSubmit(data);
  };

  const timeZones = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "America/Anchorage", label: "Alaska Time (AKT)" },
    { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  ];

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="floorArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Floor Area (sq ft)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter floor area"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : Number(e.target.value);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Total floor area of the building in square feet
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="constructionYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Construction Year</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter construction year"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : Number(e.target.value);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormDescription>Year the building was constructed</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="floors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Floors</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter number of floors"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : Number(e.target.value);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Total number of floors in the building
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add a hidden submit button */}
        <button 
          type="submit" 
          id="building-details-submit" 
          style={{ display: 'none' }}
        >
          Submit
        </button>

        {/* Add a visible submit button for debugging */}
        <button 
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => {
            console.log("Building details submit button clicked");
            form.handleSubmit(handleFormSubmit)();
          }}
        >
          Submit
        </button>
      </form>
    </Form>
  );
};

export default BuildingDetailsForm;