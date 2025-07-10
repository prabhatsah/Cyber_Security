import { Button } from "@/app/(protected)/(apps)/ai-workforce/components/ui/Button";
import { DataTable } from "@/ikon/components/data-table";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { downloadResource } from "@/ikon/utils/actions/common/utils";
import { singleFileUpload } from "@/ikon/utils/api/file-upload";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Input } from "@/shadcn/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { useForm } from "react-hook-form";
import { invokeUploadBilling } from "./invokeUploadBilling";

interface BillingFileUploadProps {
  isOpen: boolean;
  onClose: () => void;
  id: string | undefined;
}

const BillingFileUpload: React.FC<BillingFileUploadProps> = ({ isOpen, onClose, id }) => {
  const [billingData, setBillingData] = useState<any>(null);
  const [taskId, setTaskId] = useState<any>();
  const [uploadRows, setUploadRows] = useState<{[key: string]: { file?: File; fileContentDate?: string; uploadType?: string };}>({});

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const billingInsData = await getMyInstancesV2<any>({
          processName: "Billing Account",
          predefinedFilters: { taskName: "View" },
          mongoWhereClause: `this.Data.id == "${id}"`,
        });
        const billing = billingInsData[0].data;
        const taskId = billingInsData[0].taskId;
        setTaskId(taskId);
        console.log("Billing Data ------------------ ", billing);
        // Ensure the resources array is defined
        if (!billing.resources) billing.resources = [];
        setBillingData(billing);
      } catch (error) {
        console.error("Error fetching billing data:", error);
      }
    };

    if (id) {
      fetchBillingData();
    }
  }, [id]);

  // Data for the DataTable is the array of servers from billingData.
  const tableData = billingData?.servers ?? [];

  // Helper to get an existing resource (if already uploaded) for a given server/config.
  const getExistingResource = (server: string, config: string) => {
    if (!billingData || !billingData.resources) return null;
    return billingData.resources.find(
      (res: any) => res.server === server && res.config === config
    );
  };

  const handleFileChange = ( e: React.ChangeEvent<HTMLInputElement>, server: string, config: string ) => {
    const file = e.target.files?.[0];
    const key = `${server}-${config}`;
    setUploadRows((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        file,
      },
    }));
  };

  const handleDateChange = ( e: React.ChangeEvent<HTMLInputElement>, server: string, config: string ) => {
    const date = e.target.value; // Format: YYYY-MM-DD
    const key = `${server}-${config}`;
    setUploadRows((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        fileContentDate: date,
      },
    }));
  };

  const handleUploadTypeChange = (value: string, server: string, config: string) => {
    const key = `${server}-${config}`;
    setUploadRows((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        uploadType: value,
      },
    }));
  };

  // const handleRowUpload = async (server: string, config: string) => {
  //   const key = `${server}-${config}`;
  //   const rowData = uploadRows[key];
  //   if (!rowData || !rowData.file) {
  //     alert("Please choose a file before uploading.");
  //     return;
  //   }
  //   try {
  //     // Upload the file and get file details.
  //     const fileValue = await singleFileUpload(rowData.file);
  //     const resource = {
  //       resourceId: fileValue.resourceId,
  //       resourceName: fileValue.resourceName,
  //       resourceSize: fileValue.resourceSize,
  //       resourceType: fileValue.resourceType,
  //       fileContentDate: rowData.fileContentDate ? moment(rowData.fileContentDate, "YYYY-MM-DD").format("YYYY-MM") : moment().format("YYYY-MM"),
  //       uploadDate: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZZ"),
  //       uploadType: rowData.uploadType || "override",
  //       isNewUpload: false,
  //       server,
  //       config,
  //     };

  //     setBillingData((prev: any) => {
  //       if (!prev) return prev;
  //       const updatedResources = prev.resources.filter(
  //         (res: any) => !(res.server === server && res.config === config)
  //       );
  //       updatedResources.push(resource);
  //       return { ...prev, resources: updatedResources };
  //     });
  //     // Optionally clear the file for that row.
  //     setUploadRows((prev) => ({
  //       ...prev,
  //       [key]: { ...prev[key], file: undefined },
  //     }));
  //     console.log("Upload successful for", server, config, resource);
  //   } catch (error) {
  //     console.error("Error uploading file for", server, config, error);
  //   }
  // };

  const handleRowUpload = async (server: string, config: string) => {
    const key = `${server}-${config}`;
    const rowData = uploadRows[key];
    if (!rowData || !rowData.file) {
      alert("Please choose a file before uploading.");
      return;
    }
    try {
      // Upload the file and get file details.
      const fileValue = await singleFileUpload(rowData.file);
      const newResource = {
        resourceId: fileValue.resourceId,
        resourceName: fileValue.resourceName,
        resourceSize: fileValue.resourceSize,
        resourceType: fileValue.resourceType,
        fileContentDate: rowData.fileContentDate ? moment(rowData.fileContentDate, "YYYY-MM-DD").format("YYYY-MM") : moment().format("YYYY-MM"),
        uploadDate: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZZ"),
        uploadType: rowData.uploadType || "override",
        isNewUpload: true,
        server,
        config,
      };
  
      setBillingData((prev: any) => {
        if (!prev) return prev;
        let updatedResources = prev.resources ? [...prev.resources] : [];
        
        if (rowData.uploadType === "override") {
          // Remove existing resource(s) for the same server and config
          updatedResources = updatedResources.filter(
            (res) => !(res.server === server && res.config === config)
          );
        }
        
        // Append the new resource
        updatedResources.push(newResource);
        
        return { ...prev, resources: updatedResources };
      });
  
      // Optionally clear the file for that row.
      setUploadRows((prev) => ({
        ...prev,
        [key]: { ...prev[key], file: undefined },
      }));
      console.log("Upload successful for", server, config, newResource);
    } catch (error) {
      console.error("Error uploading file for", server, config, error);
    }
  };  
  
  const handleFinalSave = async () => {
    if (!billingData) return;
    try {
      const finalData = { ...billingData };
      console.log("Final Data to be saved:", finalData);
      //await invokeUploadBilling(taskId, finalData);
      //const response = await axios.post("/api/updateBillingDetailFiles", finalData);
      //console.log("Final data saved successfully:", response.data);
      onClose();
    } catch (error) {
      console.error("Error saving final data:", error);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: () => <div>Server</div>,
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: "config",
      header: () => <div>Configuration</div>,
      cell: ({ row }) => <span>{row.original.config}</span>,
    },
    {
      id: "previouslyUploadedFile",
      header: () => <div>Previously Uploaded File</div>,
      cell: ({ row }) => {
        const server = row.original.name;
        const config = row.original.config;
        const resource = getExistingResource(server, config);
        return resource ? (
          <Input type="text" value={resource.resourceName} readOnly />
        ) : (
          <span className="text-danger text-align-center">N/A</span>
        );
      },
    },
    {
      id: "uploadedDate",
      header: () => <div>Uploaded Date</div>,
      cell: ({ row }) => {
        const server = row.original.name;
        const config = row.original.config;
        const resource = getExistingResource(server, config);
        return resource ? (
          <span>{moment(resource.uploadDate).format("DD-MM-YYYY")}</span>
        ) : (
          <span className="text-danger">N/A</span>
        );
      },
    },
    {
      id: "uploadNewFile",
      header: () => <div>Upload New File</div>,
      cell: ({ row }) => {
        const server = row.original.name;
        const config = row.original.config;
        return (
          <>
            <Input
              type="file"
              onChange={(ev) => handleFileChange(ev, server, config)}
            />
            {config === "User List" && (
              <Input
                type="date"
                onChange={(ev) => handleDateChange(ev, server, config)}
              />
            )}
          </>
        );
      },
    },
    {
      id: "uploadType",
      header: () => <div style={{ textAlign: "center" }}>Upload Type</div>,
      cell: ({ row }) => {
        const server = row.original.name;
        const config = row.original.config;
        const key = `${server}-${config}`;
        return (
          <Select
            value={uploadRows[key]?.uploadType || "override"}
            onValueChange={(value) => handleUploadTypeChange(value, server, config)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Upload Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="append">Append</SelectItem>
              <SelectItem value="override">Override</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: "action",
      header: () => <div style={{ textAlign: "center" }}>Action</div>,
      cell: ({ row }) => {
        const server = row.original.name;
        const config = row.original.config;
        return (
          <Button type="button" onClick={() => handleRowUpload(server, config)}>
            <Upload />
          </Button>
        );
      },
    },
  ];
  

  const extraParams: DTExtraParamsProps = {
    paginationBar: false,
    grouping: false,
    defaultTools: false,
    sorting: false,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="max-w-7xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Configure Billing Account Servers</DialogTitle>
        </DialogHeader>

        <DataTable columns={columns} data={tableData} extraParams={extraParams} />

        <DialogFooter className="flex justify-end mt-4">
          <Button type="button" onClick={handleFinalSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BillingFileUpload;
