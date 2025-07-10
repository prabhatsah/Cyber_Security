"use client";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchControlObjectiveData,
  fetchFrameWorkData,
  startAuditData,
} from "@/app/(protected)/(apps)/grc/governance/audit/component/(backend-calls)";;
import { CreateUserMap } from "../../../../components/createUserMap";
import FormDateInput from "@/ikon/components/form-fields/date-input";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import { Form } from "@/shadcn/ui/form";
import { useForm } from "react-hook-form";
import AuditTable from "../auditTable/auditTable";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { getProfileData } from "@/ikon/utils/actions/auth";

export const AuditFormSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  auditeeMembers: z.array(z.string()).nonempty({
    message: "At least one auditee must be selected",
  }),
  auditorMembers: z.array(z.string()).nonempty({
    message: "At least one auditor must be selected",
  }),
  auditName: z.string().min(1, {
    message: "Audit name is required",
  }),
  auditType: z.enum(["bestPractice", "standard", "rulesAndRegulation"], {
    required_error: "Audit type is required",
  }),
  frameworkId: z.string({
    required_error: "Framework is required",
  }),
});

export type AuditFormValues = z.infer<typeof AuditFormSchema>;

export default function AuditConfigurationDialog() {
  const router = useRouter();
  const [auditType, setAuditType] = useState("");
  const [frameworkId, setFrameworkId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [auditName, setAuditName] = useState("");
  const [frameworks, setFrameworks] = useState<any>([]);
  const [controls, setControls] = useState<any>([]);
  const [userMap, setUserMap] = useState<{ value: string; label: string }[]>(
    []
  );
  const [expandedControls, setExpandedControls] = useState<
    Record<string, boolean>
  >({});
  const [selectedControls, setSelectedControls] = useState<string[]>([]);

  const [profileData, setProfileData] = useState<any>(null);

  const [showControlsSection, setShowControlsSection] = useState(false);

  const form = useForm<AuditFormValues>({
    resolver: zodResolver(AuditFormSchema),
    defaultValues: {
      auditorMembers: [],
      auditeeMembers: [],
      auditName: "",
      auditType: undefined,
      frameworkId: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileData();
        setProfileData(data); // Store the profile data in state
        console.log("Profile Data:", data); // Log the profile data for debugging
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchProfile();
  }, []);


  const calculateControlTotal = (controlIndex: number) => {
    return (
      // frameworkData &&
      // frameworkData.controls[controlIndex].objectives.reduce(
      //   (sum, obj) => sum + (obj.weight || 0),
      //   0
      // )
      0
    );
  };
  // Get controls for the selected framework
  const getFrameworkControls = () => {
    if (!frameworkId) return [];
    const selectedFramework = frameworks.find(
      (f) => f.frameworkId === frameworkId
    );
    if (!selectedFramework) return [];
    return controls.filter(
      (control) => control.frameworkType === selectedFramework.frameworkType
    );
  };

  const frameworkControls = getFrameworkControls();
  console.log('frameworkControls', frameworkControls)

  // Toggle control expansion
  const toggleControl = (controlNo: string) => {
    setExpandedControls((prev) => ({
      ...prev,
      [controlNo]: !prev[controlNo],
    }));
  };

  // Toggle control selection
  const toggleSelectControl = (controlNo: string) => {
    setSelectedControls((prev) =>
      prev.includes(controlNo)
        ? prev.filter((no) => no !== controlNo)
        : [...prev, controlNo]
    );
  };

  // Select/deselect all controls
  const toggleSelectAllControls = () => {
    const allControlIds = frameworkControls
      .flatMap((framework) => framework.controls.map((control) => control.controlId)); // Flatten all control IDs

    if (selectedControls.length === allControlIds.length) {
      // If all controls are already selected, deselect all
      setSelectedControls([]);
    } else {
      // Otherwise, select all controls
      setSelectedControls(allControlIds);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [frameworks, controls, users] = await Promise.all([
          fetchFrameWorkData(),
          fetchControlObjectiveData(),
          CreateUserMap(),
        ]);
        setFrameworks(frameworks);
        setControls(controls);
        setUserMap(users);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  const handleCreateAudit = async (auditData: any) => {
    try {
      await startAuditData(auditData);
      toast.success("Audit created successfully!");
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Some error happened while creating audit!");
      console.error("Submission failed:", error);
    }
  };

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.startDate) {
        setStartDate(format(values.startDate, SAVE_DATE_FORMAT_GRC || "PPP"));
      }
      if (values.endDate) {
        setEndDate(format(values.endDate, SAVE_DATE_FORMAT_GRC || "PPP"));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
      setAuditType("");
      setFrameworkId("");
      setStartDate("");
      setEndDate("");
      setAuditName("");
      setSelectedControls([]);
      setExpandedControls({});
    }
  }, [isDialogOpen, form]);


  const handleControlWeightChange = (controlId: string, value: string) => {
    const newWeight = Math.min(100, Math.max(0, parseInt(value) || 0)); // Ensure weight is between 0 and 100
    console.log("Selected Controls:", selectedControls); // Log the selected controls array

    setControls((prevControls) => {
      return prevControls.map((framework) => {
        // Update the controls within each framework
        return {
          ...framework,
          controls: framework.controls.map((control) => {
            if (selectedControls.includes(control.controlId)) { // Use selectedControls for comparison
              if (controlId == control.controlId) {
                // Return a new control object with updated weight
                return {
                  ...control,
                  controlWeight: newWeight, // Update controlWeight
                };
              } else {
                return control;
              }

            }
            return control;
          }),
        };
      });
    });
  };

  const handleObjectiveWeightChange = (
    controlId: string,
    objectiveIndex: number,
    value: string
  ) => {
    const newWeight = Math.min(100, Math.max(0, parseInt(value) || 0)); // Ensure weight is between 0 and 100
    console.log(controlId, objectiveIndex, value);
    console.log("Selected Controls:", selectedControls); // Log the selected controls array
    setControls((prevControls) => {
      return prevControls.map((framework) => {
        // Update the controls within each framework
        return {
          ...framework,
          controls: framework.controls.map((control) => {
            if (selectedControls.includes(control.controlId)) { // Use selectedControls for comparison
              if (controlId == control.controlId) {
                // Create a deep copy of the control's objectives
                const updatedObjectives = [...control.controlObjectives];
                updatedObjectives[objectiveIndex] = {
                  ...updatedObjectives[objectiveIndex],
                  controlObjWeight: newWeight, // Update controlObjWeight
                };
                // Return a new control object with updated objectives
                return {
                  ...control,
                  controlObjectives: updatedObjectives,
                };
              } else {
                return control; // Return the control as is if it doesn't match
              }

            }
            return control;
          }),
        };
      });
    });
  };
  // Validate that the sum of selected control weights equals 100
  const validateControlWeights = () => {
    const totalWeight = frameworkControls
      .filter((control) => selectedControls.includes(control.controlId))
      .reduce((sum, control) => sum + (control.weight || 0), 0);
    return totalWeight === 100;
  };

  // Validate that the sum of weights for each control's objectives equals 100
  const validateObjectiveWeights = () => {
    return frameworkControls.every((control) => {
      if (!selectedControls.includes(control.controlId)) return true; // Skip unselected controls
      const totalObjectiveWeight = control.controlObjectives.reduce(
        (sum, objective) => sum + (objective.weight || 0),
        0
      );
      return totalObjectiveWeight === 100;
    });
  };

  // Validate that the sum of weights for each control's objectives of selected controls equals 100
  const validateControlObjectiveWeightsOfSelectedControl = () => {
    console.log("Frameworks:", frameworks); // Log the frameworks array
    console.log("Selected Controls:", selectedControls); // Log the selected controls array

    const flattenedControls = controls.flatMap((c) => c.controls || []);
    console.log("Flattened Controls:", flattenedControls); // Log the flattened controls array

    const filteredControls = flattenedControls.filter((control) =>
      selectedControls.includes(control.controlId)
    );
    console.log("Filtered Controls (Selected):", filteredControls); // Log the filtered controls (selected ones)

    // Check if the sum of controlObjWeight for each selected control equals 100
    const isValid = filteredControls.every((control) => {
      const totalObjectiveWeight = control.controlObjectives.reduce(
        (sum, objective) => sum + (objective.controlObjWeight || 0),
        0
      );
      console.log(
        `Total Objective Weight for Control (${control.controlId}):`,
        totalObjectiveWeight
      ); // Log the total weight of objectives for each control
      return totalObjectiveWeight === 100; // Return true if the total weight is 100
    });

    return isValid; // Return true if all selected controls have valid objective weights
  };

  // Validation function to check if the sum of selected control weights equals 100
  const validateSelectedControlWeights = () => {
    console.log("Frameworks:", frameworks); // Log the frameworks array
    console.log("Selected Controls:", selectedControls); // Log the selected controls array

    const flattenedControls = controls.flatMap((c) => c.controls || [])
    console.log("Flattened Controls:", flattenedControls); // Log the flattened controls array

    const filteredControls = flattenedControls.filter((control) =>
      selectedControls.includes(control.controlId)
    );
    console.log("Filtered Controls (Selected):", filteredControls); // Log the filtered controls (selected ones)

    const totalWeight = filteredControls.reduce(
      (sum, control) => sum + (control.controlWeight || 0),
      0
    );
    console.log("Total Weight of Selected Controls:", totalWeight); // Log the total weight of selected controls

    return totalWeight === 100; // Return true if the total weight is 100
  };

  useEffect(() => {
    // Reset selected controls and expanded controls when auditType or frameworkId changes
    setSelectedControls([]);
    setExpandedControls({});
  }, [auditType, frameworkId]);

  useEffect(() => {
    // Reset selected controls, expanded controls, and hide the controls section when auditType changes
    setSelectedControls([]);
    setExpandedControls({});
    setShowControlsSection(false); // Hide the controls section
  }, [auditType]);


  

  return (
    <>
      <div className="pb-2 flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {/* <Button variant="outline">Configure Audit</Button> */}
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Configure Audit Framework</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormDateInput
                        formControl={form.control}
                        name={"startDate"}
                        label={"Start Date"}
                        placeholder={"Enter Start Date"}
                        dateFormat={SAVE_DATE_FORMAT_GRC}
                        calendarDateDisabled={false}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormDateInput
                        formControl={form.control}
                        name={"endDate"}
                        label={"End Date"}
                        placeholder={"Enter End Date"}
                        dateFormat={SAVE_DATE_FORMAT_GRC}
                        calendarDateDisabled={false}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormMultiComboboxInput
                        formControl={form.control}
                        name="auditeeMembers"
                        label="Auditee Team Member(s)"
                        placeholder="Select Auditee's"
                        items={userMap.map((member) => ({
                          value: member.value,
                          label: member.label || member.value,
                        }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormMultiComboboxInput
                        formControl={form.control}
                        name="auditorMembers"
                        label="Auditor Team Member(s)"
                        placeholder="Select Auditor's"
                        items={userMap.map((member) => ({
                          value: member.value,
                          label: member.label || member.value,
                        }))}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <Label>Audit Name</Label>
                    <Input
                      placeholder="Please enter audit name..."
                      value={auditName}
                      onChange={(e) => setAuditName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Audit Type</Label>
                      <Select
                        onValueChange={(value) => {
                          setAuditType(value);
                          form.setValue("auditType", value as any);
                        }}
                        value={auditType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bestPractice">
                            Best Practice
                          </SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="rulesAndRegulation">
                            Regulation
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {auditType && (
                      <div className="space-y-2">
                        <Label>Framework</Label>
                        <Select
                          onValueChange={(value) => {
                            setFrameworkId(value);
                            form.setValue("frameworkId", value);
                            setShowControlsSection(true); // Show the controls section when a framework is selected
                          }}
                          value={frameworkId}
                          disabled={!auditType}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                auditType
                                  ? "Select framework"
                                  : "Select audit type first"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {frameworks
                              .filter(
                                (framework) =>
                                  framework.frameworkType === auditType
                              )
                              .map((framework) => (
                                <SelectItem
                                  key={framework.frameworkId}
                                  value={framework.frameworkId}
                                >
                                  {framework.frameworkTitle}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {showControlsSection && frameworkId && auditType && (<div className="space-y-4 max-h-[30vh] overflow-y-auto">
                    {frameworkControls.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all"
                          // checked={
                          //   selectedControls.length ===
                          //   frameworkControls.length &&
                          //   frameworkControls.length > 0
                          // }
                          checked={
                            selectedControls.length ===
                            frameworkControls.flatMap((framework) => framework.controls).length &&
                            frameworkControls.flatMap((framework) => framework.controls).length > 0
                          }
                          onCheckedChange={toggleSelectAllControls}
                        />
                        <Label
                          htmlFor="select-all"
                          className="text-sm font-medium"
                        >
                          {/* {selectedControls.length === frameworkControls.length
                            ? "Deselect All"
                            : "Select All"} */}
                          {selectedControls.length ===
                            frameworkControls.flatMap((framework) => framework.controls).length
                            ? "Deselect All"
                            : "Select All"}
                        </Label>
                      </div>
                    )}

                    {frameworkControls.map((framework, frameworkIndex) =>
                      framework.controls.map((control, controlIndex) => (
                        <div
                          key={`${frameworkIndex}-${controlIndex}`}
                          className="space-y-3 border p-4 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`control-${control.controlId}`}
                                checked={selectedControls.includes(
                                  control.controlId
                                )}
                                onCheckedChange={() =>
                                  toggleSelectControl(control.controlId)
                                }
                              />
                              <button
                                type="button"
                                className="flex items-center gap-2 font-medium"
                                onClick={() => toggleControl(control.controlId)}
                              >
                                {expandedControls[control.controlId] ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                <span>{control.controlName}</span>
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-sm text-muted-foreground">
                                Control Weight:
                              </div>
                              <div className="w-20">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={
                                    control.weight === 0 ? "" : control.weight
                                  }
                                  onChange={(e) =>
                                    handleControlWeightChange(
                                      control.controlId,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <span>%</span>
                            </div>
                          </div>

                          {expandedControls[control.controlId] && (
                            <div className="space-y-2 pl-6">
                              {control.controlObjectives.map(
                                (objective, objIndex) => (
                                  <div
                                    key={objIndex}
                                    className="grid grid-cols-12 gap-4 items-center"
                                  >
                                    <div className="col-span-8">
                                      <Label>{objective.name}</Label>
                                    </div>
                                    <div className="col-span-4 flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={
                                          objective.weight === 0
                                            ? ""
                                            : objective.weight
                                        }
                                        onChange={(e) =>
                                          handleObjectiveWeightChange(
                                            control.controlId, // Pass controlId instead of controlIndex
                                            objIndex,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <span>%</span>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>)}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        Selected Controls: {selectedControls.length} /{" "}
                        {frameworkControls.length}
                      </div>
                      <Button
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            const { auditorMembers, auditeeMembers } =
                              form.getValues();

                            // Check if all required fields are filled
                            if (
                              !startDate ||
                              !endDate ||
                              !auditName ||
                              !auditeeMembers.length ||
                              !auditorMembers.length ||
                              !auditType ||
                              !frameworkId
                            ) {
                              toast.error("Please fill all required fields");
                              return;
                            }

                            // Check if at least one control is selected
                            if (selectedControls.length === 0) {
                              toast.error("Please select at least one control");
                              return;
                            }

                            // Validate that the sum of selected control weights equals 100
                            if (!validateSelectedControlWeights()) {
                              toast.error(
                                "The total weight of selected controls must equal 100% "
                              );
                              return;
                            }

                            // Validate that the sum of control objective weights equals 100 for each selected control
                            if (!validateControlObjectiveWeightsOfSelectedControl()) {
                              toast.error(
                                "The total weight of control objectives for each selected control must equal 100% "
                              );
                              return;
                            }


                            // Proceed with audit creation
                            const selectedFramework = frameworks.find(
                              (f) => f.frameworkId === frameworkId
                            );
                            if (!selectedFramework) {
                              toast.error("Selected framework not found");
                              return;
                            }

                            const auditData = {
                              auditId: Date.now().toString(),
                              auditType,
                              frameworkId,
                              frameworkTitle: selectedFramework.frameworkTitle,
                              controls: controls.filter((control) =>
                                control.controls.some((c) => selectedControls.includes(c.controlId))
                              ),
                              startDate,
                              endDate,
                              auditName,
                              auditorMembers,
                              auditeeMembers,
                              lastUpdatedOn: new Date().toISOString(),
                              lastUpdatedById: profileData?.USER_ID,
                              lastUpdateByName: profileData?.USER_NAME,
                              published: false,
                              status: "not published",
                            };
                            console.log(auditData)
                            await handleCreateAudit(auditData);
                          } catch (error) {
                            toast.error(
                              "An error occurred while creating the audit."
                            );
                            console.error("Submission failed:", error);
                          }
                        }}
                      >
                        Save Configuration
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <AuditTable open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
