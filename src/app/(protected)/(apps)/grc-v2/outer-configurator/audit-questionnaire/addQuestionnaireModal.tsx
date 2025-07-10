"use client";

import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Textarea } from "@/shadcn/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Label } from "@/shadcn/ui/label";
import { Badge } from "@/shadcn/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shadcn/ui/accordion";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";

// Zod schema for validating the questionnaire form
export const QuestionnaireSchema = z.object({
  questions: z.array(
    z.object({
      value: z.string().min(1, { message: "Question cannot be empty." }),
    })
  ),
});

export default function AuditQuestionnaireForm({
  open,
  setOpen,
  userIdNameMap,
  populatedData,
  existQuestionnaireData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userIdNameMap: { value: string; label: string }[];
  populatedData: Record<string, any> | null;
  existQuestionnaireData: Record<string, any> | null;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof QuestionnaireSchema>>({
    resolver: zodResolver(QuestionnaireSchema),
    defaultValues: {
      questions: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  // Effect to reset the form state when opening for a new/different item
  // useEffect(() => {
  //   if (open) {
  //     if (existQuestionnaireData && Array.isArray(existQuestionnaireData.questions)) {
  //       const questionValues = existQuestionnaireData.questions.map((q: string) => ({ value: q }));
  //       form.reset({ questions: questionValues.length > 0 ? questionValues : [{ value: "" }] });
  //     } else {
  //       form.reset({ questions: [{ value: "" }] });
  //     }
  //   }
  // }, [open, existQuestionnaireData, form]);

  useEffect(() => {
    if (open) {
      if (
        existQuestionnaireData &&
        Array.isArray(existQuestionnaireData.questions)
      ) {
        form.reset({
          questions:
            existQuestionnaireData.questions.length > 0
              ? existQuestionnaireData.questions
              : [{ value: "" }],
        });
      } else {
        form.reset({ questions: [{ value: "" }] });
      }
    }
  }, [open, existQuestionnaireData, form]);

  async function saveData(data: z.infer<typeof QuestionnaireSchema>) {
    const finalData = {
      refId: populatedData?.refId,
      frameworkIds: populatedData?.Frameworks?.map(
        (fw: any) => fw.frameworkId
      ),
      controlId: populatedData?.customControlId,
      questions: data.questions,
      addedOn: new Date().toISOString(),
      addedBy: "globalAccount",
    };
    console.log("Saving data:", finalData);

    try {
      if (existQuestionnaireData) {
        const rulesInstances = await getMyInstancesV2({
          processName: "Audit Questionnaire",
          predefinedFilters: { taskName: "Edit Questionnaire" },
          mongoWhereClause: `this.Data.controlId == "${existQuestionnaireData.controlId}"`,
        });

        const taskId = rulesInstances[0]?.taskId;
        await invokeAction({
          taskId,
          data: finalData,
          transitionName: "Update Edit Questionnaire",
          processInstanceIdentifierField: "controlId",
        });
      } else {
        const questionnaireProcessId = await mapProcessName({
          processName: "Audit Questionnaire",
        });
        await startProcessV2({
          processId: questionnaireProcessId,
          data: finalData,
          processIdentifierFields: "controlId",
        });
      }

      toast.success(
        `Custom Control ${
          existQuestionnaireData ? "updated" : "saved"
        } successfully!`,
        { duration: 2000 }
      );
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to process form:", error);
      toast.error("Failed to save the custom control.", { duration: 2000 });
    }
  }

  // Helper to find owner names from IDs
  const getOwnerNames = (ownerIds: string[] | undefined) => {
    if (!Array.isArray(ownerIds)) return "N/A";
    return ownerIds
      .map((id) => userIdNameMap.find((user) => user.value === id)?.label)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="!max-w-none !w-screen !h-screen overflow-y-auto flex flex-col p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle className="text-xl">
            {existQuestionnaireData ? "Edit" : "Add"} Audit Questionnaire
          </DialogTitle>
          {populatedData && (
            <DialogDescription>
              For control: {populatedData.title} ({populatedData.refId})
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(saveData)}
            className="flex-1 grid grid-cols-2 gap-y-4 overflow-hidden p-6"
          >
            {/* Left Column: Details & Frameworks */}
            <div className="flex flex-col gap-y-4 overflow-y-auto pr-3 border-r">
              {/* Top-Left: Control Details */}
              <div className="p-4 rounded-lg bg-muted/40 border">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                  Control Details
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-foreground/50">
                        Reference ID
                      </Label>
                      <p className="text-sm font-medium">
                        {populatedData?.refId || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-foreground/50">
                        Domain
                      </Label>
                      <p className="text-sm font-medium">
                        {populatedData?.domain || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-foreground/50">Title</Label>
                    <p className="text-sm font-medium">
                      {populatedData?.title || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-foreground/50">
                      Owner(s)
                    </Label>
                    <p className="text-sm font-medium">
                      {getOwnerNames(populatedData?.owner)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-foreground/50">
                      Description
                    </Label>
                    <p className="text-sm font-medium whitespace-pre-wrap">
                      {populatedData?.description || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom-Left: Linked Frameworks */}
              <div className="p-4 rounded-lg bg-muted/40 border">
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">
                  Linked Frameworks & Controls
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {populatedData?.Frameworks?.map((fw: any) => {
                    // 1. Get all potential indices (parentIndex or fallback to actualIndex)
                    const allIndices = fw.controls.map(
                      (ctrl: any) => ctrl.parentIndex || ctrl.actualIndex
                    );

                    // 2. Create a unique array of those indices
                    const uniqueIndices = [...new Set(allIndices)];

                    return (
                      <AccordionItem
                        value={fw.frameworkId}
                        key={fw.frameworkId}
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 w-full">
                            <span className="font-semibold">
                              {fw.frameworkName}
                            </span>
                            <Badge className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                              {fw.controls.length}
                            </Badge>
                            <div className="hidden md:flex flex-wrap gap-1.5 ml-auto">
                              {(uniqueIndices as string[])
                                .slice(0, 4)
                                .map((index) => (
                                  <Badge key={index} variant="secondary">
                                    {index}
                                  </Badge>
                                ))}
                              {uniqueIndices.length > 4 && (
                                <Badge variant="secondary">...</Badge>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-3 pt-2">
                            {fw.controls.map((ctrl: any) => (
                              <li
                                key={ctrl.id}
                                className="p-3 bg-background rounded-md border"
                              >
                                <p className="font-semibold">
                                  {ctrl.label}: {ctrl.actualTitle}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {ctrl.actualDescription}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </div>

            {/* Right Column: Questionnaire */}
            <div className="overflow-y-auto pl-3">
              <div className="p-4 rounded-lg bg-muted/40 border h-full">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                  Create Questionnaire
                </h3>
                <div className="space-y-6 mb-6 overflow-y-auto h-[60vh]">
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`questions.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel>Question {index + 1}</FormLabel>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <FormControl>
                            <Textarea
                              placeholder="Add Question here"
                              {...field}
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ value: "" })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Another Question
                </Button>
              </div>
            </div>

            <DialogFooter className="col-span-2 shrink-0 px-0 pb-0">
              <Button type="submit">
                {existQuestionnaireData ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
