import React, { useState, useEffect } from "react";
import DatasetTypeSelectModal from "./DatasetTypeSelectModal";
import CreateNewDatasetModalForm from "./CreateNewDatasetModalForm";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus } from "lucide-react";
import { Dataset } from "../../../../components/type";

export default function CreateUploadedPage({
  datasets,
  selectedDatasetForEditing,
  setselectedDatasetForEditing,
  reRenderDatasetTable,
}: {
  datasets: Dataset[];
  selectedDatasetForEditing: string;
  setselectedDatasetForEditing: (dataset: string) => void;
  reRenderDatasetTable?: () => void;
}) {
  const [isDatasetTypeModalOpen, setIsDatasetTypeModalOpen] = useState(false);
  const [isCreateDatasetModalOpen, setIsCreateDatasetModalOpen] =
    useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDatasetForEditing != "") {
      setIsDatasetTypeModalOpen(true);
      // setselectedDatasetForEditing("");
    }
  }, [selectedDatasetForEditing]);

  const handleDatasetType = (type: string) => {
    console.log("Selected Dataset Type:", type);
    setSelectedType(type);
    setIsDatasetTypeModalOpen(false);
    setIsCreateDatasetModalOpen(true);
  };

  const handleCreateNewDatasetModalFormClose = () => {
    setselectedDatasetForEditing("");
    setIsCreateDatasetModalOpen(false);
    // if (reRenderDatasetTable) {
    //   reRenderDatasetTable();
    // }
  };

  return (
    <div>
      <IconTextButtonWithTooltip
        tooltipContent="Create new Dataset"
        onClick={() => setIsDatasetTypeModalOpen(true)}
      >
        <Plus />
      </IconTextButtonWithTooltip>

      <DatasetTypeSelectModal
        isOpen={isDatasetTypeModalOpen}
        onClose={() => setIsDatasetTypeModalOpen(false)}
        onDatasetSelect={handleDatasetType}
      />

      {selectedType && (
        <CreateNewDatasetModalForm
          isOpen={isCreateDatasetModalOpen}
          onClose={handleCreateNewDatasetModalFormClose}
          datasetType={selectedType}
          existingDataset={datasets}
          selectedDatasetForEditing={selectedDatasetForEditing}
          reRenderDatasetTable={reRenderDatasetTable}
        />
      )}
    </div>
  );
}
