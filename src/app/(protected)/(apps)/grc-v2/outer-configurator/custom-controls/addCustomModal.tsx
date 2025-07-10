"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { v4 } from "uuid";
import { ChevronsUpDown, Trash2, SquarePen } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shadcn/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcn/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shadcn/ui/alert-dialog";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import NoDataComponent from "@/ikon/components/no-data";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { FrameworkItemDropdown } from "@/ikon/components/twolevel-dropdown";
import { FrameworkData } from "./page";

// --- Schema and Type Definitions ---
export const CustomControlSchema = z.object({
  REF_ID: z.string().optional(),
  TITLE: z.string().min(1, { message: "Title is required" }),
  DOMAIN: z.string().min(1, { message: "Domain is required" }),
  DESCRIPTION: z.string().optional(),
  EVIDENCE_REQUIRED: z
    .string()
    .min(1, { message: "Evidence Required is required" })
    .optional(),
  OWNER: z.array(z.string()).min(1, { message: "Owner is required" }),
  LINK_FRAMEWORK: z.string().optional(),
  CONTROL_NAME: z.array(z.string()).optional(),
});

interface AddedFramework {
  frameworkId: string;
  frameworkName: string;
  controls: {
    id: string;
    label: string;
    description?: string;
    actualIndex?: string;
    actualTitle?: string;
    actualDescription?: string;
  }[];
}

const evidanceRequiredOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

// --- MAIN FORM COMPONENT ---
export default function CustomControlForm({
  open,
  setOpen,
  userIdNameMap,
  profileData,
  frameWorkData,
  editData,
  domainData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userIdNameMap: { value: string; label: string }[];
  profileData: Record<string, any>;
  frameWorkData: FrameworkData[];
  editData: Record<string, any> | null;
  domainData: Record<string, any>[];
}) {
  const router = useRouter();
  const [addedFrameworks, setAddedFrameworks] = useState<AddedFramework[]>([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [frameworkToDeleteId, setFrameworkToDeleteId] = useState<string | null>(
    null
  );

  const form = useForm<z.infer<typeof CustomControlSchema>>({
    resolver: zodResolver(CustomControlSchema),
    defaultValues: {
      REF_ID: editData ? editData.refId : "",
      TITLE: editData ? editData.title : "",
      DOMAIN: editData ? editData.domain : "",
      DESCRIPTION: editData ? editData.description : "",
      OWNER: editData ? editData.owner : [],
      EVIDENCE_REQUIRED: editData ? editData.evidenceRequired : "",
      LINK_FRAMEWORK: "",
      CONTROL_NAME: [],
    },
  });

  useEffect(() => {
    if (!editData) {
      const generateRefId = () =>
        `CN-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      form.setValue("REF_ID", generateRefId());
    }
    if (editData?.Frameworks) {
      setAddedFrameworks(editData.Frameworks);
    }
  }, [editData, form]);

  const domainType = domainData?.[0]?.domain
    ? Object.values(domainData[0].domain)
        .filter((item: any) => item && item.domainId && item.domain)
        .map((item: any) => ({
          value: item.domainId,
          label: item.domain,
        }))
    : [];

  const selectedFrameworkId = form.watch("LINK_FRAMEWORK");

  const frameworkOptions = useMemo(
    () =>
      frameWorkData.map((fw) => ({
        value: fw.id,
        label: fw.name,
      })),
    [frameWorkData]
  );

  const selectedFrameworkData = useMemo(() => {
    if (!selectedFrameworkId) return null;
    return frameWorkData.find((fw) => fw.id === selectedFrameworkId) || null;
  }, [selectedFrameworkId, frameWorkData]);

  const handleAddFrameworkToList = () => {
    const { LINK_FRAMEWORK, CONTROL_NAME } = form.getValues();

    if (!LINK_FRAMEWORK || !CONTROL_NAME || CONTROL_NAME.length === 0) {
      toast.error("Please select a framework and at least one control.", {
        duration: 2000,
      });
      return;
    }

    const frameworkInfo = selectedFrameworkData;
    if (!frameworkInfo) return;

    const selectedControlDetails = CONTROL_NAME.map(
      (id) => frameworkInfo.entries[id]
    )
      .filter(Boolean)
      .map((entry) => ({
        id: entry.id,
        label: entry.index,
        description: entry.title,
        actualIndex: entry.index,
        actualTitle: entry.title,
        actualDescription: entry.description,
      }));

    setAddedFrameworks((prev) => {
      const existing = prev.find((fw) => fw.frameworkId === LINK_FRAMEWORK);
      if (existing) {
        return prev.map((fw) =>
          fw.frameworkId === LINK_FRAMEWORK
            ? { ...fw, controls: selectedControlDetails }
            : fw
        );
      }
      return [
        ...prev,
        {
          frameworkId: LINK_FRAMEWORK,
          frameworkName: frameworkInfo.name,
          controls: selectedControlDetails,
        },
      ];
    });

    form.reset({
      ...form.getValues(),
      LINK_FRAMEWORK: "",
      CONTROL_NAME: [],
    });
  };

  const handleRemoveFramework = (frameworkId: string) => {
    setAddedFrameworks((prev) =>
      prev.filter((fw) => fw.frameworkId !== frameworkId)
    );
  };

  const handleEditLink = (fw: AddedFramework) => {
    form.setValue("LINK_FRAMEWORK", fw.frameworkId);
    form.setValue(
      "CONTROL_NAME",
      fw.controls.map((c) => c.id)
    );
  };

  async function saveData(data: z.infer<typeof CustomControlSchema>) {
    // ... your existing saveData logic ...
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="!max-w-none !w-screen !h-screen overflow-y-auto flex flex-col p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle>
            {editData ? "Edit" : "Create"} Custom Control
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(saveData)}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex-1 grid grid-cols-[5fr_7fr] gap-4 min-h-0 overflow-hidden px-6 pb-0">
              {/* Left Side */}
              <div className="overflow-y-auto pr-4 h-full border-muted bg-card-new p-4 rounded-md">
                <div className="grid grid-cols-1 gap-3 mb-3">
                  <FormInput
                    formControl={form.control}
                    name={"REF_ID"}
                    label="Reference Id"
                    disabled
                  />
                  <FormInput
                    formControl={form.control}
                    name={"TITLE"}
                    placeholder="Enter Title"
                    label={
                      <>
                        Title<span className="text-red-500 font-bold"> *</span>
                      </>
                    }
                  />
                  <FormComboboxInput
                    items={domainType}
                    formControl={form.control}
                    name="DOMAIN"
                    placeholder="Select Domain"
                    label={
                      <>
                        Domain
                        <span className="text-red-500 font-bold"> *</span>
                      </>
                    }
                  />
                  <FormMultiComboboxInput
                    items={userIdNameMap}
                    formControl={form.control}
                    name={"OWNER"}
                    placeholder="Select Owner"
                    label={
                      <>
                        Owner<span className="text-red-500 font-bold"> *</span>
                      </>
                    }
                    defaultOptions={3}
                  />
                  <FormComboboxInput
                    items={evidanceRequiredOptions}
                    formControl={form.control}
                    name="EVIDENCE_REQUIRED"
                    placeholder="Select Evidence Required"
                    label={
                      <>
                        Evidence Required
                        <span className="text-red-500 font-bold"> *</span>
                      </>
                    }
                  />
                </div>
                <FormTextarea
                  formControl={form.control}
                  name={"DESCRIPTION"}
                  placeholder="Enter Description"
                  label="Description"
                  className="resize-y min-h-[150px] w-full"
                />
              </div>

              {/* Right Side */}
              <div className="overflow-y-auto pl-4 border-l border-muted h-full flex flex-col gap-4">
                <div className="p-4 rounded-md bg-card-new">
                  <h3 className="text-lg font-semibold mb-3">
                    Link Frameworks and Controls
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-start">
                    <FormComboboxInput
                      items={frameworkOptions}
                      formControl={form.control}
                      name="LINK_FRAMEWORK"
                      placeholder="Select Framework"
                      label="Select Framework"
                    />
                    <FormField
                      control={form.control}
                      name="CONTROL_NAME"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Controls</FormLabel>
                          <FormControl>
                            {selectedFrameworkData ? (
                              <FrameworkItemDropdown
                                processedData={selectedFrameworkData.processed}
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder="Select Controls"
                                searchPlaceholder="Search should be perform in child level only..."
                              />
                            ) : (
                              <Button
                                variant="outline"
                                disabled
                                className="w-full justify-between font-normal text-muted-foreground"
                              >
                                Select a framework first
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button type="button" onClick={handleAddFrameworkToList}>
                      {addedFrameworks.some(
                        (fw) => fw.frameworkId === selectedFrameworkId
                      )
                        ? "Update in List"
                        : "Add to List"}
                    </Button>
                  </div>
                </div>

                {/* Linked Frameworks Accordion - UPDATED DESIGN */}
                <div className="flex-1 p-4 rounded-md bg-card-new space-y-3 overflow-y-auto">
                  <h3 className="text-lg font-semibold">Linked Frameworks</h3>
                  {addedFrameworks.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      <TooltipProvider>
                        {addedFrameworks.map((fw) => (
                          <AccordionItem
                            key={fw.frameworkId}
                            value={fw.frameworkId}
                          >
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex justify-between items-center w-full pr-4">
                                <h4 className="font-semibold text-left">
                                  {fw.frameworkName}
                                </h4>
                                <div className="flex items-center gap-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        role="button"
                                        aria-label="Edit"
                                        className="flex items-center justify-center p-2 rounded-md hover:bg-accent cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditLink(fw);
                                        }}
                                      >
                                        <SquarePen className="h-4 w-4" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Edit</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        role="button"
                                        aria-label="Remove"
                                        className="flex items-center justify-center p-2 rounded-md text-red-500 hover:bg-accent hover:text-red-600 cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setFrameworkToDeleteId(
                                            fw.frameworkId
                                          );
                                          setOpenDeleteAlert(true);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Remove</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid gap-3 p-4 bg-background border rounded-md">
                                {fw.controls.length > 0 ? (
                                  fw.controls.map((c) => (
                                    <div
                                      key={c.id}
                                      className="border-b pb-3 last:border-b-0 last:pb-0"
                                    >
                                      <p className="font-semibold text-base text-foreground mb-1">
                                        {c.actualIndex} - {c.actualTitle}
                                      </p>
                                      {c.actualDescription && (
                                        <p className="text-sm text-muted-foreground leading-snug">
                                          {c.actualDescription}
                                        </p>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-muted-foreground text-center py-2">
                                    No controls linked to this framework.
                                  </p>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </TooltipProvider>
                    </Accordion>
                  ) : (
                    <NoDataComponent />
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="shrink-0 px-6 pb-6 pt-4">
              <Button type="submit" onClick={form.handleSubmit(saveData)}>
                {editData ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        <AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Want to remove this linked framework and its controls? This
                can’t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setOpenDeleteAlert(false);
                  setFrameworkToDeleteId(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (frameworkToDeleteId) {
                    handleRemoveFramework(frameworkToDeleteId);
                  }
                  setOpenDeleteAlert(false);
                  setFrameworkToDeleteId(null);
                }}
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
