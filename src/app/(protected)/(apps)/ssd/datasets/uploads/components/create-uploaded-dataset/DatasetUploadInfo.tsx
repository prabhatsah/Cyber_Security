import React, { useRef } from "react";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { TextButton } from "@/ikon/components/buttons";
import { UploadFileComponentV2 } from "../upload-file-form";
import { FileDetails } from "../../../../components/type";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";

export default function DatasetUploadInfo({
  selectedFileType,
  uploadedFiles,
  availableSpaceForAccount,
  availableSpaceForUser,
  parseFileToGetPreviewData,
}: {
  selectedFileType: string;
  uploadedFiles: FileDetails[];
  availableSpaceForUser: number;
  availableSpaceForAccount: number;
  parseFileToGetPreviewData: (
    sheetId: number,
    rowColDetails: {},
    file: FileDetails[],
    resource: {}
  ) => void;
}) {
  // const uploadComponentRef = useRef<{ startUploads: () => void }>(null);
  const uploadComponentRef = useRef<{
    startUploads: () => void;
    resetUploadedFiles: () => void;
  } | null>(null); // Ref for UploadFileComponentV2
  const fileType =
    selectedFileType === "Excel"
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : ".csv";
  // const { openDialog } = useDialog();
  const handleFileChange = (files: FileDetails[]) => {
    const elements = [
      "rowFromCount",
      "colFromCount",
      "rowToCount",
      "colToCount",
    ];

    if (files.length) {
      let fileSizeinGB =
        parseFloat((files[0].file.size / (1024 * 1024)).toFixed(2)) / 1024;
      if (
        fileSizeinGB >= availableSpaceForUser ||
        fileSizeinGB >= availableSpaceForAccount
      ) {
        handleFileSizeExceeding();
        uploadComponentRef.current?.resetUploadedFiles();
        // add alert
      }
      elements.forEach((id) =>
        document.getElementById(id)?.removeAttribute("disabled")
      );
    } else {
      elements.forEach((id) => {
        const element = document.getElementById(id);
        element?.setAttribute("disabled", "true");
        if (element instanceof HTMLInputElement) {
          element.value = "1";
        }
      });
    }
  };
  const handleInputValidation = (
    e: React.ChangeEvent<HTMLInputElement>,
    minValue: number
  ) => {
    const value = parseInt(e.target.value, 10);
    if (value < minValue) {
      e.target.value = minValue.toString();
    }
  };

  const handleRowEndValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rowFromCount = parseInt(
      (document.getElementById("rowFromCount") as HTMLInputElement)?.value ||
        "0",
      10
    );
    const value = parseInt(e.target.value, 10);
    if (value < rowFromCount) {
      e.target.value = rowFromCount.toString();
    }
  };

  const handleFileSizeExceeding = () => {
    //   const handleShowDialog = () => {
    //     openDialog({
    //         title: "Delete Confirmation",
    //         description: "Are you sure you want to delete this item?",
    //         confirmText: "Delete",
    //         cancelText: "Cancel", // Optional third button
    //         onConfirm: () => {
    //             console.log("Confirmed!");
    //         },
    //         onCancel: () => {
    //             console.log("Canceled!");
    //         },
    //         onThird: () => {
    //             console.log("Third option clicked!");
    //         },
    //     });
    // };
  };
  const triggerUpload = () => {
    if (uploadComponentRef.current) {
      uploadComponentRef.current.startUploads();
    }
  };

  const handleFileUpload = (file: FileDetails[], resource: {}) => {
    const rowColDetails = {
      row: {
        start:
          (document.getElementById("rowFromCount") as HTMLInputElement)
            ?.value || 1,
        end:
          (document.getElementById("rowToCount") as HTMLInputElement)?.value ||
          "all",
      },
      col: {
        start:
          (document.getElementById("colFromCount") as HTMLInputElement)
            ?.value || 1,
        end:
          (document.getElementById("colToCount") as HTMLInputElement)?.value ||
          "all",
      },
    };
    console.log(resource);
    parseFileToGetPreviewData(0, rowColDetails, file, resource);
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto h-[85vh] relative flex flex-col gap-4">
      <div className="flex flex-col">
        <UploadFileComponentV2
          ref={uploadComponentRef}
          acceptedFileType={fileType} // Passing the accepted file type
          isDownloadable={false} // Allow files to be downloadable
          multipleFileUploads={false}
          onFileChange={handleFileChange}
          onUploadFiles={handleFileUpload}
          files={uploadedFiles}
        />
      </div>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-2 flex flex-col gap-3">
          <div className="text-sm">&nbsp;</div>
          <Label className="h-full">Rows</Label>
          <Label className="h-full">Columns</Label>
        </div>
        <div className="col-span-5 flex flex-col gap-3">
          <Label htmlFor="rowFromCount">Start Index</Label>
          <Input
            id="rowFromCount"
            type="number"
            min={1}
            defaultValue={1}
            disabled
            onChange={(e) => handleInputValidation(e, 1)}
          />
          <Input
            id="colFromCount"
            type="number"
            min={1}
            defaultValue={1}
            disabled
            onChange={(e) => handleInputValidation(e, 1)}
          />
        </div>
        <div className="col-span-5 flex flex-col gap-3">
          <Label htmlFor="rowToCount" className="">
            End Index
          </Label>
          <Input
            id="rowToCount"
            type="number"
            disabled
            onChange={handleRowEndValidation}
          />
          <Input
            id="colToCount"
            type="number"
            disabled
            onChange={handleRowEndValidation}
          />
        </div>
        <div className="col-span-12">
          <div className="p-4 bg-blue-100 rounded-lg text-sm text-blue-700">
            <strong>Note:</strong> Leave the End Index field blank to read until
            the last index.
          </div>
        </div>
      </div>
      <TextButton
        onClick={triggerUpload}
        variant="outline"
        type="button"
        className="absolute right-0 bottom-0"
      >
        Proceed
      </TextButton>
    </div>
  );
}
