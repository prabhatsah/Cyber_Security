"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcn/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Form } from "@/shadcn/ui/form";
import {
  ChevronRight,
  Plus,
  ListFilter,
  SendHorizonal,
  Upload,
} from "lucide-react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { useEffect, useRef, useState, useTransition } from "react";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Textarea } from "@/shadcn/ui/textarea";
import { getTicket } from "@/ikon/utils/actions/auth";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/shadcn/ui/input";
import { v4 as uuidv4 } from "uuid";
import {
  editTemplateData,
  getTemplateData,
  startTemplate,
} from "../../../../_utils/buyer/my-templates/template-functions";
import { toast } from "sonner";
import { ChatSection } from "./ChatSection";
import { RfpData, RfpTemplate } from "../../../../_utils/common/types";
import uploadedRfpData from "../../../../_utils/common/get-all-upload-data";
import { DOWNLOAD_URL } from "@/ikon/utils/config/urls";
import { sectors } from "../../../../_utils/common/sector";
import KendoEditor from "../../../text-editor-component/index";

interface TemplateProps {
  isOpen: boolean;
  onClose: () => void;
  templateId?: string | null | undefined;
}

const templateSchema = z.object({
  templateName: z.string().min(1, "Name is required"),
  templateCategory: z.string().min(1, "Category is required"),
  templateText: z.string().optional(),
  selectedRows: z.array(z.string()).default([]),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

export default function OpenTemplateModal({
  isOpen,
  onClose,
  templateId,
}: TemplateProps) {
  const [rfpData, setRfpData] = useState<RfpData[]>([]);
  const [loading, setLoading] = useState(true);
  const [rfpDataMap, setRfpDataMap] = useState<{ [key: string]: RfpData }>({});
  const [selectedRfp, setSelectedRfp] = useState<string[]>([]);
  const [editorValue, setEditorValue] = useState<string>("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const getContent = () => {
    return editorRef.current?.getHtml();
  };

  const setContentHandler = (html) => {
    editorRef.current?.setHtml(html);
  };

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      templateName: "",
      templateCategory: "",
      templateText: "",
      selectedRows: [],
    },
  });

  async function getRfpData() {
    try {
      if (templateId) {
        const formData: RfpTemplate = await getTemplateData(templateId);
        Object.entries(formData).forEach(([key, value]) =>
          form.setValue(key as keyof TemplateFormValues, value)
        );
        setContentHandler(formData.templateText);

        setLoading(true);
        const rfpDataForTemplate = await uploadedRfpData();
        const rfpMap: { [key: string]: RfpData } = {};

        (Array.isArray(rfpDataForTemplate) ? rfpDataForTemplate : []).forEach(
          (rfp) => {
            rfpMap[rfp.id] = rfp;
          }
        );

        setRfpDataMap(rfpMap);
        setRfpData(Object.values(rfpMap));
      } else {
        setLoading(true);
        const rfpDataForTemplate = await uploadedRfpData();
        const rfpMap: { [key: string]: RfpData } = {};

        (Array.isArray(rfpDataForTemplate) ? rfpDataForTemplate : []).forEach(
          (rfp) => {
            rfpMap[rfp.id] = rfp;
          }
        );

        setRfpDataMap(rfpMap);
        setRfpData(Object.values(rfpMap));
        form.reset();
      }
    } catch (error) {
      console.error("Error fetching RFP data:", error);
      setRfpData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      getRfpData();
    }
  }, [isOpen]);

  const viewFile = async (data: File) => {
    console.log("View File", data);
    const ticket = await getTicket();

    /* const url =
       `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
       `&resourceId=${encodeURIComponent(data.resourceId)}` +
       `&resourceName=${encodeURIComponent(data.resourceName)}` +
       `&resourceType=${encodeURIComponent(data.resourceType)}`;*/

    //window.open(encodeURI(url), "_blank");
    let link = "";
    if (
      data.resourceType == "image/jpeg" ||
      data.resourceType == "image/png" ||
      data.resourceType == "text/plain" ||
      data.resourceType == "application/pdf" ||
      data.resourceType == "video/mp4" ||
      data.resourceType == "image/gif"
    ) {
      var pdf_newTab = window.open();
      link =
        `${DOWNLOAD_URL}?ticket=${ticket}` +
        `&resourceId=${data.resourceId}` +
        `&resourceType=${data.resourceType}`;
      pdf_newTab.document.write(
        `<iframe id='viewdocId' width='100%' height='100%' src=''></iframe><script>var iframe = document.getElementById('viewdocId'); iframe.src = '${link}'</script>`
      );
    } else {
      link =
        `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
        `&resourceId=${encodeURIComponent(data.resourceId)}` +
        `&resourceName=${encodeURIComponent(data.resourceName)}` +
        `&resourceType=${encodeURIComponent(data.resourceType)}`;
      window.open(encodeURI(link), "_blank");
    }
  };

  const columns: DTColumnsProps<RfpData>[] = [
    {
      id: "select",
      header: ({ table }) => {
        // const allRowIds = table
        //   .getFilteredRowModel()
        //   .rows.map((row) => row.original.id);
        // const selectedRows = form.getValues("selectedRows");
        // const isAllSelected =
        //   selectedRows.length > 0 && selectedRows.length === allRowIds.length;
        // const isSomeSelected =
        //   selectedRows.length > 0 && selectedRows.length < allRowIds.length;
        // return (
        //   <div className="flex items-center justify-center p-2">
        //     <Checkbox
        //       checked={
        //         isAllSelected ? true : isSomeSelected ? "indeterminate" : false
        //       }
        //       onCheckedChange={(checked) => {
        //         const allRowIds = table
        //           .getFilteredRowModel()
        //           .rows.map((row) => row.original.id);
        //         // Update selectedRows based on whether the checkbox is checked or not
        //         rfpSelectionFunction(checked ? allRowIds : []);
        //       }}
        //       aria-label="Select all rows"
        //       className="cursor-pointer"
        //     />
        //   </div>
        // );
      },
      cell: ({ row }) => (
        <div className="flex items-center justify-center p-2">
          <Checkbox
            checked={form.getValues("selectedRows")?.includes(row.original.id)}
            onCheckedChange={(checked) => {
              const currentSelected = form.getValues("selectedRows") || [];
              const newSelected = checked
                ? [...currentSelected, row.original.id]
                : currentSelected.filter((id) => id !== row.original.id);

              form.setValue("selectedRows", newSelected);
              setSelectedRfp(newSelected);
            }}
            aria-label="Select row"
            className="cursor-pointer"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "rfpTitle",
      header: () => <div className="text-center font-medium">Title</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original?.rfpTitle || "N/A"}</div>
      ),
    },
    {
      accessorKey: "sector",
      header: () => <div className="text-center font-medium">Sector</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original?.sector || "N/A"}</div>
      ),
    },
    {
      accessorKey: "country",
      header: () => <div className="text-center font-medium">Country</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.original?.country || "N/A"}</div>
      ),
    },
    {
      accessorKey: "resourceData.resourceName",
      header: () => <div style={{ textAlign: "center" }}>File</div>,
      cell: ({ row }) => (
        <span onClick={() => viewFile(row.original?.resourceData)}>
          {row.original?.resourceData?.resourceName}
        </span>
      ),
    },
  ];

  const handleUpload = async () => {
    const ticket = await getTicket();
    try {
      const fileArray: File[] = [];
      let urlArray: { url: string }[] = [];
      console.log("Selected RFP IDs:", selectedRfp);
      selectedRfp.forEach((id) => {
        const rfp = rfpDataMap[id];
        let url = "";
        if (rfp) {
          url =
            DOWNLOAD_URL +
            "?ticket=" +
            ticket +
            "&resourceId=" +
            rfp.resourceData.resourceId +
            "&resourceName=" +
            rfp.resourceData.resourceName +
            "&resourceType=" +
            rfp.resourceData.resourceType;
          urlArray.push({ url: url });
          fileArray.push(rfp.resourceData);
          console.log("Selected RFP File:", urlArray);
        } else {
          console.warn(`RFP with ID ${id} not found in the map.`);
        }
        console.log("Selected RFP File Array:", fileArray);
      });
      fetch(
        "https://ikoncloud-dev.keross.com/aiagent/webhook/50b4660c-f2c3-4872-91d4-4c0408362525",
        {
          method: "POST", // Specify the request method
          headers: {
            "Content-Type": "application/json", // Indicate the data format
          },
          body: JSON.stringify({
            // Convert the data to JSON
            docs: urlArray,
          }),
        }
      )
        .then(async (response) => {
          //let audioData = await response.json();
          //audioData = audioData.data
          console.log("g", response);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        })
        .then((data) => {
          console.log("Success:", data);
          // Handle the server's response
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleGenerateUUID = () => {
    const newUUID = uuidv4();
    console.log("Generated UUID:", newUUID);
    return newUUID;
  };

  const onSubmit: SubmitHandler<TemplateFormValues> = async (data) => {
    console.log("submit clicked");
    try {
      if (templateId) {
        console.log("updating template");
        const payload = {
          ...data,
          templateId: templateId,
          templateText: getContent(),
        };
        const res = await editTemplateData(templateId, payload);
        console.log("edited");
      } else {
        console.log("creating template");
        console.log("Form Data:", data);
        const uuid = handleGenerateUUID();
        const payload = {
          ...data,
          templateId: uuid,
          templateText: getContent(),
        };
        const response = await startTemplate(payload);
        console.log("started");
      }
    } catch (error) {
      console.log("error");
      toast.error("Failed to perform action");
    }
    onClose(); // Close the dialog on successful submission
    startTransition(() => {
      router.refresh();
    });
  };

  const extraParams = {
    searching: true,
    filtering: true,
    grouping: true,
    extraTools: [
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              key="generate"
              onClick={handleUpload}
              disabled={form.getValues("selectedRows")?.length === 0}
            >
              <Upload />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload to AI</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    ],
  };

  console.log("Form Errors:", form.formState.errors);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[1800px] h-[800px] overflow-y-hidden"
        onClick={(e) => e.stopPropagation()}
        onInteractOutside={(e) => e.preventDefault()} // ⛔ Prevent closing when clicking outside
      >
        <DialogHeader>
          <DialogTitle>
            {templateId ? "Edit Template" : "Create Template"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="grid col-span-1">
              <div className="w-auto">
                <div className="space-y-4">
                  {/* {loading ? (
                    <div className="text-center py-4">Loading data...</div>
                  ) : rfpData.length === 0 ? (
                    <div className="text-center py-4">No RFP data available</div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={rfpData}
                      extraParams={extraParams}
                    />
                  )} */}
                  <DataTable
                    columns={columns}
                    data={rfpData}
                    extraParams={extraParams}
                  />
                </div>
              </div>
            </div>
            <div className="grid col-span-1">
              <div className="w-full h-full">
                <h5>Chat With AI</h5>
                <div className="h-[650px]">
                  <ChatSection onCopy={(text) => setContentHandler(text)} />
                </div>
              </div>
            </div>
            <div className="grid col-span-1">
              <div className="w-full h-20">
                <h5>Template Edit </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid col-span-1">
                    <Input
                      type="text"
                      id="templateName"
                      placeholder="Enter Template Name"
                      {...form.register("templateName")}
                    />
                    {form.formState.errors.templateName && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.templateName.message}
                      </p>
                    )}
                  </div>
                  <div className="grid col-span-1 ">
                    {/* <Input
                      type="text"
                      id="templateCategory"
                      placeholder="Enter Template Catagory"
                      {...form.register("templateCategory")}
                    /> */}
                    <Select
                      value={form.watch("templateCategory")}
                      onValueChange={(value) =>
                        form.setValue("templateCategory", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((option: any) => (
                          <SelectItem
                            key={option.sectorId}
                            value={option.sectorName}
                          >
                            {option.sectorName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.templateCategory && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.templateCategory.message}
                      </p>
                    )}
                  </div>
                  <div className="grid col-span-2">
                    {/* <Textarea
                      className="h-[550px] resize-none"
                      {...form.register("templateText")}
                    />
                    {form.formState.errors.templateText && (
                      <p className="text-red-500 text-sm">
                        {form.formState.errors.templateText.message}
                      </p>
                    )} */}
                    <KendoEditor
                      ref={editorRef}
                      initialContent={editorValue}
                      onChange={setEditorValue}
                      height={500}
                    />
                    {/* <button onClick={getContent}>Get Content</button>
                    <button onClick={setContentHandler}>Set Content</button> */}
                  </div>
                  <div className="grid col-span-2">
                    <Button
                      variant="default"
                      type="submit"
                      // onClick={handleSubmit(onSubmit)}
                    >
                      {templateId ? "Edit Template" : "Create Template"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <DialogFooter>
          <Button type="submit" variant="default" >
            {templateId ? "Edit Template" : "Create Temate"}
          </Button>
        </DialogFooter> */}
        </form>
      </DialogContent>
    </Dialog>
  );
}
