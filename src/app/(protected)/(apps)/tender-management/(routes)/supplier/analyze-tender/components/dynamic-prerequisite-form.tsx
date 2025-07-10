"use client"
import { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus, Trash2 } from "lucide-react";
import { DOWNLOAD_URL } from "@/ikon/utils/config/urls";
import { getTicket } from "@/ikon/utils/actions/auth";

// Define types for our row data
interface FormRow {
  id: string;
  text: string;
  fileName?: string | null;
  fileUrl?: string | null;
  fileType?: string | null;
  Size?: number | null;
}

export default function DynamicForm({
  tenderId,
  rows,
  setRows,
  fileObjects,
  setFileObjects,
  dataLoaded,
}: {
  tenderId: string;
  rows: FormRow[];
  setRows: React.Dispatch<React.SetStateAction<FormRow[]>>;
  fileObjects: { [key: string]: File };
  setFileObjects: React.Dispatch<React.SetStateAction<{ [key: string]: File }>>;
  dataLoaded: boolean;
}) {
  // Add a new row
  const addRow = () => {
    const newRowId = Date.now().toString();
    setRows((prevRows) => [...prevRows, { id: newRowId, text: "" }]);
  };

  // Handle text input changes
  const handleTextChange = (id: string, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, text: value } : row))
    );
  };

  // Handle file input changes
  const handleFileChange = (id: string, files: FileList | null) => {
    if (files?.[0]) {
      setFileObjects((prev) => ({
        ...prev,
        [id]: files[0],
      }));

      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, fileName: files[0].name } : row
        )
      );
    }
  };

  // Remove a row
  const removeRow = (id: string) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));

    setFileObjects((prevObjects) => {
      const updated = { ...prevObjects };
      delete updated[id];
      return updated;
    });
  };

  const viewFile = async (data: any) => {
    console.log("View File", data);
    const ticket: any = await getTicket();
  
    /* const url =
             `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
             `&resourceId=${encodeURIComponent(data.resourceId)}` +
             `&resourceName=${encodeURIComponent(data.resourceName)}` +
             `&resourceType=${encodeURIComponent(data.resourceType)}`;*/
  
    //window.open(encodeURI(url), "_blank");
    let link = "";
    if (
      data.fileType == "image/jpeg" ||
      data.fileType == "image/png" ||
      data.fileType == "text/plain" ||
      data.fileType == "application/pdf" ||
      data.fileType == "video/mp4" ||
      data.fileType == "image/gif"
    ) {
      var pdf_newTab = window.open();
      link =
        `${DOWNLOAD_URL}?ticket=${ticket}` +
        `&resourceId=${data.fileId}` +
        `&resourceType=${data.fileType}`;
      pdf_newTab.document.write(
        `<iframe id='viewdocId' width='100%' height='100%' src=''></iframe><script>var iframe = document.getElementById('viewdocId'); iframe.src = '${link}'</script>`
      );
    } else {
      link =
        `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
        `&resourceId=${encodeURIComponent(data.fileId)}` +
        `&resourceName=${encodeURIComponent(data.fileName)}` +
        `&resourceType=${encodeURIComponent(data.fileType)}`;
      window.open(encodeURI(link), "_blank");
    }
  };
  return (
    <div className="p-4 w-full border rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Prerequisites</h2>

        {dataLoaded && (
          <IconButtonWithTooltip
            tooltipContent="Add Field"
            onClick={addRow}
            variant="default"
          >
            <Plus />
          </IconButtonWithTooltip>
        )}
      </div>

      {!dataLoaded ? (
        <div className="flex justify-center items-center h-32">
          <span className="text-muted-foreground">Loading data...</span>
        </div>
      ) : (
        <div className="space-y-4 h-[49dvh] overflow-y-auto">
          {rows.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No file uploaded
            </div>
          ) : (
            rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-2 gap-4 items-center border-b py-2"
              >
                <Input
                  type="text"
                  value={row.text || ""}
                  onChange={(e) => handleTextChange(row.id, e.target.value)}
                  placeholder="Enter text"
                />

                <div className="flex-1 flex items-start gap-2">
                  <Input
                    type="file"
                    id={`file-${row.id}`}
                    onChange={(e) => handleFileChange(row.id, e.target.files)}
                  />
                  {row.fileName && (
                    <span
                      className="text-sm text-gray-700 truncate max-w-[200px] hover:underline hover:text-blue-600 cursor-pointer transition-colors duration-200"
                      onClick={() => viewFile(row)}
                    >
                      {row.fileName}
                    </span>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => removeRow(row.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}