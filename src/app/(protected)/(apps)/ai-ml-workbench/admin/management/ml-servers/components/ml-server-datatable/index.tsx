"use client";

import { MLServer } from "@/app/(protected)/(apps)/ai-ml-workbench/components/type";
import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { FilePenIcon } from "lucide-react";
import CreateServerButtonWithModal from "../create-server";
import { format } from "date-fns";
import { VIEW_DATE_TIME_FORMAT } from "@/ikon/utils/config/const";
import { useState } from "react";
import ServerFormModal from "../create-server/CreateServerModalForm";

const columns: DTColumnsProps<MLServer, unknown>[] = [
  {
    header: "Status",
    accessorKey: "status",
    cell: (row) => <span>{row.row.original.status}</span>,
  },
  {
    header: "Server",
    accessorKey: "workspaceName",
    cell: (row) => <span>{row.row.original.workspaceName}</span>,
  },
  {
    header: "Probe",
    accessorKey: "probeName", // Use the correct key in your data
    cell: (row) => <span>{row.row.original.probeName}</span>,
  },
  {
    header: "Creation On",
    accessorKey: "creationOn",
    cell: (row) => (
      <span>{format(row.row.original.createdOn, VIEW_DATE_TIME_FORMAT)}</span>
    ),
  },
  {
    header: "Host Name",
    accessorKey: "hostName",
    cell: (row) => (
      <span>
        {row.row.original.hostName !== "" ? row.row.original.hostName : "n/a"}
      </span>
    ),
  },
  {
    header: "IP Address",
    accessorKey: "ipAddress",
    cell: (row) => (
      <span>
        {row.row.original.ipAddress !== "" ? row.row.original.ipAddress : "n/a"}
      </span>
    ),
  },
  {
    header: "Operating System",
    accessorKey: "probeMachineOsType",
    cell: (row) => <span>{row.row.original.probeMachineOsType}</span>,
  },
];

export default function MlServerDataTable({
  mlServerDataTableData,
}: {
  mlServerDataTableData: MLServer[];
}) {
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [selectedWorkspaceDetails, setSelectedWorkspaceDetails] =
    useState<MLServer | null>(null);

  const extraParams: DTExtraParamsProps = {
    extraTools: [<CreateServerButtonWithModal />],
    actionMenu: {
      items: [
        {
          label: "Update",
          icon: FilePenIcon,
          onClick: (rowData) => {
            console.log(rowData);
            toggleServerUpdateFormOpen(rowData.workspaceId);
          },
        },
      ],
      // extraArguments: ["workspaceId"],
    },
  };

  function toggleServerUpdateFormOpen(selectedWorkspaceId?: string): void {
    if (selectedWorkspaceId) {
      const workspaceDetails = mlServerDataTableData.filter(
        (eachServerData) => eachServerData.workspaceId === selectedWorkspaceId
      )[0];
      setSelectedWorkspaceDetails(workspaceDetails);
    } else {
      setSelectedWorkspaceDetails(null);
    }

    setIsUpdateFormOpen((prevFormState) => !prevFormState); // Toggle form visibility
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={mlServerDataTableData}
        extraParams={extraParams}
      />
      <ServerFormModal
        isOpen={isUpdateFormOpen}
        onClose={toggleServerUpdateFormOpen}
        workspaceDetails={selectedWorkspaceDetails}
      />
    </>
  );
}
