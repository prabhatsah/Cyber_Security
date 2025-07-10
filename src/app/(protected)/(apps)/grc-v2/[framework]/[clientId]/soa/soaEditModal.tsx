"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shadcn/ui/form";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { Button } from "@/shadcn/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import FormSelect from "@/ikon/components/form-fields/select";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";

const SoaControlFormSchema = z.object({
  clientId: z.string(),
  frameworkId: z.string(),
  refId: z.string(),
  domain: z.string(),
  title: z.string(),
  description: z.string(),
  owners: z.any().array().min(1, "Owner is required"),
  applicable: z.string().min(1, "Applicability is required"),
  justification: z
    .string()
    .min(5, "Justification must be at least 5 characters"),
});

interface Control {
  id: string;
  label: string;
  actualTitle: string;
  actualDescription: string;
  actualIndex: string;
  description: string;
}

interface Framework {
  frameworkId: string;
  frameworkName: string;
  controls: Control[];
}

export default function SoaEditForm({
  open,
  setOpen,
  soaData,
  frameworkId,
  // frameworkName,
  clientId,
  allUsers,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  soaData: any;
  frameworkId: string;
  // frameworkName: string;
  clientId: string;
  allUsers: { value: string; label: string }[];
}) {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [controls, setControls] = useState<Control[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedControls, setExpandedControls] = useState<
    Record<string, boolean>
  >({});
  console.log("SOA DATA IN EDIT FORM", allUsers);
  const form = useForm<z.infer<typeof SoaControlFormSchema>>({
    resolver: zodResolver(SoaControlFormSchema),
    defaultValues: {
      clientId: clientId || "",
      frameworkId: frameworkId || "",
      refId: soaData?.refId || "",
      domain: soaData?.domain || "",
      title: soaData?.title || "",
      description: soaData?.description || "",
      owners: soaData?.owner || [],
      applicable: soaData?.applicable || "Yes",
      justification: soaData?.justification || "",
    },
  });

  // Load frameworks, controls and owners
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Since we already have the framework data in soaData, we can use that
        if (soaData?.Frameworks?.[0]?.controls) {
          const frameworkControls = soaData.Frameworks[0].controls.map(
            (c: any) => ({
              id: c.id,
              label: c.label,
              actualTitle: c.actualTitle,
              actualDescription: c.actualDescription,
              actualIndex: c.actualIndex,
              description: c.description,
            })
          );

          setControls(frameworkControls);

          // Create a framework object for display purposes
          setFrameworks([
            {
              frameworkId: soaData.Frameworks[0].frameworkId,
              frameworkName: soaData.Frameworks[0].frameworkName,
              controls: frameworkControls,
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (open && soaData) {
      loadData();
    }
  }, [open, soaData, clientId]);

  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof SoaControlFormSchema>) => {
    setLoading(true);

    const payload = {
      ...soaData,
      clientId: data.clientId,
      frameworkId: data.frameworkId,
      refId: data.refId,
      domain: data.domain,
      title: data.title,
      description: data.description,
      owners: [],
      applicable: data.applicable,
      justification: data.justification,
      lastUpdated: new Date().toISOString(),
    };

    try {
      const existingRecords = await getMyInstancesV2({
        processName: "SOA New",
        predefinedFilters: { taskName: "edit soa task" },
        mongoWhereClause: `this.Data.clientId == "${data.clientId}" && 
                          this.Data.frameworkId == "${data.frameworkId}" && 
                          this.Data.refId == "${data.refId}"`,
      });

      if (existingRecords?.length > 0) {
        await invokeAction({
          taskId: existingRecords[0].taskId,
          data: payload,
          transitionName: "update edit soa",
          clientId: data.clientId,
        });
        toast.success("SOA updated successfully!", { duration: 4000 });
      } else {
        const processId = await mapProcessName({ processName: "SOA New" });
        await startProcessV2({
          processId,
          data: payload,
          clientId: data.clientId,
        });
        toast.success("SOA created successfully!", { duration: 4000 });
      }
    } catch (error) {
      console.error("Error saving SOA:", error);
      toast.error("Failed to save SOA. Please try again.", { duration: 4000 });
    } finally {
      setLoading(false);
      router.refresh();
      setOpen(false);
    }
  };

  const toggleControl = (controlId: string) => {
    setExpandedControls((prev) => ({
      ...prev,
      [controlId]: !prev[controlId],
    }));
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[60%] h-[90vh] flex flex-col">
        <DialogHeader className="flex-none">
          <DialogTitle>Edit SOA Control</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  formControl={form.control}
                  name="clientId"
                  label="Client ID"
                  disabled
                />
                <FormInput
                  formControl={form.control}
                  name="frameworkId"
                  label="Framework ID"
                  disabled
                />
                <FormInput
                  formControl={form.control}
                  name="refId"
                  label="Reference ID"
                  disabled
                />
                <FormInput
                  formControl={form.control}
                  name="domain"
                  label="Domain"
                  disabled
                />
                <FormInput
                  formControl={form.control}
                  name="title"
                  label="Title"
                  disabled
                />
                <FormMultiComboboxInput
                  disabled
                  formControl={form.control}
                  name="owners" // Make sure this matches your schema
                  label="Owner(s)*"
                  placeholder="Select Owner's"
                  items={allUsers}
                  defaultValue={form.getValues("owners")} // Match the name
                />
              </div>

              <FormTextarea
                formControl={form.control}
                name="description"
                label="Description"
                disabled
                rows={3}
              />

              {/* <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">
                  Framework Controls ({controls.length})
                </h3>
                {controls.length > 0 ? (
                  <div className="space-y-4">
                    {controls.map((control) => (
                      <div key={control.id} className="border p-3 rounded">
                        <div className="grid grid-cols-4 gap-2 mb-2">
                          <div>
                            <p className="text-sm font-medium">Control ID</p>
                            <p className="text-sm">{control.label}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Index</p>
                            <p className="text-sm">{control.actualIndex}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Title</p>
                            <p className="text-sm">{control.actualTitle}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">ID</p>
                            <p className="text-sm">{control.id}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm font-medium">Description</p>
                            <p className="text-sm">{control.description}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Detailed Description
                            </p>
                            <p className="text-sm">
                              {control.actualDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No controls found in the framework data
                  </p>
                )}
              </div> */}

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">
                  Framework Controls ({controls.length})
                </h3>
                {controls.length > 0 ? (
                  <div className="space-y-2">
                    {" "}
                    {controls.map((control) => (
                      <div
                        key={control.id}
                        className="border rounded overflow-hidden"
                      >
                        <div
                          className="p-3 flex justify-between items-center cursor-pointer"
                          onClick={() => toggleControl(control.id)}
                        >
                          <div className="grid grid-cols-4 gap-2 w-full">
                            <div>
                              <p className="text-sm font-medium ">Control ID</p>
                              <p className="text-sm text-gray-500">
                                {control.label}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Index</p>
                              <p className="text-sm text-gray-500">
                                {control.actualIndex}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Title</p>
                              <p className="text-sm text-gray-500">
                                {control.actualTitle}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">ID</p>
                              <p className="text-sm text-gray-500">
                                {control.id}
                              </p>
                            </div>
                          </div>
                          {expandedControls[control.id] ? (
                            <ChevronUp className="h-4 w-4 ml-2" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-2" />
                          )}
                        </div>

                        {expandedControls[control.id] && (
                          <div className="p-3 pt-0 border-t grid grid-cols-2 gap-2 bg-blue-400">
                            <div>
                              <p className="font-bold text-blue-950">
                                Description
                              </p>
                              <p className="text-sm">{control.description}</p>
                            </div>
                            <div>
                              <p className="font-bold text-blue-950">
                                Detailed Description
                              </p>
                              <p className="text-sm">
                                {control.actualDescription}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No controls found in the framework data
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormComboboxInput
                  items={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                    { value: "Partial", label: "Partial" },
                  ]}
                  formControl={form.control}
                  name="applicable"
                  label="Applicable to Organization"
                />

                <FormTextarea
                  formControl={form.control}
                  name="justification"
                  label="Justification"
                  placeholder="Explain why this control is applicable/not applicable"
                  rows={3}
                />
              </div>
              <DialogFooter className="flex-none sticky bottom-0 bg-background py-4 -mx-6 px-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

//new
