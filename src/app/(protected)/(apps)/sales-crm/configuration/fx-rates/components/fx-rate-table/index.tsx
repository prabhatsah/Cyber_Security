"use client";
import { useState, useEffect } from "react";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { ColumnDef } from "@tanstack/react-table";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";
import { SquarePenIcon } from "lucide-react";
import EditFXModal from "../fx-rate-form/edit-fx-rate-modal";
import CreateFXRateButtonWithModal from "../fx-rate-form/create-fx-rate";

interface fxRateTableProps {
  year: string;
  fxRate: number;
  currency: string;
}

interface FxRateData {
  id: number;
  currency: string;
  fxRate: number;
  activeStatus: boolean;
  year: string;
}

export default function FXRatesTable() {
  const [fxRateData, setFxRateData] = useState<fxRateTableProps[]>([]);
  const [fxRateDataEdit, setFxRateDataEdit] = useState<FxRateData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fxRates, setFxRates] = useState<Record<string, Record<string, any>>>();

  const fetchfxRateTableData = async () => {
    try {
      const fxRateInstances = await getMyInstancesV2({
        processName: "Fx Rate",
        predefinedFilters: { taskName: "View State" },
      });
      setFxRates(fxRateInstances[0]?.data?.fxRates);
      const fxRateInstancesData = Object.values(
        fxRateInstances[0]?.data?.fxRates || {}
      );

      const finalDataArray: fxRateTableProps[] = fxRateInstancesData.flatMap(
        (rate) => Object.values(rate)
      );

      console.log("Final array ....", finalDataArray);

      setFxRateData(finalDataArray);
    } catch (error) {
      console.error("Error fetching FX rates:", error);
    }
  };

  useEffect(() => {
    fetchfxRateTableData();
  }, []);

  const handleOpenModalEdit = (id: string) => {
    setIsModalOpen(true);
  };

  const handleCloseModalEdit = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const extraParams: DTExtraParamsProps = {
    defaultGroups: ["year"],
    grouping: true,
    numberOfRows: true,
    pageSize: 150,
    extraTools: [<CreateFXRateButtonWithModal />],
    actionMenu: {
      items: [
        {
          label: "Edit",
          icon: SquarePenIcon,
          onClick: (row: any) => {
            console.log("Edit clicked", row);
            handleOpenModalEdit(row.id);
            setFxRateDataEdit(row);
          },
        },
      ],
    },
  };

  const columns: ColumnDef<fxRateTableProps>[] = [
    {
      accessorKey: "year",
      header: () => <div style={{ textAlign: "center" }}>Year</div>,
      cell: ({ row }) => <span>{row.original?.year || "n/a"}</span>,
    },
    {
      accessorKey: "currency",
      header: () => <div style={{ textAlign: "center" }}>Currency</div>,
      cell: ({ row }) => <span>{row.original?.currency || "n/a"}</span>,
    },
    {
      accessorKey: "fxRate",
      header: () => <div style={{ textAlign: "center" }}>FX Rate</div>,
      cell: ({ row }) => {
        const fxRate = row.original?.fxRate;

        const formattedFxRate =
          fxRate && !isNaN(Number(fxRate)) ? Number(fxRate).toFixed(3) : "n/a";

        return <span>{formattedFxRate}</span>;
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={fxRateData}
        extraParams={extraParams}
      />

      {
        <EditFXModal
          isOpen={isModalOpen}
          onClose={handleCloseModalEdit}
          selectedFX={fxRateDataEdit}
        />
      }
    </>
  );
}
