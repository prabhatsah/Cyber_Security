"use client";

import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { FileText, Loader2Icon, Upload } from "lucide-react";
import React, { useCallback, useState } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DynamicFieldConfigFormDataWithId, DynamicFieldFrameworkContext } from "../context/dynamicFieldFrameworkContext";

export default function UploadTab({ uploadDialogOpen, setUploadDialogOpen, fields, setParentEntries }: {
    uploadDialogOpen: boolean;
    setUploadDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fields: DynamicFieldConfigFormDataWithId[];
    setParentEntries: React.Dispatch<React.SetStateAction<{ value: string, label: string }[]>>;
}) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        frameworkFieldConfigData,
        setFrameworkStructureData,
        identifier
    } = DynamicFieldFrameworkContext();

    const resetForm = useCallback(() => {
        setFile(null);
    }, []);

    const replaceFieldNamessWithIds = (uploadStructureData: Record<string, string | boolean | null>[]) => {
        const idToNameMap = Object.fromEntries(frameworkFieldConfigData.map(f => [f.name, f.id]));

        return uploadStructureData.map(row => {
            const newRow: Record<string, string | boolean | null> = {};

            for (const key in row) {
                if (idToNameMap[key]) {
                    newRow[idToNameMap[key]] = row[key];
                } else {
                    newRow[key] = row[key];
                }
            }

            return newRow;
        });
    }

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
                const indexToIdMap: Record<string, string> = {};
                let excelDataFormat: Record<string, string | boolean | null>[] = [];
                for (let i = 0; i < jsonData.length; i++) {
                    const typedRow = jsonData[i] as { [key: string]: any };
                    const generatedId = crypto.randomUUID();

                    // Map original index to new UUID
                    indexToIdMap[typedRow["index"]] = generatedId;

                    excelDataFormat.push({
                        ...typedRow,
                        parentId: typedRow["parentId"] === 'null' ? null : typedRow["parentId"],
                        treatAsParent: typedRow["treatAsParent"].toLowerCase() === 'true',
                        // id: typedRow["index"]
                        id: generatedId
                    })
                }

                for (let i = 0; i < excelDataFormat.length; i++) {
                    const entry = excelDataFormat[i];

                    if (entry.parentId) {
                        // Replace index with actual UUID
                        entry.parentId = indexToIdMap[entry.parentId];
                    }
                }

                console.log(excelDataFormat);

                const identifierFieldConfig = frameworkFieldConfigData.find(
                    (data) => data.id === identifier.index
                );

                const identifierFieldName = identifierFieldConfig?.name;

                const parentOptions = excelDataFormat
                    .filter((data) => data.treatAsParent)
                    .map((data) => ({
                        value: data.id,
                        label: identifierFieldName ? data[identifierFieldName] : "",
                    }));

                console.log(parentOptions)

                setParentEntries(parentOptions);

                const dynamicStructureData = replaceFieldNamessWithIds(excelDataFormat);
                console.log(dynamicStructureData);
                setFrameworkStructureData(dynamicStructureData);
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