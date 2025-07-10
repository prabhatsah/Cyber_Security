'use client';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { SquarePenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import WorkingDaysButtonWithModal from "./working-days-buttons";
import WorkingDaysModal from "./working-days-modal";

interface WorkingDaysDetailsData {
 // id: string;
  year: string;
  month: string;
  workingDays: number;
}

function WorkingDaysDetailsTable() {
  const router = useRouter();
  const [workingDaysDetails, setWorkingDaysDetails] = useState<WorkingDaysDetailsData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const fetchWorkingDaysDetailsData = async () => {
    try {
      const workingDaysInstanceData = await getMyInstancesV2({
        processName: "Working Days",
        predefinedFilters: { taskName: "View State" }
      });

      console.log("Fetched Data:", workingDaysInstanceData);

      const workingData: WorkingDaysDetailsData[] = [];
      workingDaysInstanceData.forEach((instance: any) => {
        if (instance.data && instance.data.workingDaysDetails) {
          const details = instance.data.workingDaysDetails;
          for (const year in details) {
            if (Object.hasOwnProperty.call(details, year)) {
              const months = details[year];
              for (const month in months) {
                if (Object.hasOwnProperty.call(months, month)) {
                  const record = months[month];
                  workingData.push({
                  //  id: `${record.year}-${record.month}`,
                    year: record.year,
                    month: record.month,
                    workingDays: record.workingDays
                  });
                }
              }
            }
          }
        }
      });

      console.log("Processed Working Days Data:", workingData);
      setWorkingDaysDetails(workingData);
    } catch (error) {
      console.error("Error fetching working days data:", error);
    }
  };

  const columns: ColumnDef<WorkingDaysDetailsData>[] = [
    {
      accessorKey: "year",
      //header: () => <div style={{ textAlign: "center" }}>Year</div>,
    },
    {
      accessorKey: "month",
      header: () => <div style={{ textAlign: "center" }}>Month</div>,
    },
    {
      accessorKey: "workingDays",
      header: () => <div style={{ textAlign: "center" }}>Number of working days</div>,
    },
  ];

  const handleOpenModalEdit = (year: string) => {
    setSelectedYear(year);
    setIsModalOpen(true);
  };

  const handleCloseModalEdit = () => {
    setIsModalOpen(false);
    setSelectedYear(null);
    router.refresh(); // Refresh the page
    fetchWorkingDaysDetailsData();
  };

  useEffect(() => {
    fetchWorkingDaysDetailsData();
  }, []);

  const extraParams: DTExtraParamsProps = {
    defaultGroups: ["year"],
    extraTools: [
      <WorkingDaysButtonWithModal />
    ],
    // groupActionMenu: {
    //   items: [
    //     {
    //       label: "Edit",
    //       icon: SquarePenIcon,
    //       onClick: (row: any) => {
    //         console.log("Edit clicked", row);
    //         handleOpenModalEdit(row.year);
    //       },
    //     },
    //   ],
    // },
  };

  return (
    <>
      <DataTable columns={columns} data={workingDaysDetails} extraParams={extraParams} />
      <WorkingDaysModal isOpen={isModalOpen} onClose={handleCloseModalEdit} selectedId={selectedYear} />
    </>
  );
}

export default WorkingDaysDetailsTable;
