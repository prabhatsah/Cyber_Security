"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { buildingBasicInfoSchema } from "../../lib/validation";
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
import FormInput from "@/ikon/components/form-fields/input";

type BuildingBasicInfoValues = z.infer<typeof buildingBasicInfoSchema>;

interface BuildingBasicInfoFormProps {
  defaultValues?: BuildingBasicInfoValues;
  onSubmit: (values: BuildingBasicInfoValues) => void;
}

const BuildingBasicInfoForm = ({
  defaultValues,
  onSubmit,
}: BuildingBasicInfoFormProps) => {
  console.log("BuildingBasicInfoForm defaultValues:", defaultValues);

  // Create a ref to access the form from outside
  const formRef = React.useRef<HTMLFormElement>(null);

  // Extract specific fields from defaultValues, with fallbacks
  const form = useForm<BuildingBasicInfoValues>({
    resolver: zodResolver(buildingBasicInfoSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      buildingCode: defaultValues?.buildingCode || "",
      type: defaultValues?.type || "office",
    },
    values: {
      name: defaultValues?.name || "",
      buildingCode: defaultValues?.buildingCode || "",
      type: defaultValues?.type || "office",
    },
  });

  // Create a function to manually trigger form submission
  React.useEffect(() => {
    // Expose the submit function to the window for debugging
    (window as any).submitBasicInfoForm = () => {
      console.log("Manual form submission triggered");
      form.handleSubmit((data) => {
        console.log("Form submitted with data:", data);
        onSubmit(data);
      })();
    };
  }, [form, onSubmit]);

  const handleFormSubmit = (data: BuildingBasicInfoValues) => {
    console.log("BuildingBasicInfoForm submitted with:", data);
    onSubmit(data);
  };

  // Log the form values whenever they change
  console.log("Current form values:", form.getValues());

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
       {/*  <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter building name" {...field} />
              </FormControl>
              <FormDescription>
                The official name of the building
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormInput
          name="name"
          label="Building Name"
          placeholder="Enter building name"
          formControl={form.control}
          formDescription="The official name of the building"
        />

       {/*  <FormField
          control={form.control}
          name="buildingCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter building code (e.g., BLD-001)"
                  {...field}
                  onChange={(e) => {
                    // Convert input to uppercase
                    field.onChange(e.target.value.toUpperCase());
                  }}
                />
              </FormControl>
              <FormDescription>
                A unique identifier for the building (uppercase letters,
                numbers, and hyphens only)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormInput
          name="buildingCode"
          label="Building Code"
          placeholder="Enter building code (e.g., BLD-001)"
          formControl={form.control}
          formDescription="A unique identifier for the building (uppercase letters, numbers, and hyphens only)"
          onChange={(e) => {
            // Convert input to uppercase
            form.setValue("buildingCode", e.target.value.toUpperCase());
          }}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select building type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The primary purpose or usage type of the building
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add a hidden submit button */}
        <button 
          type="submit" 
          id="building-basic-info-submit" 
          style={{ display: 'none' }}
        >
          Submit
        </button>
        
        {/* Add a visible submit button for debugging */}
        <button 
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={() => {
            console.log("Submit button clicked");
            form.handleSubmit(handleFormSubmit)();
          }}
        >
          Submit
        </button>
      </form>
    </Form>
  );
};

export default BuildingBasicInfoForm;