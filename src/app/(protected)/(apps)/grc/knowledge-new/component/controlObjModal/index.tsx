"use client";

import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4, v4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shadcn/ui/accordion";
import { Button } from "@/shadcn/ui/button";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shadcn/ui/select";
import {
  mapProcessName,
  startProcessV2,
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";

import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Label } from "@/shadcn/ui/label";
import UploadComponent from "../UploadComponent/page";
import { Textarea } from "@/shadcn/ui/textarea";
import { FileText, Plus, Upload, Weight } from "lucide-react";
import { fetchFrameWorkData } from "../../../governance/sop/component/(backend-calls)";
import { useDropzone } from "react-dropzone";
import { startUploadData } from "../UploadComponent/(backend-calls)";
import { startFrameworkData } from "../../../compliance/frameworks/(backend-calls)";
import { toast } from "sonner";
import * as XLSX from "xlsx";
export default function ControlManagerModal({
  open,
  setOpen,
  frameworkData,
  editControlObj,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  frameworkData: any[];
  editControlObj: any;
}) {
  const [controls, setControls] = useState([
    {
      controlId: uuidv4(),
      controlName: "",
      objectives: [{ name: "", description: "", controlObjWeight: 0 }],
      weight: 0,
    },
  ]);
  const router = useRouter();
  const [selectedFrameworkType, setSelectedFrameworkType] =
    useState<string>("");
  const [selectedFramework, setSelectedFramework] = useState<string>("");
  const [filteredFrameworks, setFilteredFrameworks] = useState<any[]>([]);
  const [additionMethod, setAdditionMethod] = useState<"manual" | "excel">(
    "manual"
  );

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [framework, setFramework] = useState("");
  const [frameworkType, setFrameworkType] = useState("");
  const [frameworkId, setFrameworkId] = useState("");
  const [frameworks, setFrameworks] = useState<any[]>([]);
  const [frameworkDescription, setFrameworkDescription] = useState("");

  const cleanString = (str: string) => {
    if (!str) return str;
    return str.replace(/\t/g, "").trim();
  };

  function transformToFrameworkStructure(
    controlsData: any[],
    framework: string
  ): { success: boolean; data?: any[]; error?: string } {
    const controlsMap: Record<string, any> = {};

    for (const row of controlsData) {
      const rowData: Record<string, any> = {};
      for (const item of row) {
        if (item.keyField && item.value !== undefined) {
          rowData[item.keyField] = cleanString(item.value);
        }
      }

      if (!rowData.controlid || !rowData.controlobjectives) {
        return {
          success: false,
          error:
            "Excel file is missing required fields (controlid or controlobjectives)",
        };
      }

      const controlId = cleanString(rowData.controlid);
      const controlName = cleanString(rowData.controlname || "");
      const controlObjective = cleanString(rowData.controlobjectives);
      const controlDescription = rowData.controldescription || "";

      const controlNameID = controlName.replace(/\s+/g, "").toUpperCase();

      if (!controlsMap[controlNameID]) {
        controlsMap[controlNameID] = {
          controlName: controlName,
          controlId: v4(),
          controlWeight: 0,
          controlObjectives: [],
        };
      }
      //we need to discuss about id
      controlsMap[controlNameID].controlObjectives.push({
        controlObjId: controlId,
        name: controlObjective,
        description: cleanString(controlDescription),
        controlObjweight: 0,
      });
    }

    return {
      success: true,
      data: [
        {
          framework,
          frameworkType,
          frameworkId: v4(),
          controls: Object.values(controlsMap),
        },
      ],
    };
  }

  const transformData = (jsonData: any[]) => {
    return jsonData.map((row) => {
      return Object.entries(row)
        .map(([field, value]) => {
          if (field.startsWith("_")) return null;
          return {
            field,
            value: typeof value === "string" ? cleanString(value) : value,
            keyField: field.replace(/\s+/g, "").toLowerCase(),
          };
        })
        .filter(Boolean);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    if (!framework) {
      toast.error("Please select a framework first!");
      return;
    }
    if (!frameworkType) {
      toast.error("Please select framework type!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        const transformedData = transformData(jsonData);
        const result = transformToFrameworkStructure(
          transformedData,
          framework
        );

        if (!result.success) {
          toast.error(result.error);
          resetForm();
          return;
        }

        const frameworkData = {
          frameworkAddTime: new Date().toISOString(),
          frameworkDescription: frameworkDescription,
          frameworkTitle: framework,
          frameworkType: frameworkType,
          frameworkId: result.data?.[0].frameworkId,
        };

        setParsedData(result.data || []);
        await startUploadData(result.data?.[0], frameworkId);
        await startFrameworkData(frameworkData);
        toast.success("File uploaded successfully!");
        resetForm();
      } catch (error: any) {
        toast.error(`Failed to parse file: ${error.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setErrors([]);
    setParsedData([]);
    const excelFile = acceptedFiles[0];
    setFile(excelFile);
    setUploadedFiles([excelFile]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop,
  });

  const resetForm = () => {
    setFile(null);
    setUploadedFiles([]);
    setFramework("");
    setFrameworkType("");
    setFrameworkId("");
    setErrors([]);
  };

  useEffect(() => {
    const getFrameworkData = async () => {
      const data = await fetchFrameWorkData();
      setFrameworks(data);
    };
    getFrameworkData();
  }, []);

  // Populate form if editControlObj contains data
  useEffect(() => {
    if (editControlObj) {
      setSelectedFrameworkType(editControlObj.frameworkType);
      setSelectedFramework(editControlObj.framework);
      setControls(
        editControlObj.controls.map((control: any) => ({
          controlId: control.controlId || uuidv4(),
          controlName: control.controlName,
          weight: control.weight,
          objectives: control.controlObjectives.map((objective: any) => ({
            name: objective.name,
            description: objective.description,
            controlObjWeight: objective.controlObjWeight || 0,
          })),
        }))
      );

      // Filter frameworks based on the framework type
      const filtered = frameworkData.filter(
        (item) => item.frameworkType === editControlObj.frameworkType
      );
      setFilteredFrameworks(filtered);
    }
  }, [editControlObj, frameworkData]);

  const addControl = () => {
    setControls((prev) => [
      ...prev,
      {
        controlId: uuidv4(),
        controlName: "",
        objectives: [{ name: "", description: "", controlObjWeight: 0 }],
        weight: 0,
      },
    ]);
  };

  const updateControlName = (index: number, value: string) => {
    const updated = [...controls];
    updated[index].controlName = value;
    setControls(updated);
  };

  const addObjective = (controlIndex: number) => {
    const updated = [...controls];
    updated[controlIndex].objectives.push({
      name: "",
      description: "",
      controlObjWeight: 0,
    });
    setControls(updated);
  };

  const updateObjectiveName = (
    controlIndex: number,
    objectiveIndex: number,
    value: string
  ) => {
    const updated = [...controls];
    updated[controlIndex].objectives[objectiveIndex].name = value;
    setControls(updated);
  };

  const updateObjectiveDescription = (
    controlIndex: number,
    objectiveIndex: number,
    value: string
  ) => {
    const updated = [...controls];
    updated[controlIndex].objectives[objectiveIndex].description = value;
    setControls(updated);
  };
  const updateObjectiveWeight = (
    controlIndex: number,
    objectiveIndex: number,
    value: number
  ) => {
    const updated = [...controls];
    updated[controlIndex].objectives[objectiveIndex].controlObjWeight = value;
    setControls(updated);
  };

  const handleFrameworkTypeChange = (value: string) => {
    setSelectedFrameworkType(value);

    // Filter frameworks based on the selected framework type
    const filtered = frameworkData.filter(
      (item) => item.frameworkType === value
    );
    setFilteredFrameworks(filtered);
  };

  const handleFrameworkChange = (value: string) => {
    setSelectedFramework(value);
  };

  const handleSave = async () => {
    // Find the selected frameworkId from frameworkData
    const selectedFrameworkData = frameworkData.find(
      (item) =>
        item.frameworkTitle === selectedFramework &&
        item.frameworkType === selectedFrameworkType
    );

    const frameworkId = selectedFrameworkData?.frameworkId || "";

    // Construct the final data structure
    const finalData = {
      framework: selectedFramework,
      frameworkType: selectedFrameworkType,
      frameworkId: frameworkId,
      controls: controls.map((control) => ({
        controlName: control.controlName,
        controlId: control.controlId,
        controlWeight: 0,

        controlObjectives: control.objectives.map((objective) => ({
          name: objective.name,
          description: objective.description,
          controlObjWeight: 0,
        })),
      })),
    };

    console.log("Final Data:", finalData);

    if (editControlObj) {
      // If editing, invoke the update process
      const controlobjInstances = await getMyInstancesV2({
        processName: "Control Objectives",
        predefinedFilters: { taskName: "edit control objective" },
        mongoWhereClause: `this.Data.frameworkId == "${frameworkId}"`,
      });
      console.log("controlObjectInstanceee-----------------------------");
      console.log(controlobjInstances);

      const taskId = controlobjInstances[0].taskId;
      console.log(taskId);

      await invokeAction({
        taskId: taskId,
        data: finalData,
        transitionName: "update edit controlObj",
        processInstanceIdentifierField: "frameworkId,controlId",
      });
    } else {
      // If creating, start a new process
      const controlObjectiveProcessId = await mapProcessName({
        processName: "Control Objectives",
      });
      console.log(controlObjectiveProcessId);

      await startProcessV2({
        processId: controlObjectiveProcessId,
        data: finalData,
        processIdentifierFields: "frameworkId,controlId",
      });
    }

    setOpen(false);
    router.refresh();
  };
  function autoCalculateWeights() {}
  function updateControlWeight(index: number, value: number) {}
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Control Objectives Manager</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Framework Type Dropdown */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              Framework Type
            </label>
            <Select
              onValueChange={handleFrameworkTypeChange}
              value={selectedFrameworkType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Framework Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="bestPractice">Best Practice</SelectItem>
                <SelectItem value="rulesAndRegulation">
                  Rules and Regulation
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Framework Name Dropdown */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              Framework Name
            </label>
            {/* <Input placeholder="Enter Framework Name"></Input> */}
            <Input
              className="border-4px shadow-none text-base font-medium hover:bg-muted/30 focus-visible:ring-1"
              placeholder="Enter Framework Name"
              // value={control.controlName}
            />
            {/* <Select
              onValueChange={handleFrameworkChange}
              value={selectedFramework}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Framework Name" />
              </SelectTrigger>
              <SelectContent>
                {filteredFrameworks.map((framework) => (
                  <SelectItem
                    key={framework.frameworkId}
                    value={framework.frameworkTitle}
                  >
                    {framework.frameworkTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </div>
        </div>

        <div className="space-y-4">
          <RadioGroup
            defaultValue="manual"
            className="flex items-center gap-4"
            value={additionMethod}
            onValueChange={(value: "manual" | "excel") =>
              setAdditionMethod(value)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manual" />
              <Label htmlFor="manual">Add Controls Manually</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="excel" id="excel" />
              <Label htmlFor="excel">Upload Excel File</Label>
            </div>
          </RadioGroup>

          <div className="flex justify-end mb-2">
            {additionMethod != "excel" && (
              <Button size="sm" onClick={addControl}>
                + Add Control
              </Button>
            )}
          </div>
          {additionMethod === "excel" ? (
            <div className="space-y-4 p-4 border rounded-lg">
              {/* Framework Info Inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Audit Type</Label>
                  <Select
                    onValueChange={(value) => {
                      setFrameworkType(value);
                    }}
                    value={frameworkType}
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

                {frameworkType && (
                  <div className="space-y-2">
                    <Label>Framework</Label>
                    <Select
                      onValueChange={(value) => {
                        const selectedFramework = frameworks.find(
                          (f) => f.frameworkId === value
                        );
                        setFramework(selectedFramework?.frameworkTitle || "");
                        setFrameworkDescription(
                          selectedFramework?.frameworkDescription || ""
                        );
                        setFrameworkId(selectedFramework?.frameworkId);
                      }}
                      value={frameworkId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                      <SelectContent>
                        {frameworks
                          .filter((f) => f.frameworkType === frameworkType)
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

                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50"
                >
                  <input {...getInputProps()} />
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop control files here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports Excel (.xls, .xlsx) up to 5MB
                  </p>
                </div>

                {/* Uploaded File */}
                <div className="text-sm text-muted-foreground">
                  <h4 className="font-medium mb-2">Uploaded File:</h4>
                  {uploadedFiles.length > 0 ? (
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>{uploadedFiles[0].name}</span>
                    </div>
                  ) : (
                    <p className="text-xs italic">No file uploaded</p>
                  )}
                </div>

                {/* Template Info */}
                <div className="text-sm text-muted-foreground">
                  <h4 className="font-medium mb-2">Excel Format:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Control Id (Objective ID)</li>
                    <li>Control Objectives</li>
                    <li>Control Description</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <p className="flex items-center gap-1">
                    <span className="text-red-500">*</span>
                    Make sure you maintain the excel format!
                  </p>
                </div>

                {/* Error Messages */}
                {errors.length > 0 && (
                  <div className="text-red-500 text-xs bg-red-50 p-2 rounded-md">
                    {errors.map((err, idx) => (
                      <div key={idx}>{err}</div>
                    ))}
                  </div>
                )}
                <Button className="w-full">Upload</Button>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-2 overflow-y-auto">
              <Accordion
                type="multiple"
                className="h-[32rem] overflow-y-auto space-y-3 w-full"
              >
                {controls.map((control, controlIndex) => (
                  <AccordionItem
                    key={control.controlId}
                    value={control.controlId}
                    className="border rounded-lg overflow-hidden bg-background hover:bg-muted/50 transition-colors"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                          {controlIndex + 1}
                        </div>
                        <Input
                          className="border-none shadow-none text-base font-medium hover:bg-muted/30 focus-visible:ring-1"
                          placeholder="Control Name"
                          value={control.controlName}
                          onChange={(e) =>
                            updateControlName(controlIndex, e.target.value)
                          }
                        />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Weight:</span>
                          <Input
                            type="number"
                            className="h-8 w-[6rem] bg-transparent text-white border border-purple-700 focus:outline-none hide-spinner"
                            value={control.weight || 0}
                            onChange={(e) =>
                              updateControlWeight(
                                controlIndex,
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="h-[300px] overflow-y-auto pb-4 pt-2 px-4">
                      <div className="space-y-3">
                        {control.objectives.map((objective, objIndex) => (
                          <div
                            key={objIndex}
                            className="border rounded-lg p-4 bg-muted/10 space-y-3"
                          >
                            <div className="space-y-1">
                              <Label className="text-sm font-medium text-muted-foreground">
                                Objective Name
                              </Label>
                              <Input
                                className="bg-background"
                                placeholder="Enter objective name"
                                value={objective.name}
                                onChange={(e) =>
                                  updateObjectiveName(
                                    controlIndex,
                                    objIndex,
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-1">
                              <Label className="text-sm font-medium text-muted-foreground">
                                Description
                              </Label>
                              <Textarea
                                className="bg-background min-h-[80px]"
                                placeholder="Describe the objective"
                                value={objective.description}
                                onChange={(e) =>
                                  updateObjectiveDescription(
                                    controlIndex,
                                    objIndex,
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <Label className="text-sm font-medium text-muted-foreground">
                                  Weight
                                </Label>
                                <Input
                                  type="number"
                                  className="bg-background"
                                  placeholder="0-100"
                                  value={objective.controlObjWeight}
                                  onChange={(e) =>
                                    updateObjectiveWeight(
                                      controlIndex,
                                      objIndex,
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-sm font-medium text-muted-foreground">
                                  Control Type
                                </Label>
                                <Select
                                  onValueChange={handleFrameworkTypeChange}
                                  value={selectedFrameworkType}
                                >
                                  <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="standard">
                                      Procedural
                                    </SelectItem>
                                    <SelectItem value="bestPractice">
                                      Managerial
                                    </SelectItem>
                                    <SelectItem value="rulesAndRegulation">
                                      Technical
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          onClick={() => addObjective(controlIndex)}
                          size="sm"
                          variant="ghost"
                          className="w-full mt-2 border-dashed border-2 text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Objective
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          )}
        </div>
        <DialogFooter className="mt-4">
          {additionMethod != "excel" && (
            <Button onClick={autoCalculateWeights}>
              Auto Calculate Weights
            </Button>
          )}
          {additionMethod != "excel" && (
            <Button onClick={handleSave}>
              {editControlObj ? "Update" : "Save"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
