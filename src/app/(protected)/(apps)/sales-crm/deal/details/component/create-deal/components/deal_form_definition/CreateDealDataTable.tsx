"use client";
import { getProjectManagerDetails } from "@/app/(protected)/(apps)/sales-crm/components/project-manager";
import { DealData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { Input } from "@/shadcn/ui/input";
import React, { useEffect, useState } from "react";

export interface ProductDetail {
  productIdentifier: string;
  productType: string;
  projectManager: string;
  productDescription: string;
}

interface ManagerDetails {
  userId: string;
  userName: string;
  userActive: boolean;
}

const columns: DTColumnsProps<ProductDetail>[] = [
  {
    accessorKey: "productType",
    header: () => <div style={{ textAlign: "center" }}>Product Type</div>,
    cell: ({ row }) => <span>{row.original.productType || "n/a"}</span>,
  },
  {
    accessorKey: "projectManager",
    header: () => <div style={{ textAlign: "center" }}>Project Manager</div>,
    cell: ({ row }) => <span>{row.original.projectManager || "n/a"}</span>,
  },
  {
    accessorKey: "productDescription",
    header: () => (
      <div style={{ textAlign: "center" }}>Product Description</div>
    ),
    cell: ({ row, column }) => {
      const [value, setValue] = useState(
        row.original.productDescription || "n/a"
      );

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        row.original.productDescription = event.target.value;
      };

      return (
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          style={{
            textAlign: "center",
            width: "100%",
            padding: "5px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      );
    },
  },
];

function CreateDealDataTable({ selectedDeal }: { selectedDeal: DealData[] }) {
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([]);
  const [projectManagerMap, setProjectManagerMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const managers = await getProjectManagerDetails() as unknown as Record<string, ManagerDetails>;
        
        const managerMap = Object.values(managers)
          .filter(manager => manager.userActive)
          .reduce((acc, manager) => {
            acc[manager.userId] = manager.userName;
            return acc;
          }, {} as Record<string, string>);

        setProjectManagerMap(managerMap);

        if (selectedDeal?.[0]?.productDetails) {
          const productDetailsObject = selectedDeal[0].productDetails;
          const productArray = Object.entries(productDetailsObject).map(
            ([productIdentifier, details]) => ({
              productIdentifier,
              productType: details.productType || "Unknown",
              projectManager: managerMap[details?.projectManager] || "Unknown",
              productDescription: details.productDescription || "No description",
            })
          );
          setProductDetails(productArray);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedDeal]);

  return <DataTable columns={columns} data={productDetails} />;
}

export default CreateDealDataTable;