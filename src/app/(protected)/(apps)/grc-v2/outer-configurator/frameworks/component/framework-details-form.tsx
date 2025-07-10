"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/shadcn/ui/button";
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
import { Textarea } from "@/shadcn/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { FrameworkDetails } from "../types/framework";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Label } from "@/shadcn/ui/label";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, {
    message: "Version must be in semantic versioning format (e.g., 1.0.0)",
  }),
  owners: z.array(z.string()).min(1, { message: "At least one owner is required" }),
  pricing: z.object({
    type: z.enum(["free", "paid"]),
    amount: z.number().optional(),
    currency: z.string().optional(),
  }),
  responsibilityMatrixExists: z.boolean({
    required_error: "Responsibility Matrix is required",
    invalid_type_error: "Responsibility Matrix must be a boolean",
  }).default(false),
  soaExists: z.boolean({
    required_error: "SOA is required",
    invalid_type_error: "SOA must be a boolean",
  }).default(false)
});

interface FrameworkDetailsFormProps {
  initialValues: FrameworkDetails;
  onSubmit: (values: FrameworkDetails) => void;
  allUsers: { value: string, label: string }[];
}

export function FrameworkDetailsForm({
  initialValues,
  onSubmit,
  allUsers
}: FrameworkDetailsFormProps) {
  const form = useForm<FrameworkDetails>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Framework Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter framework name" {...field} />
              </FormControl>
              <FormDescription>
                The name of your governance framework
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your framework"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A detailed description of your framework's purpose and scope
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input placeholder="1.0.0" {...field} />
                </FormControl>
                <FormDescription>
                  Semantic version (e.g., 1.0.0)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricing.type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pricing Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value === "free") {
                      form.setValue("pricing.amount", undefined);
                      form.setValue("pricing.currency", undefined);
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pricing type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.watch("pricing.type") === "paid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="pricing.amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="99.99"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricing.currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input placeholder="USD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormMultiComboboxInput
          formControl={form.control}
          name="owners"
          label={"Owner"}
          placeholder={"Select Owners"}
          items={allUsers}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="responsibilityMatrixExists"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsibility Matrix Required ?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={field.value === true ? "true" : "false"}
                    className="flex flex-row gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="treat-rm-yes" value="true" />
                      <Label htmlFor="treat-rm-yes" className="font-normal">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="treat-rm-no" value="false" />
                      <Label htmlFor="treat-rm-no" className="font-normal">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="soaExists"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SOA Applicable ?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={field.value === true ? "true" : "false"}
                    className="flex flex-row gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="treat-soa-yes" value="true" />
                      <Label htmlFor="treat-soa-yes" className="font-normal">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="treat-soa-no" value="false" />
                      <Label htmlFor="treat-soa-no" className="font-normal">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Save Framework Details
        </Button>
      </form>
    </Form>
  );
}