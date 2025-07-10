"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
import { toast } from "sonner";
import { FrameworkEntry } from "../types/framework";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Label } from "@/shadcn/ui/label";
import { useEffect } from "react";

const formSchema = z.object({
  index: z.string().min(1, { message: "Index is required" }),
  // title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  title: z.string().optional(),
  // description: z.string().min(10, {
    // message: "Description must be at least 10 characters",
  // }),
  description: z.string().optional(),
  parentId: z.string().nullable(),
  treatAsParent: z.boolean({
    required_error: "Treat As Parent is required",
    invalid_type_error: "Treat As Parent must be a boolean",
  }).default(true)
});

type FormValues = z.infer<typeof formSchema>;

interface AddEntryFormProps {
  entries: FrameworkEntry[];
  parentsDropdownEntry: FrameworkEntry[];
  onSubmit: (values: FormValues) => void;
  initialValues?: Partial<FormValues>;
}

export function AddEntryForm({
  entries,
  parentsDropdownEntry,
  onSubmit,
  initialValues,
}: AddEntryFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      index: initialValues?.index || "",
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      parentId: initialValues?.parentId || null,
      treatAsParent: initialValues?.treatAsParent ?? false,
    },
  });

  // Function to get all descendant IDs of an entry
  const getDescendantIds = (entryId: string): string[] => {
    const children = parentsDropdownEntry.filter(entry => entry.parentId === entryId);
    const childIds = children.map(child => child.id);
    const descendantIds = children.flatMap(child => getDescendantIds(child.id));
    return [...childIds, ...descendantIds];
  };

  // Get valid parent entries (excluding self and descendants)
  const getValidParentEntries = () => {
    if (!initialValues?.id) return parentsDropdownEntry;

    const descendantIds = getDescendantIds(initialValues.id);
    return parentsDropdownEntry.filter(entry =>
      entry.id !== initialValues.id && !descendantIds.includes(entry.id)
    );
  };

  function handleSubmit(values: FormValues) {
    onSubmit(values);
    if (!initialValues) {
      form.reset({
        index: "",
        title: "",
        description: "",
        parentId: null,
        treatAsParent: true
      });
    }
    // toast.success(initialValues ? "Entry updated successfully" : "Entry added successfully");
  }

  const treatAsParent = useWatch({
    control: form.control,
    name: "treatAsParent",
  });

  // useEffect(() => {
  //   if (treatAsParent) {
  //     form.setValue("parentId", "no-parent");
  //   }
  // }, [treatAsParent, form]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="index"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Index</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 1.2.3" {...field} />
                </FormControl>
                <FormDescription>
                  The hierarchical index of this entry (e.g., 1.2.3)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Entry title" {...field} />
                </FormControl>
                <FormDescription>
                  A descriptive title for this framework entry
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe this framework entry"
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A detailed description of this framework entry
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="treatAsParent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treat As Parent?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value === true ? "true" : "false"}
                  className="flex flex-row gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="treat-yes" value="true" />
                    <Label htmlFor="treat-yes" className="font-normal">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="treat-no" value="false" />
                    <Label htmlFor="treat-no" className="font-normal">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="treatAsParent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treat As Parent?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    const isTrue = value === "true";
                    field.onChange(isTrue);
                    if (isTrue) {
                      form.setValue("parentId", null);
                    }
                  }}
                  value={field.value === true ? "true" : "false"}
                  className="flex flex-row gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="treat-yes" value="true" />
                    <Label htmlFor="treat-yes" className="font-normal">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="treat-no" value="false" />
                    <Label htmlFor="treat-no" className="font-normal">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* {
          !treatAsParent && */}
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Entry</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === "no-parent" ? null : value)}
                  defaultValue={field.value || "no-parent"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a parent entry (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="no-parent">No Parent</SelectItem>
                    {getValidParentEntries().map((entry) => (
                      <SelectItem key={entry.id} value={entry.id}>
                        {entry.index} - {entry.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Optional: Select a parent entry for hierarchical organization
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        {/* } */}
        <Button type="submit" className="w-full md:w-auto">
          {initialValues ? "Update Entry" : "Save Entry"}
        </Button>
      </form>
    </Form>
  );
}