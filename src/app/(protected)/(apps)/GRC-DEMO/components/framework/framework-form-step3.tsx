// "use client";

// import { UseFormReturn } from "react-hook-form";
// import { FrameworkFormValues } from "./framework-form";
// import { Card, CardContent } from "@/shadcn/ui/card";
// import { Input } from "@/shadcn/ui/input";
// import { Textarea } from "@/shadcn/ui/textarea";
// import {
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
//   Form
// } from "@/shadcn/ui/form";
// import { Button } from "@/shadcn/ui/button";
// import {
//   GripVertical,
//   Plus,
//   Trash2
// } from "lucide-react";
// import { useFieldArray } from "react-hook-form";
// import { useEffect, useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/shadcn/ui/select";
// import { cn } from "@/shadcn/lib/utils";
// import FormInput from "@/ikon/components/form-fields/input";
// import FormTextarea from "@/ikon/components/form-fields/textarea";

// interface FrameworkFormStep3Props {
//   form: UseFormReturn<FrameworkFormValues>;
// }

// export function FrameworkFormStep3({ form }: FrameworkFormStep3Props) {
//   const [selectedControl, setSelectedControl] = useState(0);
//   const [activeObjective, setActiveObjective] = useState<number | null>(0);
//   const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

//   // Get the controls field array
//   const { fields: controlFields } = useFieldArray({
//     control: form.control,
//     name: "controls",
//   });

//   // Get the objectives field array for the selected control
//   const {
//     fields: objectiveFields,
//     append,
//     remove,
//     swap
//   } = useFieldArray({
//     control: form.control,
//     name: `controls.${selectedControl}.objectives`,
//   });


//   const handleDragStart = (index: number) => {
//     setDraggedIndex(index);
//   };

//   const handleDragOver = (e: React.DragEvent, index: number) => {
//     e.preventDefault();
//     if (draggedIndex !== null && draggedIndex !== index) {
//       swap(draggedIndex, index);
//       setDraggedIndex(index);
//     }
//   };

//   const handleDragEnd = () => {
//     setDraggedIndex(null);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="space-y-2">
//         <h2 className="text-2xl font-bold tracking-tight">Objectives</h2>
//         <p className="text-muted-foreground">
//           Define objectives for each control or clause in your framework.
//         </p>
//       </div>

//       <Card>
//         <CardContent className="pt-6">
//           <Form {...form}>
//             <div className="space-y-6">
//               <FormItem>
//                 <FormLabel>Select Control/Clause</FormLabel>
//                 <Select
//                   value={selectedControl.toString()}
//                   onValueChange={(value) => {
//                     setSelectedControl(parseInt(value));
//                     setActiveObjective(0);
//                   }}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a control" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {controlFields.map((field, index) => (
//                       <SelectItem key={field.id} value={index.toString()}>
//                         {form.watch(`controls.${index}.index`)} - {form.watch(`controls.${index}.name`) || `Untitled ${form.watch(`controls.${index}.type`)}`}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </FormItem>

//               {/* Selected control preview */}
//               <div className="p-4 border rounded-md bg-muted/30">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h4 className="font-medium">
//                       {form.watch(`controls.${selectedControl}.name`) || `Untitled ${form.watch(`controls.${selectedControl}.type`)}`}
//                     </h4>
//                     <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
//                       {form.watch(`controls.${selectedControl}.description`) || "No description provided"}
//                     </p>
//                   </div>
//                   <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
//                     {form.watch(`controls.${selectedControl}.type`)} {form.watch(`controls.${selectedControl}.index`)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </Form>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Objectives List Sidebar */}
//         <Card className="lg:col-span-1 max-h-[400px] overflow-y-auto">
//           <CardContent className="p-4">
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-sm font-semibold">Objectives</h3>
//                 <span className="text-xs text-muted-foreground">
//                   {objectiveFields.length} items
//                 </span>
//               </div>

//               <div className="space-y-1">
//                 {objectiveFields.map((field, index) => (
//                   <div
//                     key={field.id}
//                     draggable
//                     onDragStart={() => handleDragStart(index)}
//                     onDragOver={(e) => handleDragOver(e, index)}
//                     onDragEnd={handleDragEnd}
//                     className={cn(
//                       "flex items-center gap-2 p-2 rounded-md text-sm cursor-pointer group",
//                       activeObjective === index ? "bg-primary/10" : "hover:bg-muted",
//                       draggedIndex === index && "opacity-50"
//                     )}
//                     onClick={() => setActiveObjective(index)}
//                   >
//                     <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
//                     <div className="flex-1 truncate">
//                       {form.watch(`controls.${selectedControl}.objectives.${index}.name`) || "Untitled objective"}
//                     </div>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
//                       // onClick={(e) => {
//                       //   e.stopPropagation();
//                       //   if (objectiveFields.length > 1) {
//                       //     remove(index);
//                       //     if (activeObjective === index) {
//                       //       setActiveObjective(Math.max(0, index - 1));
//                       //     }
//                       //   } else {
//                       //     form.resetField(`controls.${selectedControl}.objectives.${index}`);
//                       //   }
//                       // }}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (objectiveFields.length > 1) {
//                           remove(index);
//                           if (activeObjective === index) {
//                             setActiveObjective(Math.max(0, index - 1));
//                           }
//                         } else {
//                           remove(index);
//                           setActiveObjective(null);
//                         }
//                       }}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>

//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 className="w-full gap-1"
//                 // onClick={() => {
//                 //   append({
//                 //     name: "",
//                 //     description: "",
//                 //     index: `${form.watch(`controls.${selectedControl}.index`)}.${objectiveFields.length + 1}`,
//                 //   });
//                 //   setActiveObjective(objectiveFields.length);
//                 // }}

//                 onClick={() => {
//                   const newObjectiveIndex = objectiveFields.length;
//                   append({
//                     name: "",
//                     description: "",
//                     index: `${form.watch(`controls.${selectedControl}.index`) || ''}.${newObjectiveIndex + 1}`,
//                   });
//                   setActiveObjective(newObjectiveIndex);

//                   setTimeout(() => {
//                     const objectivePath = `controls.${selectedControl}.objectives.${newObjectiveIndex}`;
//                     form.setValue(`${objectivePath}.name` as `controls.${number}.objectives.${number}.name`, "");
//                     form.setValue(`${objectivePath}.description` as `controls.${number}.objectives.${number}.description`, "");
//                     form.setValue(`${objectivePath}.index` as `controls.${number}.objectives.${number}.index`, `${form.watch(`controls.${selectedControl}.index`) || ''}.${newObjectiveIndex + 1}`);

//                   }, 0);
//                 }}
//               >
//                 <Plus className="h-4 w-4" /> Add Objective
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Objective Edit Form */}
//         <Card className="lg:col-span-3">
//           <CardContent className="pt-6">
//             {activeObjective !== null && activeObjective < objectiveFields.length && (
//               <Form {...form} key={`${selectedControl}-${objectiveFields[activeObjective]?.id}`}>
//                 <div className="space-y-6">
//                   <div className="grid gap-6 sm:grid-cols-2">
//                     {/* <FormField
//                       control={form.control}
//                       name={`controls.${selectedControl}.objectives.${activeObjective}.name`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Name</FormLabel>
//                           <FormControl>
//                             <Input placeholder="e.g., Password Management" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     /> */}

//                     <FormInput
//                       formControl={form.control}
//                       name={`controls.${selectedControl}.objectives.${activeObjective}.name`}
//                       label="Name"
//                       placeholder="e.g., Password Management"
//                     />

//                     {/* <FormField
//                       control={form.control}
//                       name={`controls.${selectedControl}.objectives.${activeObjective}.index`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Index</FormLabel>
//                           <FormControl>
//                             <Input placeholder="e.g., 1.1.1" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     /> */}

//                     <FormInput
//                       formControl={form.control}
//                       name={`controls.${selectedControl}.objectives.${activeObjective}.index`}
//                       label="Index"
//                       placeholder="e.g., 1.1.1"
//                     />

//                     <div className="sm:col-span-2">
//                       {/* <FormField
//                         control={form.control}
//                         name={`controls.${selectedControl}.objectives.${activeObjective}.description`}
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Description</FormLabel>
//                             <FormControl>
//                               <Textarea
//                                 placeholder="Provide a detailed description..."
//                                 className="min-h-[120px] resize-none"
//                                 {...field}
//                               />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       /> */}

//                       <FormTextarea
//                         formControl={form.control}
//                         name={`controls.${selectedControl}.objectives.${activeObjective}.description`}
//                         placeholder="Provide a detailed description..."
//                         label="Description"
//                         className="resize-none min-h-[120px] w-full"
//                         formItemClass="w-full"
//                       />
//                     </div>
//                   </div>

//                   <div className="pt-4 flex justify-between">
//                     <h3 className="text-sm font-semibold">
//                       Objective Preview
//                     </h3>
//                     <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
//                       Objective {form.watch(`controls.${selectedControl}.objectives.${activeObjective}.index`)}
//                     </span>
//                   </div>

//                   <div className="p-4 border rounded-md bg-muted/30">
//                     <h4 className="font-medium">
//                       {form.watch(`controls.${selectedControl}.objectives.${activeObjective}.name`) || "Untitled objective"}
//                     </h4>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       {form.watch(`controls.${selectedControl}.objectives.${activeObjective}.description`) || "No description provided"}
//                     </p>
//                   </div>
//                 </div>
//               </Form>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { UseFormReturn } from "react-hook-form";
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
  Form,
} from "@/shadcn/ui/form";
import { Button } from "@/shadcn/ui/button";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { cn } from "@/shadcn/lib/utils";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";

interface FrameworkFormStep3Props {
  form: UseFormReturn<FrameworkFormValues>;
}

export function FrameworkFormStep3({ form }: FrameworkFormStep3Props) {
  const [selectedControl, setSelectedControl] = useState(0);
  const [activeObjective, setActiveObjective] = useState<number | null>(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Get the controls field array
  const { fields: controlFields } = useFieldArray({
    control: form.control,
    name: "controls",
  });

  // Get the objectives field array for the selected control
  const {
    fields: objectiveFields,
    append,
    remove,
    swap,
  } = useFieldArray({
    control: form.control,
    name: `controls.${selectedControl}.objectives`,
  });

  // Effect to update activeObjective when selectedControl changes
  useEffect(() => {
    // Check if there are objectives for the newly selected control
    const currentObjectives = form.watch(
      `controls.${selectedControl}.objectives`
    );
    if (currentObjectives && currentObjectives.length > 0) {
      // If objectives exist, set activeObjective to the first one (index 0)
      setActiveObjective(0);
    } else {
      // If no objectives exist, set activeObjective to null
      setActiveObjective(null);
    }
  }, [selectedControl, form]); // Depend on selectedControl and form to re-run when they change

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
        <h2 className="text-2xl font-bold tracking-tight">Objectives</h2>
        <p className="text-muted-foreground">
          Define objectives for each control or clause in your framework.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <div className="space-y-6">
              <FormItem>
                <FormLabel>Select Control/Clause</FormLabel>
                <Select
                  value={selectedControl.toString()}
                  onValueChange={(value) => {
                    setSelectedControl(parseInt(value));
                    // The useEffect will now handle setting activeObjective
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a control" />
                  </SelectTrigger>
                  <SelectContent>
                    {controlFields.map((field, index) => (
                      <SelectItem key={field.id} value={index.toString()}>
                        {form.watch(`controls.${index}.index`)} -{" "}
                        {form.watch(`controls.${index}.name`) ||
                          `Untitled ${form.watch(`controls.${index}.type`)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>

              {/* Selected control preview */}
              <div className="p-4 border rounded-md bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {form.watch(`controls.${selectedControl}.name`) ||
                        `Untitled ${form.watch(`controls.${selectedControl}.type`)}`}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {form.watch(`controls.${selectedControl}.description`) ||
                        "No description provided"}
                    </p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {form.watch(`controls.${selectedControl}.type`)}{" "}
                    {form.watch(`controls.${selectedControl}.index`)}
                  </span>
                </div>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Objectives List Sidebar */}
        <Card className="lg:col-span-1 max-h-[400px] overflow-y-auto">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Objectives</h3>
                <span className="text-xs text-muted-foreground">
                  {objectiveFields.length} items
                </span>
              </div>

              <div className="space-y-1">
                {objectiveFields.map((field, index) => (
                  <div
                    key={field.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md text-sm cursor-pointer group",
                      activeObjective === index ? "bg-primary/10" : "hover:bg-muted",
                      draggedIndex === index && "opacity-50"
                    )}
                    onClick={() => setActiveObjective(index)}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div className="flex-1 truncate">
                      {form.watch(
                        `controls.${selectedControl}.objectives.${index}.name`
                      ) || "Untitled objective"}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (objectiveFields.length > 1) {
                          remove(index);
                          if (activeObjective === index) {
                            setActiveObjective(Math.max(0, index - 1));
                          }
                        } else {
                          remove(index);
                          setActiveObjective(null);
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
                  const newObjectiveIndex = objectiveFields.length;
                  append({
                    name: "",
                    description: "",
                    index: `${form.watch(`controls.${selectedControl}.index`) || ""}.${newObjectiveIndex + 1}`,
                  });
                  setActiveObjective(newObjectiveIndex);

                  setTimeout(() => {
                    const objectivePath = `controls.${selectedControl}.objectives.${newObjectiveIndex}`;
                    form.setValue(
                      `${objectivePath}.name` as `controls.${number}.objectives.${number}.name`,
                      ""
                    );
                    form.setValue(
                      `${objectivePath}.description` as `controls.${number}.objectives.${number}.description`,
                      ""
                    );
                    form.setValue(
                      `${objectivePath}.index` as `controls.${number}.objectives.${number}.index`,
                      `${form.watch(`controls.${selectedControl}.index`) || ""}.${newObjectiveIndex + 1}`
                    );
                  }, 0);
                }}
              >
                <Plus className="h-4 w-4" /> Add Objective
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Objective Edit Form */}
        <Card className="lg:col-span-3">
          <CardContent className="pt-6">
            {activeObjective !== null &&
              activeObjective < objectiveFields.length && (
                <Form
                  {...form}
                  key={`${selectedControl}-${objectiveFields[activeObjective]?.id}`}
                >
                  <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormInput
                        formControl={form.control}
                        name={`controls.${selectedControl}.objectives.${activeObjective}.name`}
                        label="Name"
                        placeholder="e.g., Password Management"
                      />

                      <FormInput
                        formControl={form.control}
                        name={`controls.${selectedControl}.objectives.${activeObjective}.index`}
                        label="Index"
                        placeholder="e.g., 1.1.1"
                      />

                      <div className="sm:col-span-2">
                        <FormTextarea
                          formControl={form.control}
                          name={`controls.${selectedControl}.objectives.${activeObjective}.description`}
                          placeholder="Provide a detailed description..."
                          label="Description"
                          className="resize-none min-h-[120px] w-full"
                          formItemClass="w-full"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <h3 className="text-sm font-semibold">
                        Objective Preview
                      </h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Objective{" "}
                        {form.watch(
                          `controls.${selectedControl}.objectives.${activeObjective}.index`
                        )}
                      </span>
                    </div>

                    <div className="p-4 border rounded-md bg-muted/30">
                      <h4 className="font-medium">
                        {form.watch(
                          `controls.${selectedControl}.objectives.${activeObjective}.name`
                        ) || "Untitled objective"}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {form.watch(
                          `controls.${selectedControl}.objectives.${activeObjective}.description`
                        ) || "No description provided"}
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