"use client";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Download, FileText, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
// import { toast } from "sonner";
import { v4 } from "uuid";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shadcn/ui/form";
import { toast } from "sonner";
// import { useRefresh } from "../../../knowledge-base/page";
import { useRouter } from "next/navigation";
import { fetchFrameWorkData } from "../../../audit/component/(backend-calls)";

export default function UploadComponent({
  importedUploadData,
  setAccordionValue,
  loading,
}: {
  importedUploadData: any;
  setAccordionValue: any;
  loading: boolean;
}) {
  const router = useRouter();
  // const { refresh } = useRefresh();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
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
    if (typeof str != "string") return str;
    return str.replace(/\t/g, "").trim();
  };
  // setTimeout(() => {
  //   router.push("/grc/knowledge-base");
  // }, 0);
  function transformToFrameworkStructure(controlsData) {
    const controlsMap: Record<string, any> = {};

    for (const row of controlsData) {
      const rowData: Record<string, any> = {};
      for (const item of row) {
        if (item.keyField && item.value !== undefined) {
          rowData[item.keyField] = cleanString(item.value);
        }
      }

      //   if (!rowData.controlobjectiveid || !rowData.controlobjectives) {
      //     return {
      //       success: false,
      //       error:
      //         "Excel file is missing required fields (controlobjectiveid or controlobjectives)",
      //     };
      //   }

      const controlobjId = cleanString(rowData.controlobjectiveid);
      const policyId = rowData.controlpolicyid;
      const controlpolicyname = cleanString(rowData.controlpolicyname || "");
      const controlObjective = cleanString(rowData.controlobjective);
      const observationId = cleanString(rowData.observationid);
      const observationName = cleanString(rowData.observation);
      const nonConformityType = cleanString(rowData.nonconformitytype);
      const recommendation = cleanString(rowData.recommendation);
      const ownerName = cleanString(rowData.ownername);
      const dueDate = cleanString(rowData.duedate);

      const controlNameID = controlpolicyname.replace(/\s+/g, "").toUpperCase();

      // Initialize control if it doesn't exist
      if (!controlsMap[controlNameID]) {
        controlsMap[controlNameID] = {
          controlName: controlpolicyname,
          policyId: policyId,
          controlObjectives: [], // Now using an array instead of object
        };
      }

      // Find or create the control objective
      let objective = controlsMap[controlNameID].controlObjectives.find(
        (obj) => obj.controlObjId === controlobjId
      );

      if (!objective) {
        objective = {
          controlObjId: controlobjId,
          name: controlObjective,
          observations: [],
        };
        controlsMap[controlNameID].controlObjectives.push(objective);
      }

      // Add observation with its recommendation (1:1 mapping)
      objective.observations.push({
        observationId: observationId,
        observationName: observationName,
        nonConformityType: nonConformityType,
        recommendation: recommendation,
        ownerName: ownerName,
        dueDate: dueDate,
      });
      console.log("controlsMap by ankit", controlsMap);
    }

    return {
      success: true,
      data: [
        {
          controls: Object.values(controlsMap),
          lastUpdatedOn: new Date().toISOString(),
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
    setAccordionValue([]);
    const owners = formValues.owners;
    // if (!file) {
    //   toast.error("Please select a file first");
    //   return;
    // }
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        const transformedData = transformData(jsonData);
        const result = transformToFrameworkStructure(transformedData);

        if (!result.success) {
          toast.error(result.error, { duration: 4000 });
          resetForm();
          return;
        }

        setParsedData(result.data || []);
        console.log("upload data----", result.data?.[0]);
        const controls = result.data?.[0]?.controls ?? [];

        const modifiedWeightDataForUpload = controls.map(
          (control: any) => control.controlWeight
        );
        console.log(
          "modifiedWeightDataForUpload frameworkData---",
          modifiedWeightDataForUpload
        );

        importedUploadData(result?.data?.[0].controls);

        toast.success("File uploaded successfully!", { duration: 4000 });
        resetForm();
        setUploadDialogOpen(false);
      } catch (error: any) {
        toast.error(`Failed to parse file: ${error.message}`, {
          duration: 4000,
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
    setFrameworkDescription("");
    setErrors([]);
    form.reset({
      owners: [],
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [frameworks] = await Promise.all([
          fetchFrameWorkData(),
          //   CreateUserMap(),
        ]);
        setFrameworks(frameworks);
        // setuserIdNameMap(users);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="flex justify-center items-center">
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex justify-center"
            disabled={loading}
          >
            <Download className="mr-2 h-4 w-4" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Framework</DialogTitle>
          </DialogHeader>

          {/* Wrap content in Form component */}
          <Form {...form}>
            <form
              // onSubmit={form.handleSubmit(handleUpload)}
              className="space-y-4 py-4"
            >
              {/* Framework Info Inputs */}
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
              <Input
                placeholder="Framework Name"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
              />

              <Label>Framework Description</Label>
              <Textarea
                placeholder="Framework Description"
                value={frameworkDescription}
                onChange={(e) => setFrameworkDescription(e.target.value)}
              />

              <FormMultiComboboxInput
                formControl={form.control}
                name="owners" 
                label="Owner(s)*"
                placeholder="Select Owner's"
                items={userIdNameMap}
                defaultValue={form.getValues("owners")} 
              />
            </div> */}

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer hover:border-primary/50"
              >
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
                  <li>Framework Name (Optional Column)</li>
                  <li>Control Policy ID</li>
                  <li>Control Policy Name</li>
                  <li>Control Objective ID</li>
                  <li>Control Objective</li>
                  <li>Observation ID</li>
                  <li>Observation</li>
                  <li>Conformity</li>
                  <li>Recommendation</li>
                  <li>Owner Name</li>
                  <li>Due Date (Optional Column)</li>
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
              {/* <Button
                variant="outline"
                size="sm"
                className="mt-2 flex justify-center"
                asChild
              >
                <a
                  href={`${process.env.NEXT_BASE_PATH}/findings_template_demo.xlsx`}
                  download="Findings_Template.xlsx"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </a>
              </Button> */}
              <Button
                type="button"
                className="w-full"
                onClick={handleUpload}
                disabled={!file}
              >
                Upload
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
