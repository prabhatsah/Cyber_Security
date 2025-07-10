"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FrameworkFormValues } from "./framework-form";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form
} from "@/shadcn/ui/form";
import { Button } from "@/shadcn/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shadcn/ui/select";
import {
  GripVertical,
  Plus,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/shadcn/lib/utils";
import FormInput from "@/ikon/components/form-fields/input";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormTextarea from "@/ikon/components/form-fields/textarea";

interface FrameworkFormStep2Props {
  form: UseFormReturn<FrameworkFormValues>;
}

export function FrameworkFormStep2({ form }: FrameworkFormStep2Props) {

  const policyType = [
    { value: 'clause', label: 'Clause' },
    { value: 'control', label: 'Control' }
  ]

  const { fields, append, remove, swap } = useFieldArray({
    control: form.control,
    name: "controls",
  });

  const [activeControl, setActiveControl] = useState<number | null>(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      swap(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Controls & Clauses</h2>
        <p className="text-muted-foreground">
          Add the controls and clauses that make up your framework.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Control List Sidebar */}
        <Card className="lg:col-span-1 max-h-[500px] overflow-y-auto">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Controls & Clauses</h3>
                <span className="text-xs text-muted-foreground">
                  {fields.length} items
                </span>
              </div>

              <div className="space-y-1">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md text-sm cursor-pointer group",
                      activeControl === index ? "bg-primary/10" : "hover:bg-muted",
                      draggedIndex === index && "opacity-50"
                    )}
                    onClick={() => {
                      setActiveControl(index)
                    }}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div className="flex-1 truncate">
                      {form.watch(`controls.${index}.name`) || `Untitled ${form.watch(`controls.${index}.type`)}`}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   if (fields.length > 1) {
                      //     remove(index);
                      //     if (activeControl === index) {
                      //       setActiveControl(Math.max(0, index - 1));
                      //     }
                      //   } else {
                      //     form.resetField(`controls.${index}`);
                      //   }
                      // }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (fields.length > 1) {
                          remove(index);
                          if (activeControl === index) {
                            setActiveControl(Math.max(0, index - 1));
                          }
                        } else {
                          remove(index);
                          setActiveControl(null);

                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full gap-1"
                onClick={() => {
                  const newControlIndex = fields.length; // Get the index BEFORE appending

                  append({
                    name: "",
                    description: "",
                    index: "",
                    type: "control",
                    objectives: [
                      {
                        name: "",
                        description: "",
                        index: "",
                      },
                    ],
                  });
                  setActiveControl(newControlIndex);
                  setTimeout(() => {
                    form.setValue(`controls.${newControlIndex}.name`, "");
                    form.setValue(`controls.${newControlIndex}.description`, "");
                    form.setValue(`controls.${newControlIndex}.index`, "");
                    form.setValue(`controls.${newControlIndex}.type`, "control");
                    form.setValue(`controls.${newControlIndex}.objectives`, [{ name: "", description: "", index: "" }]);

                  }, 0); // Using 0 for setTimeout places it at the end of the current event loop
                }}
              >
                <Plus className="h-4 w-4" /> Add Control/Clause
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Control Edit Form */}
        <Card className="lg:col-span-3">
          <CardContent className="pt-6">
            {activeControl !== null && activeControl < fields.length && (
              <Form {...form} key={fields[activeControl]?.id}>
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* <FormField
                      control={form.control}
                      name={`controls.${activeControl}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Access Control" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}

                    <FormInput
                      formControl={form.control}
                      name={`controls.${activeControl}.name`}
                      label="Name"
                      placeholder="e.g., Access Control"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      {/* <FormField
                        control={form.control}
                        name={`controls.${activeControl}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="control">Control</SelectItem>
                                <SelectItem value="clause">Clause</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}

                      <FormComboboxInput
                        items={policyType}
                        formControl={form.control}
                        name={`controls.${activeControl}.type`}
                        placeholder="Select type"
                        label="Type"
                      />

                      {/* <FormField
                        control={form.control}
                        name={`controls.${activeControl}.index`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Index</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 1.1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}

                      <FormInput
                        formControl={form.control}
                        name={`controls.${activeControl}.index`}
                        label="Index"
                        placeholder="e.g., 1.1"
                      />

                    </div>

                    <div className="sm:col-span-2">
                      {/* <FormField
                        control={form.control}
                        name={`controls.${activeControl}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide a detailed description..."
                                className="min-h-[120px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
                      <FormTextarea
                        formControl={form.control}
                        name={`controls.${activeControl}.description`}
                        placeholder="Provide a detailed description..."
                        label="Description"
                        className="resize-none min-h-[120px] w-full"
                        formItemClass="w-full"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <h3 className="text-sm font-semibold">
                      {fields[activeControl]?.type === 'control' ? 'Control' : 'Clause'} Preview
                    </h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {form.watch(`controls.${activeControl}.type`)} {form.watch(`controls.${activeControl}.index`)}
                    </span>
                  </div>

                  <div className="p-4 border rounded-md bg-muted/30">
                    <h4 className="font-medium">
                      {form.watch(`controls.${activeControl}.name`) || `Untitled ${form.watch(`controls.${activeControl}.type`)}`}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {form.watch(`controls.${activeControl}.description`) || "No description provided"}
                    </p>
                  </div>
                </div>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}