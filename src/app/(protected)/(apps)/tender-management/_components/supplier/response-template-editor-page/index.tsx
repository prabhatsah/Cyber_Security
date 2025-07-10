"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Editor, EditorTools } from "@progress/kendo-react-editor";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shadcn/ui/sheet";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { ChatSection } from "../../buyer/my-templates/template-form/ChatSection";
import KendoEditor from "../../text-editor-component";
import {
  editTemplateData,
  getTemplateData,
  startTemplate,
} from "../../../_utils/supplier/response-template-functionalities";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { sectors } from "../../../_utils/common/sector";
import { ArrowLeft, Expand, Minimize } from "lucide-react";
import Link from "next/link";
import departmentsData from "../../../_utils/common/departments";
//import { ChatSection } from "@/components/ChatSection"; // Import Chat Section

const {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignJustify,
  Undo,
  Redo,
} = EditorTools;

// Mock API function to fetch existing data
const fetchTemplateById = async (id: string) => {
  return {
    templateName: "Sample Template",
    sector: "IT",
    content: "<p>Sample content in Kendo Editor</p>",
  };
};

interface TemplateEditorProps {
  id: string;
}

export default function ResponseTemplateEditor({ id }: TemplateEditorProps) {
  console.log("id received", id);
  const router = useRouter();
  const [templateName, setTemplateName] = useState("");
  const [sector, setSector] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    templateName: "",
    department: "",
    sector: "",
    product: "",
    editorValue: "",
  });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const editorRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState([]);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<string[]>([]);

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    const dept = departmentsData.find((d) => d.department === value);
    setAvailableSectors(dept?.sectors || []);
    setAvailableProducts([]);
    setSelectedSector("");
  };

  const handleSectorChange = (value: string) => {
    setSelectedSector(value);
    const dept = departmentsData.find(
      (d) => d.department === selectedDepartment
    );
    if (dept && dept.sectors.includes(value)) {
      setAvailableProducts(dept.productsServices || []);
    } else {
      setAvailableProducts([]);
    }
  };

  const isEditing = id !== "new"; // If id is "new", it's create mode

  const getContent = () => {
    return editorRef.current?.getHtml();
  };

  const setContentHandler = (html) => {
    editorRef.current?.setHtml(html);
  };

  async function getRfpData() {
    try {
      if (id) {
        const formData: any = await getTemplateData(id);
        // Object.entries(formData).forEach(([key, value]) =>
        //   form.setValue(key as keyof TemplateFormValues, value)
        // );
        setTemplateName(formData.templateName);
        //setSelectedDepartment(formData.templateDepartment);
        handleDepartmentChange(formData.templateDepartment);
        //setSelectedSector(formData.templateSector);
        handleSectorChange(formData.templateSector);
        setSelectedProduct(formData.templateProduct);
        setSector(formData.templateCategory);
        setContentHandler(formData.templateText);
      }
    } catch (error) {
      console.error("Error fetching RFP data:", error);
      //setRfpData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isEditing) {
      // Fetch existing record
      setLoading(true);
      getRfpData();
    }
  }, [id, isEditing]);

  const handleGenerateUUID = () => {
    const newUUID = uuidv4();
    console.log("Generated UUID:", newUUID);
    return newUUID;
  };

  const validateFields = () => {
    let isValid = true;

    if (!templateName) {
      setErrors((prev) => ({
        ...prev,
        templateName: "Template Name is required",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, templateName: "" }));
    }
    if (!selectedDepartment) {
      setErrors((prev) => ({ ...prev, department: "Department is required" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, department: "" }));
    }
    if (!selectedSector) {
      setErrors((prev) => ({ ...prev, sector: "Sector is required" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, sector: "" }));
    }
    if (!selectedProduct) {
      setErrors((prev) => ({ ...prev, product: "Product is required" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, product: "" }));
    }
    if (!getContent()) {
      setErrors((prev) => ({ ...prev, editorValue: "Content is required" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, editorValue: "" }));
    }
    return isValid;
  };

  const handleSave = async () => {
    console.log("submit clicked");

    if (!validateFields()) return;

    try {
      if (isEditing) {
        console.log("updating template");
        const payload = {
          templateName,
          templateDepartment: selectedDepartment,
          templateSector: selectedSector,
          templateProduct: selectedProduct,
          templateId: id,
          templateText: getContent(),
        };
        const res = await editTemplateData(id, payload);
        console.log("edited");
      } else {
        console.log("creating template");
        //console.log("Form Data:", data);
        const uuid = handleGenerateUUID();
        const payload = {
          templateName,
          templateDepartment: selectedDepartment,
          templateSector: selectedSector,
          templateProduct: selectedProduct,
          templateId: uuid,
          templateText: getContent(),
        };
        const response = await startTemplate(payload);
        console.log("started");
      }
      toast.success("Template saved successfully");
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to perform action");
    } finally {
      router.replace("/tender-management/supplier/template");
    }
    // startTransition(() => {
    //   router.refresh();
    // });
  };

  const generateWithAI = async () => {
    let isValid = true;
    if (!selectedDepartment) {
      setErrors((prev) => ({ ...prev, department: "Department is required" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, department: "" }));
    }
    if (!selectedSector) {
      setErrors((prev) => ({ ...prev, sector: "Sector is required" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, sector: "" }));
    }
    if (!selectedProduct) {
      setErrors((prev) => ({ ...prev, product: "Product is required" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, product: "" }));
    }
    if (!isValid) return;
    const link =
      "https://ikoncloud-dev.keross.com/aiagent/webhook/11066cf6-68e3-41fe-8624-066a8ed3018d";
    setGenerateLoading(true);

    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatinput: `create a tender response template for tender where tender type is ${selectedProduct}`,
        //reference: templateData,
        //reference: htmlToText(template),
      }),
    });

    const data = await response.json();
    setGenerateLoading(false);
    console.log("chat response", data);
    setContentHandler(data[0]?.output || "I couldn't process that request.");
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} />
      ) : (
        <div className="max-w-full mx-auto p-3 space-y-2">
          <div className="flex gap-2">
            <Link href={`/tender-management/supplier/template`}>
              <ArrowLeft />
            </Link>
            <h2 className="text-lg font-bold">
              {isEditing ? "Edit Template" : "Create New Template"}
            </h2>
          </div>

          <div className="grid grid-cols-7 gap-2">
            <div className="col-span-3">
              <Label>Template Name</Label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
              {errors.templateName !== "" && (
                <p className="text-red-500 text-sm">{errors.templateName}</p>
              )}
            </div>
            {/* Department */}
            <div className="">
              <Label>Department</Label>
              <Select
                value={selectedDepartment}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentsData.map((dept) => (
                    <SelectItem key={dept.department} value={dept.department}>
                      {dept.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sector !== "" && (
                <p className="text-red-500 text-sm">{errors.department}</p>
              )}
            </div>

            {/* Sector */}
            <div className="">
              <Label>Sector</Label>
              <Select
                value={selectedSector}
                onValueChange={handleSectorChange}
                disabled={!selectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  {availableSectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sector !== "" && (
                <p className="text-red-500 text-sm">{errors.sector}</p>
              )}
            </div>

            {/* Product/Service */}
            <div className="">
              <Label>Product</Label>
              <Select
                value={selectedProduct}
                disabled={!selectedSector}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Product/Service" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sector !== "" && (
                <p className="text-red-500 text-sm">{errors.product}</p>
              )}
            </div>
            {/* <div className="col-span-3">
              <Label>Sector</Label>
              <Select
                value={sector}
                onValueChange={(value) => setSector(value as string)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((option: any) => (
                    <SelectItem key={option.sectorId} value={option.sectorName}>
                      {option.sectorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sector !== "" && (
                <p className="text-red-500 text-sm">{errors.sector}</p>
              )}
               <Input
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              />
            </div> */}
            <div className="col-span-1 mt-6">
              <Button
                onClick={generateWithAI}
                disabled={generateLoading}
                style={{ width: "100%" }}
              >
                {generateLoading ? (
                  <div className="flex justify-center items-center w-full">
                    <span>Generating...</span>
                  </div>
                ) : (
                  <>Generate With AI</>
                )}
              </Button>
            </div>
          </div>

          {/* Kendo Editor for rich text editing */}
          <div>
            <Label>Template Content</Label>
            <KendoEditor
              initialContent=""
              onChange={() => {}}
              height={550}
              ref={editorRef}
            />
            {errors.editorValue !== "" && (
              <p className="text-red-500 text-sm">{errors.editorValue}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={handleSave}>
              {isEditing ? "Save" : "Create"}
            </Button>
            <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">Chat with AI</Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="p-4"
                style={{ maxWidth: isFullWidth ? "200vw" : "30vw" }}
              >
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center justify-between mt-8">
                      <span>Chat AI</span>
                      <span
                        className="ms-2"
                        onClick={() => setIsFullWidth(!isFullWidth)}
                      >
                        {isFullWidth ? (
                          <Minimize size={16} />
                        ) : (
                          <Expand size={16} />
                        )}
                      </span>
                    </div>
                  </SheetTitle>
                  <SheetDescription>
                    Chat with AI to get suggestions for your template
                  </SheetDescription>
                </SheetHeader>
                <ChatSection
                  messages={messages}
                  setMessages={setMessages}
                  onCopy={(text) => setContentHandler(text)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}
    </>
  );
}
