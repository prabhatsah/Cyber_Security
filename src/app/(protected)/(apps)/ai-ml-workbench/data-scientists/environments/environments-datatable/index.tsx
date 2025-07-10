"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { Edit, Trash, Info } from "lucide-react";
import CreateEnvironmentModal from "../create-environment";
import UpdateStatusModal from "../update-status";
import {
  invokeDeleteEnv,
  invokeEnvStatus,
  invokeLibraryAddition,
} from "../invoke-environment";
import { useRouter } from "next/navigation";
import { UpdateLibraryModal } from "../update-library";
import { toast } from "sonner";

export const VIEW_DATE_TIME_FORMAT = {
  date: "yyyy-MM-dd",
  time: "HH:mm:ss",
} as const;

const columns: DTColumnsProps<any, unknown>[] = [
  {
    header: "Status",
    accessorKey: "envStatus",
    enableSorting: false,
    cell: (row) => {
      const status = row.getValue<string>();
      return (
        <span
          className={`px-2 border rounded-full border-${
            status === "Offline" ? "danger" : "success"
          }`}
        >
          {status || "N/A"}
        </span>
      );
    },
  },
  {
    header: "Environment",
    accessorKey: "envName",
    enableSorting: false,
    cell: (row) => <span>{row.getValue<string>() || "N/A"}</span>,
  },
  {
    header: "Environment Id",
    accessorKey: "envId",
    enableSorting: false,
    cell: (row) => <span>{row.getValue<string>() || "N/A"}</span>,
  },
  {
    header: "Workspace",
    accessorKey: "workspaceName",
    enableSorting: false,
    cell: (row) => <span>{row.getValue<string>() || "N/A"}</span>,
  },
  {
    header: "Language",
    accessorKey: "language",
    enableSorting: false,
    cell: (row) => <span>{row.getValue<string>().toUpperCase() || "N/A"}</span>,
  },
  {
    header: "Creation Date",
    accessorKey: "createdOn",
    enableSorting: false,
    cell: (row) => {
      const rawDate = row.getValue<string>();
      try {
        return (
          <span>{format(new Date(rawDate), VIEW_DATE_TIME_FORMAT.date)}</span>
        );
      } catch (e) {
        return <span>N/A</span>;
      }
    },
  },
  {
    header: "Creation Time",
    accessorKey: "creationTime",
    enableSorting: false,
    cell: (row) => {
      const rawDate = row.getValue<string>();
      try {
        return (
          <span>{format(new Date(rawDate), VIEW_DATE_TIME_FORMAT.time)}</span>
        );
      } catch (e) {
        return <span>N/A</span>;
      }
    },
  },

  {
    header: "Library Count",
    accessorKey: "libraryCount",
    enableSorting: false,
    cell: (row) => <span>{row.getValue<number>() || 0}</span>,
  },
];

function EnvironmentDataTable({
  environmentData,
}: {
  environmentData?: any[];
}) {
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [selectedRowForLibrary, setSelectedRowForLibrary] = useState<
    any | null
  >(null);
  const router = useRouter();

  const updateStatus = (rowData: any) => {
    console.log("rowData---------------------", rowData);
    setSelectedRow(rowData);
  };

  const handleConfirm = async (newStatus: string, envId: string) => {
    await invokeEnvStatus(newStatus, envId);
    setSelectedRow(null);
    router.refresh();
  };

  const deleteEnv = async (rowData: any) => {
    console.log("selectedRowrowData---------------------", rowData);
    await invokeDeleteEnv(rowData.envId);
    router.refresh();
  };
  const updateLibrary = async (rowData: any) => {
    setSelectedRowForLibrary(rowData);
  };
  const noActionUpdate = async (rowData: any) => {
    toast.info("Environment is not active!");
  };
  const actionMenu = {
    items: [
      {
        label: "Update Status",
        icon: Edit,
        onClick: (rowData: any) => updateStatus(rowData),
      },
      {
        label: "Delete",
        icon: Trash,
        onClick: (rowData: any) => deleteEnv(rowData),
      },
      {
        label: "Update Library",
        icon: Edit,
        onClick: (rowData: any) => updateLibrary(rowData),
      },
      {
        label: "No Action",
        icon: Info,
        onClick: (rowData: any) => noActionUpdate(rowData),
      },
    ],
  };

  const extraParams: DTExtraParamsProps = {
    grouping: true,
    extraTools: [<CreateEnvironmentModal key="create-environment" />],
    actionMenu: actionMenu,
  };
  const handleConfirmForLibrayModification = async (
    dataOfLibrarySelection: string | any,
    envId?: string
  ) => {
    console.log("Updating library with data:", dataOfLibrarySelection);
    console.log("envId:", envId);
    await invokeLibraryAddition(dataOfLibrarySelection, envId);
    setSelectedRow(null);
    router.refresh();
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={environmentData || []}
        extraParams={extraParams}
      />

      {/* Status Update Modal */}
      {selectedRow && (
        <UpdateStatusModal
          isOpen={!!selectedRow}
          envName={selectedRow?.envName}
          onClose={() => setSelectedRow(null)}
          onConfirm={handleConfirm}
          envId={selectedRow?.envId}
        />
      )}
      {selectedRowForLibrary && (
        <UpdateLibraryModal
          isOpen={!!selectedRowForLibrary}
          envName={selectedRowForLibrary?.envName}
          onClose={() => setSelectedRowForLibrary(null)}
          onConfirm={(data) =>
            handleConfirmForLibrayModification(
              data,
              selectedRowForLibrary?.envId
            )
          }
          envId={selectedRowForLibrary?.envId}
        />
      )}
    </>
  );
}

export default EnvironmentDataTable;
