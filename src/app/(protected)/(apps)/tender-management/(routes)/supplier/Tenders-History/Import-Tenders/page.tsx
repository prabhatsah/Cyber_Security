"use client";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Import,
  Save,
  Search,
  EllipsisVertical,
  File,
  FileCode,
  FileImage,
  FilePlus,
  FileText,
  Folder,
  MoreHorizontal,
  Check,
  FileSpreadsheet,
} from "lucide-react";
import { use, useEffect, useState } from "react";
import { getDocumentManagementFileList } from "../../../../_utils/common/document-management-data";
import moment from "moment";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import departmentsData from "../../../../_utils/common/departments";
import { useForm } from "react-hook-form";
import { Form } from "@/shadcn/ui/form";
import { tenderHistoryUpload } from "./save_and_upload_pinecone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function ImportTender() {
  // Added state management for file selection

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const result: any = await getDocumentManagementFileList();
        console.log("subscribe data-----", result);
        setData(result);
      } catch (error) {
        console.error("Error fetching subscribed softwares:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);
  interface FileItem {
    id: string;
    fileName: string;
    fileType: string;
    lastModified: string;
    fileSize: string;
    selected: boolean;
  }

  const [files, setFiles] = useState<FileItem[]>([]);


  useEffect(() => {
    console.log("data", data);
    let files: any[] = [];
    let existingIds: any = [];
    if (data) {
      data.forEach((d) => {
        if (!existingIds.includes(d.uploadResourceDetails[0].resourceId)) {
          files.push({
            id: d.uploadResourceDetails[0].resourceId,
            fileName: d.uploadResourceDetails[0].fileName,
            fileType: d.uploadResourceDetails[0].fileNameExtension,
            lastModified: d.updatedOn,
            fileSize: d.uploadResourceDetails[0].resourceSize,
            selected: false,
          });
          existingIds.push(d.uploadResourceDetails[0].resourceId);
        }
      });

      setFiles(files);
    }
  }, [data]);
  // files.map((file: FileItem) =>
  //   file.id === id ? { ...file, selected: !file.selected } : file
  // )
  // Track selected files count
  const selectedFiles = files.filter((file) => file.selected)


  // Toggle selection for a file
  const toggleSelect = (id : string) => {
    setFiles(
      files.map((file) =>
        file.id === id ? { ...file, selected: !file.selected } : file
      )
    );
    console.log("selected files", files);
  };

  // // Select all files
  // const selectAll = () => {
  //   setFiles(files.map((file) => ({ ...file, selected: true })));
  // };

  // // Deselect all files
  // const deselectAll = () => {
  //   setFiles(files.map((file) => ({ ...file, selected: false })));
  // };

  // Handle file click (open/preview)
  const handleFileClick = (id) => {
    console.log(`File ${id} clicked`);
    // Here you would typically open a preview or details view
  };

  const DriveFileItem = ({
    id,
    fileName = "Document.pdf",
    fileType = "pdf",
    lastModified = "Apr 1, 2025",
    fileSize = "2.4 MB",
    selected = false,
    onSelect = () => {},
    onFileClick = () => {},
  }) => {
    // Get appropriate color and icon based on file type
    const getFileDetails = () => {
      switch (fileType.toLowerCase()) {
        case "pdf":
          return {
            icon: <File size={28} />,
            color: "#F25C54",
            bgColor: "#F25C54",
          };
        case "doc":
        case "docx":
          return {
            icon: <FileText size={28} />,
            color: "#4361EE",
            bgColor: "#4361EE",
          };
        case "xls":
        case "xlsx":
          return {
            icon: <FileSpreadsheet size={20} />,
            color: "#28A745",
            bgColor: "28A745",
          };
        case "jpg":
        case "png":
        case "gif":
          return {
            icon: <FileImage size={28} />,
            color: "#4CC9F0",
            bgColor: "#4CC9F0",
          };
        case "folder":
          return {
            icon: <Folder size={28} />,
            color: "#FDCA40",
            bgColor: "#FDCA40",
          };
        case "js":
        case "html":
        case "css":
          return {
            icon: <FileCode size={28} />,
            color: "#7209B7",
            bgColor: "#7209B7",
          };
        default:
          return {
            icon: <FilePlus size={28} />,
            color: "#6C757D",
            bgColor: "#6C757D",
          };
      }
    };

    const { icon, color, bgColor } = getFileDetails();

    const handleSelect = (e) => {
      e.stopPropagation();
      onSelect(id);
    };
    const hexToRgb = (hex) => {
      hex = hex.replace(/^#/, "");
      if (hex.length === 3) {
        hex = hex
          .split("")
          .map((x) => x + x)
          .join("");
      }
      const num = parseInt(hex, 16);
      return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    };

    const formatFileSize = (bytes: any) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      if (bytes < 1024 * 1024 * 1024)
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    };

    const formatTime = (dateString, formatType = "MMM D, YYYY h:mm A") => {
      return moment(dateString).format(formatType);
    };

    return (
      <div
        className={`group relative bg-background rounded-xl overflow-hidden shadow-md hover:shadow-md transition-all duration-200 border ${
          selected ? "border-primary border-2" : "border-transparent"
        }`}
        onClick={() => onFileClick(id)}
      >
        {/* Selection checkbox - visible on hover or when selected */}
        <div
          className={`absolute top-2 left-2 z-10 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer transition-all duration-200 ${
            selected
              ? "bg-indigo-500 text-white"
              : "bg-black bg-opacity-25 text-white opacity-0 group-hover:opacity-100"
          }`}
          onClick={handleSelect}
        >
          {selected && <Check size={14} />}
        </div>

        {/* Top file preview area */}
        <div
          className="h-32 flex items-center justify-center"
          style={{ backgroundColor: `rgba(${hexToRgb(bgColor)}, 0.3)` }} // Apply background opacity
        >
          <div
            style={{ color }} // Keep icon color separate
            className="transform group-hover:scale-110 transition-transform duration-200"
          >
            {icon}
          </div>
        </div>

        {/* File info area */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground truncate">{fileName}</h3>
          </div>

          <div className="mt-2 flex items-center text-xs text-foreground">
            <span>{formatFileSize(fileSize)}</span>
            <span className="mx-1.5">•</span>
            <span>{formatTime(lastModified)}</span>
          </div>
        </div>

        {/* Hover overlay for quick actions - appears on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200 pointer-events-none">
          <div
            className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r"
            style={{ backgroundColor: color, opacity: 0.6 }}
          ></div>
        </div>
      </div>
    );
  };
  {
    /* search  */
  }
  const [searchTerm, setSearchTerm] = useState("");

  // Function to handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter files based on search term
  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  {
    /* search ends */
  }

  // Handle Department Change
  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
    const department = departmentsData.find((d) => d.department === value);
    setAvailableSectors(department ? department.sectors : []);
    setSelectedSector(""); // Reset sector
    setAvailableProducts([]); // Reset products
  };

  // Handle Sector Change
  const handleSectorChange = (value) => {
    setSelectedSector(value);
    const department = departmentsData.find(
      (d) => d.department === selectedDepartment
    );
    setAvailableProducts(department ? department.productsServices : []);
  };

   const form = useForm({ });
   const handleGenerateUUID = () => {
     return crypto.randomUUID();
   };

   const onSubmit = async (data: any) => {
       try {
         console.log("Form Data:", data);
         const uuid = handleGenerateUUID();
         const formData = {} as any;
         formData["id"] = uuid;
         formData["department"] = data.department;
         formData["sector"] = data.sector;
         formData["product_service"] = data.product_service;
         formData["uploadTime"] = moment().format("YYYY-MM-DD HH:mm:ss");
         formData["files"] = selectedFiles;
   
         console.log("Form Data after try:", formData);
         await tenderHistoryUpload(formData);
         console.log("RFP draft started successfully.");
         toast.success(
                    "Files uploaded successfully")
                  console.log("started successfully.");
                router.replace("/tender-management/supplier/Tenders-History");
       } catch (error) {
         console.error("Error starting RFP draft:", error);
       } finally {
         form.reset();
         //onClose();
         //router.refresh();
       }
     };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full">
          <div className="flex flex-col w-full h-full gap-2">
            <div className="headerSection w-full flex justify-between items-center">
              <div>
                <span>Import Tenders</span>
              </div>
              <div>
                <IconTextButtonWithTooltip tooltipContent="Save" type="submit">
                  <Save size={20} />
                  <span>Save</span>
                </IconTextButtonWithTooltip>
              </div>
            </div>
            <div className="bodySection w-full h-full">
              <div className="grid grid-cols-3 gap-2">
                {/* Department Select */}
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    onValueChange={(value) => {
                      form.setValue("department", value);
                      handleDepartmentChange(value);
                    }}
                    //defaultValue={selectedDepartment}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Choose department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentsData.map((dept) => (
                        <SelectItem
                          key={dept.department}
                          value={dept.department}
                        >
                          {dept.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sector Select */}
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Select
                    onValueChange={(value) => {
                      form.setValue("sector", value);
                      handleSectorChange(value);
                    }}
                    //defaultValue={selectedSector}
                    disabled={!selectedDepartment}
                  >
                    <SelectTrigger id="sector">
                      <SelectValue placeholder="Choose sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product/Service Select */}
                <div className="space-y-2">
                  <Label htmlFor="type">Product/Service</Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("product_service", value)
                    }
                    disabled={!selectedSector}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Choose product/service" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.map((product) => (
                        <SelectItem key={product} value={product}>
                          {product}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="border border-gray-[#383838] rounded-md p-2 mt-2 h-[75dvh] flex flex-col">
                <div className="flex flex-row-reverse">
                  <div className="relative max-w-xs float-end">
                    <div className="relative flex items-center w-full h-10 rounded-md bg-background border border-gray-[#383838] px-3">
                      <Search size={20} className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-transparent text-foreground outline-none placeholder-gray-400 text-sm"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {isLoading ? (
                    // Loading indicator (spinner or skeleton)
                    <div className="flex justify-center items-center h-full">
                      <div
                        className="w-8 h-8 border-4 border-gray-300 rounded-full animate-spin"
                        style={{
                          borderTopColor: "hsl(var(--sidebar-background))",
                        }}
                      ></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {filteredFiles.map((file) => (
                        <DriveFileItem
                          key={file.id}
                          id={file.id}
                          fileName={file.fileName}
                          fileType={file.fileType}
                          lastModified={file.lastModified}
                          fileSize={file.fileSize}
                          selected={file.selected}
                          onSelect={toggleSelect}
                          onFileClick={handleFileClick}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
