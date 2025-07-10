"use client";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchControlObjectiveData,
  fetchFrameWorkData,
} from "@/app/(protected)/(apps)/grc/governance/audit/component/(backend-calls)";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import { Form } from "@/shadcn/ui/form";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/shadcn/ui/checkbox";
import AuditTable from "../auditTable/auditTable";
import FilterDataTable from "../filterFormDataTable/page";

export default function AuditConfigurationDialog() {
  const router = useRouter();
  const [auditType, setAuditType] = useState<string[]>([]); // Handles multiple values
  const [frameworkId, setFrameworkId] = useState<string[]>([]); // Handles multiple values
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [auditName, setAuditName] = useState("");
  const [frameworks, setFrameworks] = useState<any[]>([]);
  const [controls, setControls] = useState<any[]>([]);
  const [selectedControls, setSelectedControls] = useState<string[]>([]); // Handles multiple values
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Handles multiple values
  const [frameworkControls, setFrameworkControls] = useState<any[]>([]);
  const [showControlsSection, setShowControlsSection] = useState(false);
  const [expandedControls, setExpandedControls] = useState<{ [key: string]: boolean }>({}); // Tracks expanded controls
  const [isFilterApplied, setIsFilterApplied] = useState(false); // New state to control rendering
  const [showTable, setShowTable] = useState(false); // New state to control table visibility
  const form = useForm({
    defaultValues: {
      auditType: [],
      frameworkId: [],
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [frameworksData, controlsData] = await Promise.all([
          fetchFrameWorkData(),
          fetchControlObjectiveData(),
        ]);
        setFrameworks(frameworksData);
        setControls(controlsData);
        console.log(controlsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    try {
      // Ensure all required fields are filled
      if (
        auditType.length === 0 || // Ensure at least one audit type is selected
        frameworkId.length === 0 || // Ensure at least one framework is selected
        selectedControls.length === 0 || // Ensure at least one control is selected
        selectedTags.length === 0 // Ensure at least one tag is selected
      ) {
        toast.error("Please fill all required fields for filtering");
        return;
      }

      // Filter the controls based on the selected values
      const filteredFrameworkControls = controls
        .filter((framework) => {
          // Match framework type
          const matchesFrameworkType = auditType.includes(framework.frameworkType);

          // Match framework
          const matchesFrameworkId = frameworkId.includes(framework.frameworkId);

          return matchesFrameworkType && matchesFrameworkId;
        })
        .map((framework) => ({
          ...framework,
          controls: framework.controls.filter((control) => {
            // Match control name
            const matchesControlName = selectedControls.includes(control.controlId);

            // Match tags (case-insensitive)
            const matchesTags = control.controlObjectives.some((objective) =>
              selectedTags
                .map((tag) => tag.toLowerCase()) // Convert selectedTags to lowercase
                .includes(objective.category.toLowerCase()) // Convert category to lowercase
            );

            return matchesControlName && matchesTags;
          }),
        }))
        .filter((framework) => framework.controls.length > 0); // Remove frameworks with no matching controls

      // Update the frameworkControls state with the filtered data
      setFrameworkControls(filteredFrameworkControls);

      // Show the controls section
      setShowControlsSection(true);

      // Set the filter applied state to true
      setIsFilterApplied(true);
      setShowTable(true); // Show the table
      console.log("Filtered Framework Controls:", filteredFrameworkControls); // Debugging log
    } catch (error) {
      console.error("Error while filtering controls:", error);
      toast.error("An error occurred while filtering controls");
    }
  };

  const toggleSelectAllControls = () => {
    const allControlIds = frameworkControls.flatMap((framework) =>
      framework.controls.map((control) => control.controlId)
    );
    setSelectedControls(
      selectedControls.length === allControlIds.length ? [] : allControlIds
    );
  };

  const toggleSelectControl = (controlId: string) => {
    setSelectedControls((prev) =>
      prev.includes(controlId)
        ? prev.filter((id) => id !== controlId)
        : [...prev, controlId]
    );
  };

  const toggleControl = (controlId: string) => {
    setExpandedControls((prev) => ({
      ...prev,
      [controlId]: !prev[controlId],
    }));
  };

  const handleControlWeightChange = (controlId: string, weight: string) => {
    const newWeight = Math.min(100, Math.max(0, parseInt(weight, 10) || 0)); // Ensure weight is between 0 and 100
    console.log('Updating controlId:', controlId, 'weight:', newWeight);

    setFrameworkControls((prevFrameworkControls) =>
      prevFrameworkControls.map((framework) => ({
        ...framework,
        controls: framework.controls.map((control) =>
          selectedControls.includes(control.controlId) && control.controlId === controlId
            ? {
              ...control,
              controlWeight: weight === "" ? "" : newWeight, // Allow empty input and ensure valid range
            }
            : control
        ),
      }))
    );
  };

  const handleObjectiveWeightChange = (
    controlId: string,
    objIndex: number,
    weight: string
  ) => {
    console.log(`Updating controlId: ${controlId}, objIndex: ${objIndex}, weight: ${weight}`);
    setFrameworkControls((prev) =>
      prev.map((framework) => ({
        ...framework,
        controls: framework.controls.map((control) =>
          control.controlId === controlId
            ? {
              ...control,
              controlObjectives: control.controlObjectives.map(
                (objective, index) =>
                  index === objIndex
                    ? {
                      ...objective,
                      controlObjWeight: weight === "" ? "" : parseInt(weight, 10), // Allow empty string
                    }
                    : objective
              ),
            }
            : control
        ),
      }))
    );
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

  useEffect(() => {
    if (frameworkControls.length > 0) {
      setShowTable(true); // Show the table when frameworkControls changes
    } else {
      setShowTable(false); // Hide the table if frameworkControls is empty
    }
  }, [frameworkControls]);

  return (
    <>
      <div className="pb-2 flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[1800px]">
            <DialogHeader>
              <DialogTitle>Configure Audit Framework</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={handleFilter}>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <Label>Standard Operating Procedure Name</Label>
                    <Input
                      placeholder="Please enter SOP name..."
                      value={auditName}
                      onChange={(e) => setAuditName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormMultiComboboxInput
                        formControl={form.control}
                        name="auditType"
                        label="Framework Type"
                        placeholder="Select type"
                        items={[
                          { value: "bestPractice", label: "Best Practice" },
                          { value: "standard", label: "Standard" },
                          { value: "rulesAndRegulation", label: "Regulation" },
                        ]}
                        value={auditType} // Pass the current state
                        onSelect={(selected) => {
                          setAuditType(selected); // Update the state with selected values
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormMultiComboboxInput
                        formControl={form.control}
                        name="frameworkId"
                        label="Framework"
                        placeholder="Select framework"
                        items={frameworks.map((framework) => ({
                          value: framework.frameworkId,
                          label: framework.frameworkTitle,
                        }))}
                        value={frameworkId} // Pass the current state
                        onSelect={(selected) => {
                          setFrameworkId(selected); // Update the state with selected values
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <FormMultiComboboxInput
                        formControl={form.control}
                        name="controlId"
                        label="Controls"
                        placeholder="Select controls"
                        items={controls.flatMap((framework) =>
                          framework.controls.map((control) => ({
                            value: control.controlId,
                            label: control.controlName,
                          }))
                        )}
                        value={selectedControls} // Pass the current state
                        onSelect={(selected) => {
                          setSelectedControls(selected); // Update the state with selected values
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormMultiComboboxInput
                        formControl={form.control}
                        name="tags"
                        label="Tags"
                        placeholder="Select tags"
                        items={[
                          { value: "Manegerial", label: "Manegerial" },
                          { value: "Operational", label: "Operational" },
                          { value: "Technical", label: "Technical" },
                        ]}
                        value={selectedTags} // Pass the current state
                        onSelect={(selected) => {
                          setSelectedTags(selected); // Update the state with selected values
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" variant="outline">
                      Filter
                    </Button>
                  </div>

                  {/* {showControlsSection && frameworkId.length > 0 && auditType.length > 0 && (
                    <div className="space-y-4 max-h-[30vh] overflow-y-auto">
                      {frameworkControls.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="select-all"
                            checked={
                              selectedControls.length ===
                              frameworkControls.flatMap((framework) =>
                                framework.controls.map(
                                  (control) => control.controlId
                                )
                              ).length &&
                              frameworkControls.flatMap((framework) =>
                                framework.controls.map(
                                  (control) => control.controlId
                                )
                              ).length > 0
                            }
                            onCheckedChange={toggleSelectAllControls}
                          />
                          <Label
                            htmlFor="select-all"
                            className="text-sm font-medium"
                          >
                            {selectedControls.length ===
                              frameworkControls.flatMap((framework) =>
                                framework.controls.map(
                                  (control) => control.controlId
                                )
                              ).length
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
                                  checked={selectedControls.includes(control.controlId)}
                                  onCheckedChange={() => toggleSelectControl(control.controlId)}
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
                                <div className="text-sm text-muted-foreground">Control Weight:</div>
                                <div className="w-20">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={control.controlWeight || ""} // Reflects the current state
                                    onChange={(e) =>
                                      handleControlWeightChange(control.controlId, e.target.value) // Updates the state
                                    }
                                  />
                                </div>
                                <span>%</span>
                              </div>
                            </div>

                            {expandedControls[control.controlId] && (
                              <div className="space-y-2 pl-6">
                                {control.controlObjectives.map((objective, objIndex) => (
                                  <div
                                    key={objIndex}
                                    className="grid grid-cols-12 gap-4 items-center"
                                  >
                                    <div className="col-span-8">
                                      <Label>
                                        {objective.name}{" "}
                                        <span className="text-xs text-muted-foreground text-red-500">
                                          ({objective.category})
                                        </span>
                                      </Label>
                                    </div>
                                    <div className="col-span-4 flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={objective.controlObjWeight || ""}
                                        onChange={(e) =>
                                          handleObjectiveWeightChange(
                                            control.controlId,
                                            objIndex,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <span>%</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )} */}

                    <div className="space-y-4 max-h-[30vh] overflow-y-auto">
                      {<FilterDataTable data={frameworkControls} />}
                    </div>
                 


                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        Selected Controls: {selectedControls.length} /{" "}
                        {frameworkControls.flatMap((framework) => framework.controls).length}
                      </div>
                      <Button
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
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

                            // // Proceed with audit creation
                            // const selectedFramework = frameworks.find(
                            //   (f) => f.frameworkId === frameworkId
                            // );
                            // if (!selectedFramework) {
                            //   toast.error("Selected framework not found");
                            //   return;
                            // }

                            // const auditData = {
                            //   auditId: Date.now().toString(),
                            //   auditType,
                            //   frameworkId,
                            //   // frameworkTitle: selectedFramework.frameworkTitle,
                            //   controls: controls.filter((control) =>
                            //     control.controls.some((c) =>
                            //       selectedControls.includes(c.controlId)
                            //     )
                            //   ),
                            //   auditName,
                            //   lastUpdatedOn: new Date().toISOString(),
                            //   lastUpdatedById: "USER_ID", // Replace with actual user ID
                            //   lastUpdateByName: "USER_NAME", // Replace with actual user name
                            //   published: false,
                            //   status: "not published",
                            // };

                            const auditData = {
                              auditId: Date.now().toString(), // Unique audit ID
                              framework: frameworkId, // Framework ID(s)
                              frameworkType: auditType, // Framework type(s)
                              sopName: auditName, // SOP Name
                              controlsSelected: controls.flatMap((framework) =>
                                framework.controls.filter((control) =>
                                  selectedControls.includes(control.controlId) // Include only selected controls
                                )
                              ),
                              updatedOn: new Date().toISOString(), // Timestamp for the last update
                            };

                            console.log("audit data ========================>")
                            console.log(auditData);
                            //await handleCreateAudit(auditData);
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