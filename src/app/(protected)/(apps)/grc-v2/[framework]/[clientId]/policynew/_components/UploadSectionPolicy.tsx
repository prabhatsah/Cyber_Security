"use client";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Download, FileText, Loader2Icon, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
// import { toast } from "sonner";
import { Input } from "@/shadcn/ui/input";
import { v4 } from "uuid";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shadcn/ui/form";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { useKBContext } from "../../(context)/KnowledgeBaseContext";
import { CreateUserMap } from "../../createUserMap";
import { useKBContext } from "../../../(context)/KnowledgeBaseContext";
// import { CreateUserMap } from "../../../createUserMap";

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
export default function UploadComponent({
  uploadDialogOpen,
  setUploadDialogOpen,
  allUsers,
}: any) {
  const router = useRouter();
  // const { refresh } = useRefresh();
  const [openFramework, setOpenFramework] = useState(false);
  const [finalUploadedData, setFinalUploadedData] = useState<any | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [framework, setFramework] = useState("");
  const [frameworkType, setFrameworkType] = useState("");
  const [frameworkId, setFrameworkId] = useState("");
  const [frameworks, setFrameworks] = useState<any[]>([]);
  // const [userIdNameMap, setuserIdNameMap] = useState<
  //     { value: string; label: string }[]
  // >([]);
  const [frameworkDescription, setFrameworkDescription] = useState("");
  const { userMap } = useKBContext();

  const [loadOnSave, setLoadOnSave] = useState<boolean>(false);
  const cleanString = (str: string) => {
    if (!str) return str;
    if (typeof str !== "string") return str;
    return str.replace(/\t/g, "").replace(/\//g, "or").trim();
  };
  const [userIdNameMap, setuserIdNameMap] = useState<
    { value: string; label: string }[]
  >([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const [users] = await Promise.all([CreateUserMap()]);
        setuserIdNameMap(users);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);
  function transformToFrameworkStructure(
    controlsData,
    framework,
    owners,
    newFrameworkId
  ) {
    const controlsMap: Record<string, any> = {};

    for (const row of controlsData) {
      const rowData: Record<string, any> = {};
      for (const item of row) {
        if (item.keyField && item.value !== undefined) {
          rowData[cleanString(item.keyField)] = cleanString(item.value);
        }
      }
      const controlId = cleanString(rowData.objectiveid.toString());
      const policyId = cleanString(rowData.controlorclausepolicyid.toString());
      const controlName = cleanString(rowData.controlorclausename || "");
      const controlDescription = cleanString(
        rowData.controlorclausedescription || ""
      );
      const controlObjective = cleanString(rowData.objectivestitle);
      const controlObjDescription = rowData.objectivedescription || "";
      const type = rowData.type;

      const controlNameID = controlName.replace(/\s+/g, "").toUpperCase();

      if (!controlsMap[controlNameID]) {
        controlsMap[controlNameID] = {
          controlName: controlName,
          controlDescription: controlDescription,
          policyId: policyId,
          controlObjectives: [],
          type: type,
        };
      }
      //we need to discuss about id
      controlsMap[controlNameID].controlObjectives.push({
        objectiveId: controlId,
        objectiveName: controlObjective,
        objectiveDescription: cleanString(controlObjDescription),
      });
    }

    return {
      success: true,
      data: [
        {
          frameworkName: framework.trim(),
          frameworkId: newFrameworkId,
          controls: Object.values(controlsMap),
          description: frameworkDescription.trim(),
          owners: owners,
          lastUpdatedOn: new Date().toISOString(),
          effectiveDate: new Date().toISOString(),
          version: "",
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
    setLoadOnSave(true);
    const formValues = form.getValues();
    const newFrameworkId = v4();
    const owners = formValues.owners;
    if (!file) {
      toast.error("Please select a file first", { duration: 4000 });
      return;
    }
    if (!framework) {
      toast.error("Please select a framework first!", { duration: 4000 });
      return;
    }
    if (!frameworkDescription) {
      toast.error("Please write some description!", { duration: 4000 });
      return;
    }
    if (owners.length == 0) {
      toast.error("Please select atleast one owner!", { duration: 4000 });
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
          toast.error(result.error);
          resetForm();
          return;
        }

        setParsedData(result.data || []);
        console.log("upload data----", result.data?.[0]);

        // setFinalUploadedData(result.data?.[0]);
        // setOpenFramework(true);

        //await startUploadData(result.data?.[0], frameworkId); // this is commented becuase using this data i would be opening Pritam's framework upload form
        // await startFrameworkData(frameworkData);
        toast.success("File uploaded successfully!", { duration: 4000 });
        setLoadOnSave(false);
        resetForm();
        setUploadDialogOpen(false);
        router.refresh();
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
    setFrameworkDescription("");
    setErrors([]);
    form.reset({
      owners: [],
    });
  };
  return (
    <>
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Policy</DialogTitle>
          </DialogHeader>

          {/* Wrap content in Form component */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpload)}
              className="space-y-4 py-4"
            >
              {/* Framework Info Inputs */}
              <div className="space-y-2">
                {/* <Label>Framework Type</Label>
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
                </Select> */}

                <Label>Policy Name</Label>
                <Input
                  placeholder="Policy Name"
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                />

                <Label>Policy Description</Label>
                <Textarea
                  placeholder="Policy Description"
                  value={frameworkDescription}
                  onChange={(e) => setFrameworkDescription(e.target.value)}
                />

                {/* Properly integrated FormMultiComboboxInput */}
                <FormMultiComboboxInput
                  formControl={form.control}
                  name="owners" // Make sure this matches your schema
                  label="Owner(s)*"
                  placeholder="Select Owner's"
                  items={userIdNameMap}
                  defaultValue={form.getValues("owners")} // Match the name
                />
              </div>

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
                <h4 className="font-medium mb-2">DOC Format:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Type</li>
                  <li>Control/Clause Policy Id</li>
                  <li>Control/Clause Name</li>
                  <li>Control/Clause Description</li>
                  <li>Objective Id</li>
                  <li>Objective Title</li>
                  <li>Objective Description</li>
                </ul>
              </div>

              <div className="pt-2">
                <p className="flex items-center gap-1">
                  <span className="text-red-500">*</span>
                  Make sure you maintain the doc format!
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
                  href={`${process.env.NEXT_BASE_PATH}/framework-sample-template.xlsx`}
                  download="Framework_Upload_Template.xlsx"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </a>
              </Button>
              <Button type="submit" className="w-full" disabled={loadOnSave}>
                Upload
                {loadOnSave && (
                  <Loader2Icon className="animate-spin h-8 w-8 text-white" />
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {openFramework && (
        <FrameworkCreationForm
          open={openFramework}
          setOpen={setOpenFramework}
          userMap={allUsers}
          frameworkDraftData={finalUploadedData}
          fromUploadFile={true}
        />
      )}
    </>
  );
}
