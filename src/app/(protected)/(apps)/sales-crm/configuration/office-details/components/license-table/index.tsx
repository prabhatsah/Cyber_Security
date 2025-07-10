'use client';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { SquarePenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import LicenseTypeModal from "./license-modal";
import LicenseButtonWithModal from "./license-type-buttons";

// Define the interface for license type data
interface LicenseTypeData {
  id: string;
  licenseType: string;
  licenseCost: string;
}

function LicenseTypeTable() {
  const router = useRouter();
  const [licenseTypeDetails, setLicenseTypeDetails] = useState<LicenseTypeData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchLicenseTypeData = async () => {
    try {
      const softwareId = await getSoftwareIdByNameVersion("Base App", "1");
      const LicenseTypeInstanceData = await getMyInstancesV2({
        softwareId: softwareId,
        processName: "License Type",
        predefinedFilters: { taskName: "View License" },
      });

      console.log("LicenseTypeInstanceData ------- ", LicenseTypeInstanceData);

      // Process the fetched data
      const licenseData: LicenseTypeData[] = [];
      LicenseTypeInstanceData.forEach((instance: any) => {
        if (instance.data && instance.data.licenseObj) {
          const licenseObj = instance.data.licenseObj;
          for (const key in licenseObj) {
            if (Object.hasOwnProperty.call(licenseObj, key)) {
              const record = licenseObj[key];
              licenseData.push({
                id: key,
                licenseType: record.LicenseType,
                licenseCost: record.LicenseCost,
              });
            }
          }
        }
      });

      console.log("Processed License Data:", licenseData);
      setLicenseTypeDetails(licenseData);
    } catch (error) {
      console.error("Error fetching license type data:", error);
    }
  };

  // Define table columns
  const columns: ColumnDef<LicenseTypeData>[] = [
    {
      accessorKey: "licenseType",
      header: () => <div style={{ textAlign: "center" }}>License Type</div>,
    },
    {
      accessorKey: "licenseCost",
      header: () => <div style={{ textAlign: "center" }}>Cost</div>,
    },
  ];

  const handleOpenModalEdit = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleCloseModalEdit = () => {
    setIsModalOpen(false);
    setSelectedId(null);
    router.refresh(); // Refresh the page
    fetchLicenseTypeData();
  };

  useEffect(() => {
    fetchLicenseTypeData();
  }, []);

  const extraParams: DTExtraParamsProps = {
    extraTools: [
      <LicenseButtonWithModal data={licenseTypeDetails} />
    ],
    actionMenu: {
      items: [
        {
          label: "Edit",
          icon: SquarePenIcon,
          onClick: (row: any) => {
            console.log("Edit clicked", row);
            handleOpenModalEdit(row.id);
          },
        },
      ],
    },
  };

  return (
    <>
      <DataTable columns={columns} data={licenseTypeDetails} extraParams={extraParams} />
      { <LicenseTypeModal isOpen={isModalOpen} onClose={handleCloseModalEdit} selectedId={selectedId}/> }
    </>
  );
}

export default LicenseTypeTable;
