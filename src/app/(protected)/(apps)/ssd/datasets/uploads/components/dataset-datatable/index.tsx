"use client";
import React, { useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import CreateUploadedPage from "../create-uploaded-dataset";
import { Dataset, userSavedData } from "../../../../components/type";
import { format } from "date-fns";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { VIEW_DATE_TIME_FORMAT } from "@/ikon/utils/config/const";
import { Share, Trash2, Eye, Pencil } from "lucide-react";
import { getProfileData } from "@/ikon/utils/actions/auth";
import {
  getDatasetDeletorProcessInstances,
  invokeDatasetDeletorInstance,
  getSelectedDatasetInstanceForDatasetConfigurationStorage,
  invokeDatasetInstance,
} from "../../../../common-functions";
import { toast } from "sonner";

import ShareAccessModal from "../shareAccessModal";
import { InstanceV2Props } from "@/ikon/utils/api/processRuntimeService/type";
// const columns: DTColumnsProps<Dataset>[] = [
const columns: DTColumnsProps<Dataset>[] = [
  {
    accessorKey: "datasetName",
    header: () => <div style={{ textAlign: "center" }}>Dataset name</div>,
    cell: ({ row }) => (
      <span>{row.original?.data.metadata.datasetName || "n/a"}</span>
    ),
  },
  {
    accessorKey: "datasetDescription",
    header: () => <div style={{ textAlign: "center" }}>Description</div>,
    cell: ({ row }) => (
      <span>{row.original?.data.metadata.datasetDescription || "n/a"}</span>
    ),
  },
  {
    accessorKey: "datasetSource",
    header: () => <div style={{ textAlign: "center" }}>Source</div>,
    cell: ({ row }) => <span>{row.original?.data.source || "n/a"}</span>,
  },
  {
    accessorKey: "popularity",
    header: "Popularity",
    cell: ({ row }) => <span>{row.original?.data.popularity}</span>,
  },
  {
    accessorKey: "updatedOn",
    header: "Updated On",
    cell: ({ row }) => {
      const formattedDate =
        (row?.original?.data.createdOn &&
          format(row.original.data.createdOn, VIEW_DATE_TIME_FORMAT)) ||
        "n/a";
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "createdByName",
    header: "Updated By",
    cell: ({ row }) => {
      const formattedDate = row?.original?.data.createdByName || "n/a";
      return <span>{formattedDate}</span>;
    },
  },
];

export default function DatasetDatatable({
  datasets,
  reRenderDatasetTable,
}: {
  datasets: Dataset[];
  reRenderDatasetTable: () => void;
}) {
  const { openDialog } = useDialog();

  const [selectedDatasetForEditing, setselectedDatasetForEditing] =
    useState("");
  const [selectedDatasetDetails, setSelectedDatasetDetails] = useState({
    datasetName: "",
    datasetId: "",
  });
  const [isShareDatasetModalOpen, setIsShareDatasetModalOpen] = useState(false);

  const handleEditDataset = (datasetId: string) => {
    console.log("datasetId from edit");
    setselectedDatasetForEditing(datasetId);
  };
  const onConfirmDelete = async (datasetId: string) => {
    try {
      const datasetDeletorInstance = await getDatasetDeletorProcessInstances();
      if (datasetDeletorInstance.length) {
        const profileData = await getProfileData();
        let data = {
          datasetId: datasetId,
          sender: profileData.USER_ID,
        };
        console.log("--------------data---------------");
        console.log(data);

        const res = await invokeDatasetDeletorInstance(
          datasetDeletorInstance[0].taskId,
          data
        );
        if (res.success) {
          openDialog({
            title: "Success",
            description: "Dataset has been deleted successfully !",
            confirmText: "OK",
            onConfirm: () => {
              reRenderDatasetTable();
            },
          });
        } else {
          openDialog({
            title: "Error",
            description: "Some error occured please refresh and try again",
            confirmText: "OK",
          });
        }
      }
      // const profileData = await getProfileData();
    } catch (error) {
      console.error("Error fetching data dataset deletor instances:", error);
    }
  };
  const handleDeleteSelectedDataset = (
    datasetId: string,
    datasetName: string,
    popularity: number
  ) => {
    openDialog({
      title: "Warning",
      description:
        datasetName +
        " is being used in " +
        popularity +
        " reports / dashboards. Would you like to delete it?",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: () => {
        onConfirmDelete(datasetId);
      },
    });
  };

  const handleDatasetShareClick = (datasetId: string, datasetName: string) => {
    setSelectedDatasetDetails({
      datasetId: datasetId,
      datasetName: datasetName,
    });
    setIsShareDatasetModalOpen(true);
  };

  const handleShareAccessSubmit = async (
    viewArray?: string[],
    editArray?: string[]
  ) => {
    console.log(viewArray);
    let datasetDetails: InstanceV2Props<Dataset>[] =
      await getSelectedDatasetInstanceForDatasetConfigurationStorage(
        selectedDatasetDetails.datasetId,
        "Update Assignment Activity"
      );
    let datasetInstance: userSavedData = datasetDetails[0]
      .data as unknown as userSavedData;
    datasetInstance["access"]["write"]["users"] = editArray ?? [];
    datasetInstance["access"]["read"]["users"] = viewArray ?? [];
    let res = await invokeDatasetInstance(
      datasetDetails[0]["taskId"],
      datasetInstance,
      "Update Assignment"
    );
    if (res.success) {
      toast.success(
        `Access updated successfully for '${selectedDatasetDetails.datasetName}'`
      );
    } else {
      toast.error(
        `Failed to update access for '${selectedDatasetDetails.datasetName}'. Please refresh and try again.`
      );
    }
  };

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    actionMenu: {
      items: [
        {
          label: "Preview",
          // onclick: `showDatasetWisePreviewInDataTableV2`,
          icon: Eye,
        },
        {
          label: "Edit",
          onClick: (dataset: Dataset) =>
            handleEditDataset(dataset.data.datasetId),
          icon: Pencil,
        },
        {
          label: "Delete",
          icon: Trash2,
          onClick: (dataset: Dataset) =>
            handleDeleteSelectedDataset(
              dataset.data.datasetId,
              dataset.data.metadata.datasetName,
              dataset.data.popularity ?? 0
            ),
        },
        {
          label: "Share",
          icon: Share,
          onClick: (dataset: Dataset) =>
            handleDatasetShareClick(
              dataset.data.datasetId,
              dataset.data.metadata.datasetName
            ),
        },
      ],
    },
    extraTools: [
      <CreateUploadedPage
        datasets={datasets}
        selectedDatasetForEditing={selectedDatasetForEditing}
        setselectedDatasetForEditing={setselectedDatasetForEditing}
        reRenderDatasetTable={reRenderDatasetTable}
      />,
    ],
  };
  return (
    <>
      <ShareAccessModal
        isOpen={isShareDatasetModalOpen}
        onClose={() => setIsShareDatasetModalOpen(false)}
        onSubmit={(viewArray, editArray) =>
          handleShareAccessSubmit(viewArray, editArray)
        }
        componentType={selectedDatasetDetails.datasetName}
        editGroupName={`DatasetAdmin_${selectedDatasetDetails.datasetId}`}
        viewGroupName={`DatasetView_${selectedDatasetDetails.datasetId}`}
      />
      <DataTable columns={columns} data={datasets} extraParams={extraParams} />
    </>
  );
}
