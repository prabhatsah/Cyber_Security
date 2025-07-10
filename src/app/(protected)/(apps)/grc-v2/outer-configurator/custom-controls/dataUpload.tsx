"use client";

import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { FileText, Loader2Icon, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";
import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export default function UploadControl({ uploadDialogOpen, setUploadDialogOpen, profileData }: { uploadDialogOpen: boolean; setUploadDialogOpen: React.Dispatch<React.SetStateAction<boolean>>; profileData: string; }) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const resetForm = useCallback(() => {
        setFile(null);
    }, []);

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file first.");
            return;
        }

        setIsLoading(true);
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array", cellDates: false });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // This gives you the data as an array of objects
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
                console.log("Parsed Excel Data:", jsonData);

                const customControlProcessId = await mapProcessName({ processName: "Custom Controls" });
                for (let i = 1000; i < 2000; i++) {
                    const typedRow = jsonData[i] as { [key: string]: any };    
                    const evidenceValue = (typedRow["Evidence status"] || '').toString().trim().toLowerCase();

                    const processData = {
                        "customControlId": v4(),
                        "refId": typedRow.ID,
                        // "title": String(typedRow['Name'] || ''),
                        "title": typedRow['Name'],
                        "description": typedRow.Description,
                        "domain": typedRow.Domain,
                        "evidenceRequired": evidenceValue === 'needs evidence' ? 'Yes' : 'No',
                        "owner": [],
                        "Frameworks": [],
                        "createdBy": profileData,
                        "createdOn": new Date().toISOString(),
                    }
                    console.log("Process Data for Row:", processData);

                    // Start the process for each row
                    await startProcessV2({
                        processId: customControlProcessId,
                        data: processData,
                        processIdentifierFields: "customControlId",
                    });
                }
                toast.success("File processed successfully!");

                router.refresh();
                setUploadDialogOpen(false);
            } catch (error: any) {
                toast.error(`Failed to parse file: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            toast.error("An error occurred while reading the file.");
            setIsLoading(false);
        };

        reader.readAsArrayBuffer(file);
    };

    // Callback for the dropzone component
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                setFile(acceptedFiles[0]);
                toast.info(`File selected: ${acceptedFiles[0].name}`);
            }
        },
        []
    );

    // Configuration for react-dropzone
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
                ".xlsx",
            ],
            "application/vnd.ms-excel": [".xls"],
            "text/csv": [".csv"],
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: false,
        onDrop,
        onDropRejected: (rejectedFiles) => {
            const error = rejectedFiles[0].errors[0];
            if (error.code === "file-too-large") {
                toast.error("File is larger than 5MB.");
            } else {
                toast.error("Invalid file type. Please upload a .xlsx or .xls file.");
            }
        },
    });

    const handleOpenChange = (isOpen: boolean) => {
        setUploadDialogOpen(isOpen);
        if (!isOpen) {
            resetForm();
        }
    };

    return (
        <Dialog open={uploadDialogOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import from Excel</DialogTitle>
                </DialogHeader>

                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50"
                >
                    <input {...getInputProps()} />
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                        Drag & drop or click to select a file
                    </p>
                    <p className="text-xs text-muted-foreground">
                        (.xlsx or .xls, Max 5MB)
                    </p>
                </div>

                {/* Selected File Info */}
                {file && (
                    <div className="text-sm">
                        <h4 className="font-medium mb-2 text-muted-foreground">
                            Selected File:
                        </h4>
                        <div className="flex items-center p-2 rounded-md bg-muted">
                            <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span className="truncate font-mono text-xs">{file.name}</span>
                        </div>
                    </div>
                )}

                {/* Upload Button */}
                <Button
                    type="button"
                    className="w-full"
                    disabled={!file || isLoading}
                    onClick={handleUpload}
                >
                    {isLoading ? (
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isLoading ? "Processing..." : "Upload and Process"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}