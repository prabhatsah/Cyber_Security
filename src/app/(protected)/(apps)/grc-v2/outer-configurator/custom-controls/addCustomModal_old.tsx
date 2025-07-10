"use client";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import { Trash2, SquarePen, AlertCircle } from "lucide-react";
import { FlexibleGroupedCheckboxDropdown } from "@/shadcn/ui/FlexiGroupedCheckboxDropdown";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shadcn/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shadcn/ui/alert-dialog"; // Adjust path as needed
import NoDataComponent from "@/ikon/components/no-data";

export const CustomControlSchema = z.object({
  REF_ID: z.string().optional(),
  TITLE: z.string().min(1, { message: "Title is required" }),
  DOMAIN: z.string().min(1, { message: "Domain is required" }),
  DESCRIPTION: z.string().optional(),
  EVIDENCE_REQUIRED: z.string().min(1, { message: "Evidence Required is required" }).optional(),
  OWNER: z.array(z.string()).min(1, { message: "Owner is required" }),
  // OWNER: z.array(z.string()).optional(),
  // These two fields are for staging the selection before adding to the list
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

export default function CustomControlForm({ open, setOpen, userIdNameMap, profileData, frameWorkData, entryDropDownData, editData }: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userIdNameMap: { value: string; label: string }[];
  profileData: Record<string, any>;
  frameWorkData: Record<string, any>[];
  entryDropDownData: Record<string, any>;
  editData: Record<string, any> | null;
}) {
  const router = useRouter();
  // console.log("Entry drop down data", entryDropDownData);
  // console.log("Framework data", frameWorkData);

  const [addedFrameworks, setAddedFrameworks] = useState<AddedFramework[]>([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [frameworkToDeleteId, setFrameworkToDeleteId] = useState<string | null>(null);

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
  }, [editData, form]);

  useEffect(() => {
    if (editData?.Frameworks) {
      setAddedFrameworks(editData.Frameworks);
    }
  }, [editData]);

  // Watch the value of the framework dropdown
  const selectedFrameworkId = form.watch("LINK_FRAMEWORK");
  const frameworkOptions = useMemo(() =>
    frameWorkData.map((fw) => ({
      value: fw.id,
      label: fw.name,
    })),
    [frameWorkData]
  );

  const controlOptions = useMemo(() => {
    if (!selectedFrameworkId || !entryDropDownData) return [];
    return entryDropDownData[selectedFrameworkId] || [];
  }, [selectedFrameworkId, entryDropDownData]);

  const handleAddFrameworkToList = () => {
    const { LINK_FRAMEWORK, CONTROL_NAME } = form.getValues();

    if (!LINK_FRAMEWORK || !CONTROL_NAME || CONTROL_NAME.length === 0) {
      toast.error("Please select a framework and at least one control.", {
        duration: 2000,
      });
      return;
    }

    const frameworkInfo = frameWorkData.find((fw) => fw.id === LINK_FRAMEWORK);
    if (!frameworkInfo) return;

    // Get full control details (id, label, description) for the selected IDs
    const allPossibleControls = controlOptions.flatMap((group: any) => group.options);
    const selectedControlDetails = CONTROL_NAME.map((id) => allPossibleControls.find((c: any) => c.id === id)).filter(Boolean);

    setAddedFrameworks((prev) => {
      const existing = prev.find((fw) => fw.frameworkId === LINK_FRAMEWORK);
      if (existing) {
        // If framework already in list, update its controls
        return prev.map((fw) =>
          fw.frameworkId === LINK_FRAMEWORK ? { ...fw, controls: selectedControlDetails } : fw
        );
      }
      // Otherwise, add it as a new entry
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

  async function saveData(data: z.infer<typeof CustomControlSchema>) {
    const finalData = {
      customControlId: editData ? editData.customControlId : v4(),
      refId: data.REF_ID,
      title: data.TITLE,
      domain: data.DOMAIN,   
      description: data.DESCRIPTION || "",
      owner: data.OWNER,
      evidenceRequired: data.EVIDENCE_REQUIRED,
      Frameworks: addedFrameworks,
      createdBy: profileData.USER_ID,
      createdOn: new Date().toISOString(),
    };
    console.log("Final Data to be saved:", finalData);

    try {
      if (editData) {
        const rulesInstances = await getMyInstancesV2({
          processName: "Custom Controls",
          predefinedFilters: { taskName: "Edit Rules" },
          mongoWhereClause: `this.Data.customControlId == "${editData.customControlId}"`,
        });

        const taskId = rulesInstances[0]?.taskId;
        await invokeAction({
          taskId,
          data: finalData,
          transitionName: "Update Edit Rules",
          processInstanceIdentifierField: "customControlId",
        });
      } else {
        const customControlProcessId = await mapProcessName({ processName: "Custom Controls" });
        await startProcessV2({
          processId: customControlProcessId,
          data: finalData,
          processIdentifierFields: "customControlId",
        });
      }

      setOpen(false);
      router.refresh();
      toast.success(`Custom Control ${editData ? "updated" : "saved"} successfully!`, { duration: 2000 });
    } catch (error) {
      console.error("Failed to process form:", error);
      toast.error("Failed to save the custom control.", { duration: 2000 });
    }
  }

  // When the user selects a framework from the list to edit, populate the form
  const handleEditLink = (fw: AddedFramework) => {
    form.setValue("LINK_FRAMEWORK", fw.frameworkId);
    form.setValue(
      "CONTROL_NAME",
      fw.controls.map((c) => c.id)
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-none !w-screen !h-screen overflow-y-auto flex flex-col p-0" onInteractOutside={(e) => e.preventDefault()} >
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle> {editData ? "Edit" : "Create"} Custom Control </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(saveData)} className="flex-1 flex flex-col min-h-0" >
            <div className="flex-1 grid grid-cols-[5fr_7fr] gap-4 min-h-0 overflow-hidden px-6 pb-0">
              {/* Left Side: Core Details */}
              <div className="overflow-y-auto pr-4 h-full border-muted bg-card-new p-4 rounded-md">
                <div className="grid grid-cols-1 gap-3 mb-3">
                  <FormInput formControl={form.control} name={"REF_ID"} label="Reference Id" disabled/>
                  <FormInput formControl={form.control} name={"TITLE"} placeholder="Enter Title"
                    label={<>Title<span className="text-red-500 font-bold"> *</span></>}
                  />
                  <FormInput formControl={form.control} name={"DOMAIN"} placeholder="Enter Domain"
                    label={<>Domain<span className="text-red-500 font-bold"> *</span></>}
                  />
                  <FormMultiComboboxInput items={userIdNameMap} formControl={form.control} name={"OWNER"} placeholder="Select Owner"
                    label={<>Owner<span className="text-red-500 font-bold"> *</span></>}
                    defaultOptions={3}
                  />
                  <FormComboboxInput items={evidanceRequiredOptions} formControl={form.control} name="EVIDENCE_REQUIRED" placeholder="Select Evidence Required" 
                    label={<>Evidence Required<span className="text-red-500 font-bold"> *</span></>}
                  />
                </div>
                <FormTextarea formControl={form.control} name={"DESCRIPTION"} placeholder="Enter Description" label="Description" className="resize-y min-h-[150px] w-full"/>
              </div>

              {/* Right Side: Framework & Controls Logic */}
              <div className="overflow-y-auto pl-4 border-l border-muted h-full flex flex-col gap-4">
                <div className="p-4 rounded-md bg-card-new">
                  <h3 className="text-lg font-semibold mb-3">
                    Link Frameworks and Controls
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <FormComboboxInput items={frameworkOptions} formControl={form.control} name="LINK_FRAMEWORK" placeholder="Select Framework" label="Select Framework"/>
                    <FormField
                      control={form.control}
                      name="CONTROL_NAME"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Controls</FormLabel>
                          <FormControl>
                            <FlexibleGroupedCheckboxDropdown
                              groups={controlOptions}
                              value={field.value || []}
                              onChange={field.onChange}
                              placeholder="Select Controls"
                              searchPlaceholder="Search..."
                              multiSelect={true}
                              disabled={!selectedFrameworkId}
                            />
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
                            <AccordionTrigger>
                              <div className="flex justify-between items-center w-full pr-4">
                                <h4 className="font-semibold">
                                  {fw.frameworkName}
                                </h4>
                                <div className="flex items-center">
                                  {/* Edit action with Lucide icon and Tooltip */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 cursor-pointer" // Mimics Button's ghost and sm variant
                                        onClick={(e) => {
                                          e.stopPropagation(); // Still essential to prevent accordion from toggling
                                          handleEditLink(fw);
                                        }}
                                        role="button"
                                        tabIndex={0}
                                      >
                                        <SquarePen className="h-4 w-4" />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Edit</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  {/* Delete action with Tooltip and AlertDialog trigger */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 text-red-500 cursor-pointer ml-1" // Mimics Button's ghost and sm variant, added ml-1 for spacing
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setFrameworkToDeleteId(fw.frameworkId);
                                          setOpenDeleteAlert(true);
                                        }}
                                        role="button"
                                        tabIndex={0}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Remove</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              {/* START: Updated AccordionContent UI */}
                              <div className="grid gap-3 p-4 bg-background border rounded-md">
                                {fw.controls.length > 0 ? (
                                  fw.controls.map((c) => (
                                    <div key={c.id} className="border-b pb-3 last:border-b-0 last:pb-0" >
                                      <p className="font-semibold text-base text-foreground mb-1">
                                        {c.actualIndex} - {c.actualTitle}
                                      </p>
                                      {c.actualDescription && (
                                        <p className="text-sm text-muted-foreground leading-snug">{c.actualDescription}</p>
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
              <Button type="submit">{editData ? "Update" : "Save"}</Button>
            </DialogFooter>
          </form>
        </Form>

        <AlertDialog open={openDeleteAlert} onOpenChange={setOpenDeleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Want to remove this linked framework and its controls? This can’t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setOpenDeleteAlert(false);
                  setFrameworkToDeleteId(null);
                }}
              > Cancel </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (frameworkToDeleteId) {
                    handleRemoveFramework(frameworkToDeleteId); // Trigger the actual removal
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


