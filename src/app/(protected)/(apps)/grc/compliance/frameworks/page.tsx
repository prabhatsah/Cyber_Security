"use client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import {
  Plus,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Download,
} from "lucide-react";
import { Separator } from "@/shadcn/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
// import { FrameworkView } from "@/app/controls/framework/framework-view"
// import { ImportControls } from "@/app/controls/framework/import/import-controls"
// import { EvidenceManager } from "@/app/controls/framework/evidence/evidence-manager"
// import { NewFrameworkForm } from "@/app/controls/framework/new-framework-form"
import Tab from "./frameworksTab";
import { startFrameworkData } from "./(backend-calls)";
import { useRouter } from "next/navigation";
import { fetchFrameworkData } from "./(backend-calls)/getData";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { toast } from "../../components/ui/use-toast";
interface Framework {
  id: string;
  name: string;
  category: string;
  status: string;
  lastUpdate: string;
  evidenceCount: number;
  completionRate: number;
  description?: string;
  controls?: {
    id: string;
    name: string;
    status: string;
    lastReview: string;
  }[];
  requirements?: {
    id: string;
    name: string;
    status: string;
    dueDate: string;
  }[];
}

export default function FrameworksPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(
    null
  );
  const [evidenceType, setEvidenceType] = useState("");
  // const [activeFramework, setActiveFramework] = useState<string | null>(null)
  const [frameworkData, setFrameworkData] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    lastUpdate: "",
    uploads: null,
  });
  async function fetchFrameworkDatFunction() {
    let fetchedFrameworkdata = await fetchFrameworkData();
    console.log("fetchedFrameworkdata------>", fetchedFrameworkdata);
    setfetchedFrameworkData(fetchedFrameworkdata);
  }
  useEffect(() => {
    fetchFrameworkDatFunction();
  }, []);
  const [fetchedframeworkData, setfetchedFrameworkData] = useState([]);
  const [frameworks] = useState<Framework[]>([
    {
      id: "ISO27001",
      name: "ISO/IEC 27001:2022",
      category: "Information Security",
      status: "Active",
      lastUpdate: "2024-03-15",
      evidenceCount: 24,
      completionRate: 85,
      description: "Information Security Management System Standard",
      controls: [
        {
          id: "A.5.1",
          name: "Information Security Policies",
          status: "Implemented",
          lastReview: "2024-03-01",
        },
        {
          id: "A.6.1",
          name: "Internal Organization",
          status: "In Progress",
          lastReview: "2024-02-15",
        },
        {
          id: "A.7.1",
          name: "Human Resource Security",
          status: "Implemented",
          lastReview: "2024-03-10",
        },
      ],
      requirements: [
        {
          id: "R1",
          name: "Policy Documentation",
          status: "Complete",
          dueDate: "2024-04-01",
        },
        {
          id: "R2",
          name: "Risk Assessment",
          status: "In Progress",
          dueDate: "2024-04-15",
        },
        {
          id: "R3",
          name: "Internal Audit",
          status: "Pending",
          dueDate: "2024-05-01",
        },
      ],
    },
    {
      id: "COBIT2019",
      name: "COBIT 2019",
      category: "IT Governance",
      status: "Active",
      lastUpdate: "2024-03-10",
      evidenceCount: 18,
      completionRate: 92,
      description: "Framework for IT governance and management",
      controls: [
        {
          id: "EDM01",
          name: "Governance Framework",
          status: "Implemented",
          lastReview: "2024-03-05",
        },
        {
          id: "APO01",
          name: "IT Management Framework",
          status: "Implemented",
          lastReview: "2024-02-28",
        },
      ],
      requirements: [
        {
          id: "R1",
          name: "Governance Documentation",
          status: "Complete",
          dueDate: "2024-04-01",
        },
        {
          id: "R2",
          name: "Process Assessment",
          status: "In Progress",
          dueDate: "2024-04-30",
        },
      ],
    },
    {
      id: "NIST800-53",
      name: "NIST SP 800-53",
      category: "Security Controls",
      status: "Active",
      lastUpdate: "2024-03-01",
      evidenceCount: 32,
      completionRate: 78,
      description:
        "Security and Privacy Controls for Information Systems and Organizations",
      controls: [
        {
          id: "AC-1",
          name: "Access Control Policy",
          status: "Implemented",
          lastReview: "2024-02-20",
        },
        {
          id: "AU-1",
          name: "Audit Policy",
          status: "In Progress",
          lastReview: "2024-03-01",
        },
      ],
      requirements: [
        {
          id: "R1",
          name: "Control Implementation",
          status: "In Progress",
          dueDate: "2024-05-15",
        },
        {
          id: "R2",
          name: "Security Assessment",
          status: "Pending",
          dueDate: "2024-06-01",
        },
      ],
    },
  ]);

  const [evidence, setEvidence] = useState([
    {
      id: "1",
      name: "Security Policy Document",
      framework: "ISO 27001",
      type: "Policy Document",
      uploadDate: "2024-03-15",
      status: "Approved",
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFrameworkData((prevData) => ({
      ...prevData,
      [name]: value,
      lastUpdate: new Date().toISOString(), // Only update lastUpdate
    }));
  };

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<string[]>([]);

  const cleanValue = (key: string, value: any): any => {
    if (value === null || value === undefined) return null;

    // Handle NoM/NOM cases
    if (typeof value === "string" && value.toUpperCase() === "NOM") {
      return "N/A";
    }

    // Convert Excel serial dates
    if (key.toLowerCase().includes("date") && typeof value === "number") {
      try {
        const utcDays = Math.floor(value - 25569);
        const utcValue = utcDays * 86400;
        const date = new Date(utcValue * 1000);

        // Excel's 1900 leap year bug correction
        if (value >= 60) value--;

        return date.toLocaleDateString("en-US"); // Format: MM/DD/YYYY
      } catch {
        return value; // Fallback to raw number
      }
    }

    // Clean strings
    if (typeof value === "string") {
      value = value
        .trim()
        .replace(/["@_#]/g, "")
        .replace(/\s+/g, " ");

      if (value === "") return null;

      // Handle currency ($32,370.00 → 32370)
      if (/^\$[\d,]+\.\d{2}$/.test(value)) {
        return parseFloat(value.replace(/[^\d.]/g, ""));
      }

      // Handle regular numbers
      const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ""));
      if (!isNaN(numericValue) && value.match(/[0-9]/)) {
        return numericValue;
      }

      return value;
    }

    return value;
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const [frameworkDetailsDialogOpen, setFrameworkDetailsDialogOpen] =
    useState(false);
  const handleViewDetails = (framework: Framework) => {
    setSelectedFramework(framework);
    setFrameworkDetailsDialogOpen(true);
  };
  const addFrameworkFunction = async () => {
    if (
      !frameworkData.name ||
      !frameworkData.category ||
      !frameworkData.description
    ) {
      alert("Please fill in all fields before adding the framework.");
      return;
    }

    const newFrameworkData = {
      id: Date.now().toString(),
      name: frameworkData.name,
      category: frameworkData.category,
      description: frameworkData.description,
      uploads: frameworkData.uploads,
      lastUpdate: new Date().toISOString(),
      version: "1.1",
      controls: ["CTR1", "CTR4", "CTR5"],
      totalWeight: 100,
    };

    console.log("Saving framework:", newFrameworkData);

    setFrameworkData({
      id: "",
      name: "",
      category: "",
      description: "",
      lastUpdate: "",
      uploads: null,
    });
    try {
      await startFrameworkData(newFrameworkData);
      toast({
        title: "Framework Added Successfully!",
      });
    } catch (error) {
      console.error("Adding framework failed:", error);
    }
    setFrameworkDetailsDialogOpen(false);
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex flex-row-reverse items-center justify-between space-y-2">
        <div className="flex gap-2">
          <Dialog
            open={frameworkDetailsDialogOpen} // Ensure Dialog is controlled by the state
            onOpenChange={setFrameworkDetailsDialogOpen} // Handle the dialog open/close
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Framework
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Framework</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Framework Name</Label>
                  <Input
                    name="name"
                    placeholder="Enter framework name"
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    name="category"
                    placeholder="Enter category"
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    placeholder="Enter framework description"
                    onChange={handleChange}
                  />
                </div>
                <Button className="w-full" onClick={addFrameworkFunction}>
                  Add Framework
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Import Framework */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Framework</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Dropzone for File Upload */}
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50"
                >
                  <input {...getInputProps()} />
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop framework files here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports JSON, CSV, Excel up to 5MB
                  </p>
                </div>

                {/* Display Uploaded Files */}
                <div className="text-sm text-muted-foreground">
                  <h4 className="font-medium mb-2">Uploaded Files:</h4>
                  {uploadedFiles.length > 0 ? (
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>{uploadedFiles[0].name}</span>
                    </div>
                  ) : (
                    <p className="text-xs italic">No files uploaded</p>
                  )}
                </div>

                {/* Template Format Info */}
                <div className="text-sm text-muted-foreground">
                  <h4 className="font-medium mb-2">Template Format:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Framework Name</li>
                    <li>Category</li>
                    <li>Description</li>
                    <li>Control Objectives</li>
                    <li>Requirements</li>
                  </ul>
                </div>

                {/* Display parsed data in a simple way */}
                {parsedData.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">
                      Preview (first 3 rows):
                    </h4>
                    <pre className="text-xs overflow-auto max-h-40">
                      {JSON.stringify(parsedData.slice(0, 3), null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Frameworks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{frameworks.length}</div>
            <p className="text-xs text-muted-foreground">Active frameworks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Evidence Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {frameworks.reduce((sum, f) => sum + f.evidenceCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all frameworks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                frameworks.reduce((sum, f) => sum + f.completionRate, 0) /
                  frameworks.length
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">All frameworks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {frameworks.filter((f) => f.status === "Under Review").length}
            </div>
            <p className="text-xs text-muted-foreground">Pending updates</p>
          </CardContent>
        </Card>
      </div>
      {/* <Tabs defaultValue="frameworks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="new">New Framework</TabsTrigger>
        </TabsList>
        
        <TabsContent value="frameworks">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Framework Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  {frameworks.map((framework) => (
                    <button
                      key={framework.id}
                      onClick={() => setActiveFramework(framework.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${activeFramework === framework.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                        }`}
                    >
                      {framework.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <FrameworkView
              framework={frameworks.find(f => f.id === activeFramework)!}
              controls={controls.filter(c => 
                c.frameworks.some(f => f.id === activeFramework)
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="import">
          <ImportControls />
        </TabsContent>

        <TabsContent value="evidence">
          <EvidenceManager controls={controls} />
        </TabsContent>
        
        <TabsContent value="new">
          <NewFrameworkForm />
        </TabsContent>
      </Tabs> */}
      <Tab />
    </div>
  );
}
