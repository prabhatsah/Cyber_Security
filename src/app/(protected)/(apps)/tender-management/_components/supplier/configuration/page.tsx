"use client";
import { useState } from "react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Cog } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import departmentsData from "../../../_utils/common/departments";
import { toast } from "sonner";
import { DataTable } from "@/ikon/components/data-table";
import Link from "next/link";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import { updateTenderInterested } from "../../../_utils/import-external-utils/features";
import CustomAlertDialog from "@/ikon/components/alert-dialog";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";

const regions = ["India", "Global"];

function buildTenderURL({
  selectedDepartment,
  selectedSector,
  selectedRegion,
  selectedProduct,
  selectedKeyword,
}: {
  selectedDepartment?: string;
  selectedSector?: string;
  selectedRegion?: string;
  selectedProduct?: string;
  selectedKeyword?: string;
}) {
  const parts: string[] = [];

  if (selectedDepartment) parts.push(selectedDepartment);
  if (selectedSector) parts.push(selectedSector);
  if (selectedProduct) parts.push(selectedProduct);
  if (selectedKeyword) parts.push(selectedKeyword);

  parts.push("tender"); // Always include "tender"

  if (selectedRegion?.toLowerCase() === "global") {
    parts.push("global");
  }

  const query = parts.join("+");
  return `https://tender247.com/keyword/${query}`;
}

export default function ConfigurationTenderPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("");

  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>([]);

  const { openDialog } = useDialog();

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

  const handleImport = async () => {
    if (
      selectedDepartment === "" &&
      selectedSector === "" &&
      selectedRegion === "" &&
      selectedProduct === "" &&
      selectedKeyword === ""
    ) {
      openDialog({
        title: "Alert",
        description: "Please provide at least one search parameter",
        confirmText: "Okay",
        onConfirm: () => console.log("ok"),
      });
      return;
    }
    setLoading(true);
    try {
      let searchURL = buildTenderURL({
        selectedDepartment,
        selectedSector,
        selectedRegion,
        selectedProduct,
        selectedKeyword,
      });

      console.log("Search URL:", searchURL);

      const res = await fetch("/api/run-puppeteer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: searchURL }),
      });
      const data = await res.json();
      console.log("Data from Puppeteer:", data);

      if (!res.ok) throw new Error("Failed to fetch data from Puppeteer");

      const content = data.message;

      const response = await fetch(
        "https://ikoncloud-dev.keross.com/aiagent/webhook/11751fe8-7c86-49aa-b7f4-d73df60f4258",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: content,
          }),
        }
      );

      if (!response.ok) throw new Error("Webhook POST failed");

      const webhookResponse = await response.json();
      console.log("Response from server:", webhookResponse);

      setResult(webhookResponse[0]?.message?.content?.tenders ?? []);
      toast.success("Fetched");
    } catch (err) {
      console.error("Error:", err);
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  /****************Datatable**************** */
  const columns: DTColumnsProps<any>[] = [
    {
      accessorKey: "title",
      header: () => <div style={{ textAlign: "center" }}>Tender Title</div>,
      cell: ({ row }) => (
        <span className={{ textAlign: "left" }}>
          <Link
            href={"https://tender247.com" + row.original?.url}
            target="_blank"
          >
            {row.original?.title}
          </Link>
        </span>
      ),
    },
    {
      accessorKey: "bidValue",
      header: () => <div style={{ textAlign: "center" }}>Bid Value</div>,
      cell: ({ row }) => <span>{row.original?.bidValue}</span>,
    },

    {
      accessorKey: "deadline",
      header: () => <div style={{ textAlign: "center" }}>Deadline</div>,
      cell: ({ row }) => <span>{row.original?.deadline}</span>,
    },
    {
      accessorKey: "daysLeft",
      header: () => <div style={{ textAlign: "center" }}>Time Remain</div>,
      cell: ({ row }) => <span>{row.original?.daysLeft}</span>,
    },
    {
      accessorKey: "location",
      header: () => <div style={{ textAlign: "center" }}>Location</div>,
      cell: ({ row }) => <>{row.original.location}</>,
    },
  ];

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    //extraTools: [<CreateDraftButtonWithModal />],
    actionMenu: {
      items: [
        {
          label: "Interested",
          onClick: (rowData) => {
            try {
              openDialog({
                title: "External Tender Alert",
                description:
                  "Ikon cannot monitor this tender as it belongs to an external site. Are you sure to continue?",
                confirmText: "Continue",
                cancelText: "Cancel",
                onConfirm: () =>
                  updateTenderInterested(rowData, selectedDepartment),
                onCancel: () => console.log("Cancel action executed!"),
              });
            } catch (error) {
              toast.error("Failed to take action");
            }
          },
          visibility: (rowData) => {
            return true;
          },
        },
      ],
    },
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 text-center text-gray-500">
      <div className="filterSection w-full">
        <div className="grid grid-cols-4 gap-2">
          {/* Region */}
          <div className="space-y-2">
            <Select onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Select onValueChange={handleDepartmentChange}>
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
          </div>

          {/* Sector */}
          <div className="space-y-2">
            <Select
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
          </div>

          {/* Product/Service */}
          <div className="space-y-2">
            <Select
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
          </div>

          {/* Keyword Input */}
          <div className="space-y-2">
            <Input
              placeholder="Keyword"
              value={selectedKeyword}
              onChange={(e) => setSelectedKeyword(e.target.value)}
            />
          </div>

          {/* Configure Button */}
          <div>
            {/* <IconTextButtonWithTooltip
              tooltipContent="Configure"
              className="mr-2"
            >
              <Cog /> Configure
            </IconTextButtonWithTooltip> */}

            <IconTextButtonWithTooltip
              tooltipContent="Import"
              onClick={handleImport}
            >
              <Cog /> Import from External Sites
            </IconTextButtonWithTooltip>
          </div>
        </div>
      </div>

      <div className="h-[60vh] w-full mt-2">
        {loading ? (
          <LoadingSpinner size={60} />
        ) : (
          <DataTable
            columns={columns}
            data={result}
            extraParams={extraParams}
          />
        )}
      </div>
    </div>
  );
}
