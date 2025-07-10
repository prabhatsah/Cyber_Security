"use client";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Download, FileText, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import { Input } from "@/shadcn/ui/input";
import { v4 } from "uuid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shadcn/ui/form";

import { toast } from "sonner";
// import { useRefresh } from "../../../knowledge-base/page";
import { useRouter } from "next/navigation";
import { startUploadData } from "../../knowledge-new/component/UploadComponent/(backend-calls)";
import { startFrameworkData } from "../../compliance/frameworks/(backend-calls)";
import { useKBContext } from "./knowledgeBaseContext";

export const practiceAreasList = [
  "Audit and Reporting",
  "Governance",
  "Banking Governance",
  "Communications",
  "Content and Records",
  "Governance and Risk Mgmt",
  "Risk Assessment and Management",
  "Compliance Management",
  "IT Security",
  "Operational Risk",
  "Business Continuity",
  "Policy Management",
  "Regulatory Compliance",
  "Cybersecurity",
  "Data Privacy",
  "Vendor Risk Management",
  "Access Control",
  "Incident Response",
  "Third-Party Governance",
  "Enterprise Risk Management",
  "Legal and Regulatory Affairs",
  "Internal Controls",
  "Ethics and Integrity",
  "Physical Security",
  "Training and Awareness",
  "Fraud Detection and Prevention",
  "Health, Safety & Environment (HSE)",
  "Change Management",
  "Cloud Governance",
  "Financial Controls",
];
export default function UploadComponent({ uploadDialogOpen, setUploadDialogOpen }: any) {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [framework, setFramework] = useState("");
  const [frameworkType, setFrameworkType] = useState("");
  const [frameworkId, setFrameworkId] = useState("");
  const [frameworks, setFrameworks] = useState<any[]>([]);
  const [frameworkDescription, setFrameworkDescription] = useState("");
  const [category, setCategory] = useState("");
  const { userMap } = useKBContext();

  const cleanString = (str: string) => {
    if (!str) return str;
    if (typeof str != "string") return str;
    return str.replace(/\t/g, "").trim();
  };
  // setTimeout(() => {
  //   router.push("/grc/knowledge-base");
  // }, 0);
  function transformToFrameworkStructure(controlsData, framework, owners, newFrameworkId) {
    const controlsMap: Record<string, any> = {};

    for (const row of controlsData) {
      const rowData: Record<string, any> = {};
      for (const item of row) {
        if (item.keyField && item.value !== undefined) {
          rowData[item.keyField] = cleanString(item.value);
        }
      }

      if (!rowData.controlobjectiveid || !rowData.controlobjectives) {
        return {
          success: false,
          error:
            "Excel file is missing required fields (controlobjectiveid or controlobjectives)",
        };
      }

      const controlId = cleanString(rowData.controlobjectiveid);
      const policyId = rowData.controlpolicyid;
      const controlName = cleanString(rowData.controlpolicyname || "");
      const controlObjective = cleanString(rowData.controlobjectives);
      const controlDescription = rowData.objectivedescription || "";

      const controlNameID = controlName.replace(/\s+/g, "").toUpperCase();

      if (!controlsMap[controlNameID]) {
        controlsMap[controlNameID] = {
          controlName: controlName,
          policyId: policyId,
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
        controlObjType: ["Managerial", "Technical", "Operational"][
          Math.floor(Math.random() * 3)
        ],
        practiceAreas:
          practiceAreasList[
          Math.floor(Math.random() * practiceAreasList.length)
          ],
      });
    }

    return {
      success: true,
      data: [
        {
          policyName: framework.trim(),
          framework: frameworkType,
          frameworkId: newFrameworkId,
          controls: Object.values(controlsMap),
          description: frameworkDescription.trim(),
          owners: owners,
          compliant: "notImplemented",
          lastUpdatedOn: new Date().toISOString(),
          category: category,
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
  const formSchema = z.object({
    // owners: z.array(z.string()).min(1, "At least one owner is required"),
    // AUDITEE_NAME: z.array(z.string()).min(1, "At least one auditee is required"), // Remove or keep if needed
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      owners: [], // Changed from AUDITEE_NAME to owners
    },
  });
  const handleUpload = async () => {
    const formValues = form.getValues();
    const newFrameworkId = v4();
    const owners = formValues.owners;
    if (!file) {
      toast.error("Please select a file first", { duration: 2000 });
      return;
    }
    if (!framework) {
      toast.error("Please select a framework first!", { duration: 2000 });
      return;
    }
    if (!frameworkDescription) {
      toast.error("Please write some description!", { duration: 2000 });
      return;
    }
    if (!frameworkType) {
      toast.error("Please select framework type!", { duration: 2000 });
      return;
    }
    if (owners.length == 0) {
      toast.error("Please select atleast one owner!", { duration: 2000 });
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
          framework,
          owners,
          newFrameworkId
        );

        if (!result.success) {
          toast.error(result.error, { duration: 2000 });
          resetForm();
          return;
        }

        const frameworkData = {
          frameworkAddTime: new Date().toISOString(),
          frameworkDescription: frameworkDescription,
          policyName: framework,
          framework: frameworkType,
          frameworkId: result.data?.[0].frameworkId,
        };

        setParsedData(result.data || []);
        console.log("upload data----", result.data?.[0]);
        const controls = result.data?.[0]?.controls ?? [];

        controls.forEach((control: any) => {
          // Assign control weight
          control.controlWeight = Number((100 / controls.length).toFixed(2));

          // Assign each control objective's weight
          control.controlObjectives.forEach((obj: any) => {
            obj.controlObjweight = Number(
              (100 / control.controlObjectives.length).toFixed(2)
            );
          });
        });

        const modifiedWeightDataForUpload = controls.map(
          (control: any) => control.controlWeight
        );
        console.log(
          "modifiedWeightDataForUpload frameworkData---",
          modifiedWeightDataForUpload
        );
        await startUploadData(result.data?.[0], frameworkId);
        // await startFrameworkData(frameworkData);
        toast.success("File uploaded successfully!", { duration: 2000 });
        resetForm();
        setUploadDialogOpen(false);
        router.refresh();
      } catch (error: any) {
        toast.error(`Failed to parse file: ${error.message}`, {
          duration: 2000,
        });
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
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
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
    setFrameworkDescription("");
    setErrors([]);
    form.reset({
      owners: [],
    });
  };
  return (
    <>
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-[40%]">
          <DialogHeader>
            <DialogTitle>Import Framework</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpload)} className="space-y-4 py-4">
              {/* <div className="space-y-2">
                <Label>Framework Type</Label>
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
                    <SelectItem value="bestPractice">Best Practice</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="rulesAndRegulation">
                      Rules And Regulation
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Label>Framework Name</Label>
                <Input placeholder="Framework Name" value={framework} onChange={(e) => setFramework(e.target.value)} />

                <Label>Framework Description</Label>
                <Textarea placeholder="Framework Description" value={frameworkDescription} onChange={(e) => setFrameworkDescription(e.target.value)} />

                <FormMultiComboboxInput formControl={form.control} name="owners" label="Owner(s)*" placeholder="Select Owner's" items={userMap || []} defaultValue={form.getValues("owners")} />

                <Label>Category</Label>
                <Select onValueChange={(value) => setCategory(value)} value={category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Governance">Governance</SelectItem>
                    <SelectItem value="Risk">Risk</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              {/* Framework Type & Name in one line */}
              <div className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <Label>Framework Type</Label>
                  <Select
                    onValueChange={(value) => setFrameworkType(value)}
                    value={frameworkType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bestPractice">Best Practice</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="rulesAndRegulation">Rules And Regulation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 space-y-1">
                  <Label>Framework Name</Label>
                  <Input
                    placeholder="Framework Name"
                    value={framework}
                    onChange={(e) => setFramework(e.target.value)}
                  />
                </div>
              </div>

              {/* Owners & Category in one line */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <FormMultiComboboxInput
                    formControl={form.control}
                    name="owners"
                    label="Owner(s)*"
                    placeholder="Select Owner's"
                    items={userMap || []}
                    defaultValue={form.getValues("owners")}
                  />
                </div>

                <div className="flex-1 space-y-1 mt-0.5">
                  <Label>Category</Label>
                  <Select onValueChange={(value) => setCategory(value)} value={category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Governance">Governance</SelectItem>
                      <SelectItem value="Risk">Risk</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description in its own line */}
              <div className="space-y-1">
                <Label>Framework Description</Label>
                <Textarea
                  placeholder="Framework Description"
                  value={frameworkDescription}
                  onChange={(e) => setFrameworkDescription(e.target.value)}
                />
              </div>

              {/*dont remove this Commented section */}
              {/*
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
          )} */}

              {/* Dropzone */}
              <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:border-primary/50">
                <input {...getInputProps()} />
                <Upload className="h-5 w-7 mx-auto text-muted-foreground" />
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
                  <li>Control Policy Id</li>
                  <li>Control Objective Id</li>
                  <li>Control Policy Name</li>
                  <li>Control Objectives</li>
                  <li>Objective Description</li>
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

              <Button
                variant="outline"
                size="sm"
                className="mt-2 flex justify-center"
                asChild
              >
                <a
                  href={`${process.env.NEXT_BASE_PATH}/dummy-template-for-upload.xlsx`}
                  download="Framework_Upload_Template.xlsx"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </a>
              </Button>
              <Button type="submit" className="w-full">
                Upload
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
