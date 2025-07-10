
import { useState, useEffect } from "react";
import { UploadIcon, X, FileWarning, Send } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Progress } from "@/shadcn/ui/progress";
import { useForm } from "react-hook-form";
import axios from 'axios'

import { Form } from "@/shadcn/ui/form";
import NoDataComponent from "./no-data";
import { toast } from "sonner";
import { on } from "events";
import { customUploadFiles } from '../../../../actions'
import { redirect } from 'next/navigation';

interface Entry {
    text: string;
    fileNames: string[];
}

interface FileDetails {
    name: string;
    url: string;
    progress: number;
    file: File
}

interface UploadFileComponentProps {
    onClose: () => void;
    folderIdentifier: any;
}

export const UploadFileComponent: React.FC<UploadFileComponentProps> = ({ onClose, folderIdentifier }) => {
    const form = useForm<Entry>({
        defaultValues: {
            text: "",
            fileNames: [],
        },
    });

    const [inputValue, setInputValue] = useState("");
    const [texts, setTexts] = useState<Entry[]>([]);
    const [fileNames, setFileNames] = useState<FileDetails[]>([]); // Updated type
    const [formattedDate, setFormattedDate] = useState("");
    const [noFilesUploaded, setNoFilesUploaded] = useState(true);

    const isUploading = fileNames.some((file) => file.progress < 100);

    useEffect(() => {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, "0");
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const year = currentDate.getFullYear();

        setFormattedDate(`${day}-${month}-${year}`);
    }, []);

    useEffect(() => {
        fileNames.forEach((file, idx) => {
            if (file.progress === 0) {
                simulateFileUpload(idx, file);
            }
        });
    }, [fileNames]);

    const handleAddText = () => {
        if (inputValue.trim() || fileNames.length > 0) {
            const newEntry: Entry = {
                text: inputValue.trim(),
                fileNames: fileNames.map((file) => file.name),
            };
            setTexts([newEntry, ...texts]);
            setInputValue("");
            setFileNames([]);
            setNoFilesUploaded(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const uploadedFiles = Array.from(e.target.files).map((file) => ({
                name: file.name,
                url: "",
                progress: 0,
                file
            }));
            setFileNames((prev) => [...prev, ...uploadedFiles]); // Type now matches correctly
            setNoFilesUploaded(false);
        }
    };
    const uploadFile = async () => {
        let folder_identifier = folderIdentifier?.folder_identifier;
        let file: File = fileNames[0].file;
        var extraObj = {
            "resource_identifier": "",
            "storeSelFiles": file
        }
        await customUploadFiles(folder_identifier, extraObj);
        toast.success("File uploaded successfully");
        onClose();
        const currentUrl = window.location.href;
        redirect(currentUrl);
    }
    const removeFile = (index: number) => {
        const updatedFiles = fileNames.filter((_, idx) => idx !== index);
        setFileNames(updatedFiles);
        if (updatedFiles.length === 0 && texts.length === 0) {
            setNoFilesUploaded(true);
        }
    };


    const simulateFileUpload = async (idx: number, file: FileDetails) => {
        const formData = new FormData();
        formData.append('file', file.file);
        // console.dir(file.file);
        try {
            const response = await axios.post('https://your-actual-upload-endpoint-url.com/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    setFileNames((prev) =>
                        prev.map((f, i) => (i === idx ? { ...f, progress } : f))
                    );
                },
            });

            setFileNames((prev) =>
                prev.map((f, i) => (i === idx ? { ...f, url: response.data.url, progress: 100 } : f))
            );
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <>
            {/* Container for the text list */}
            <div className="flex flex-col h-full w-full gap-3">
                <div className="flex-grow overflow-auto flex flex-col-reverse gap-2">
                    {noFilesUploaded && (
                        <NoDataComponent text="No files uploaded" />
                    )}
                    {fileNames.length > 0 && (
                        <div className="p-2 my-1 rounded-md border">
                            <p className="font-bold">Selected Files:</p>
                            {fileNames.map((file, idx) => (
                                <div key={idx} className="flex flex-col mb-2">
                                    <div className="flex items-center justify-between">
                                        <a
                                            href={file.url}
                                            download={file.name}
                                            className="text-sm text-blue-600 underline cursor-pointer"
                                        >
                                            {file.name}
                                        </a>
                                        <button
                                            onClick={() => removeFile(idx)}
                                            className="text-red-500 hover:text-red-800"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <Progress value={file.progress} />
                                    <p className="text-xs text-gray-500">
                                        {file.progress}% uploaded
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    {texts.map((entry, index) => (
                        <div key={index} className="border-b text-sm pb-2">
                            {entry.fileNames.map((fileName, idx) => (
                                <p key={idx}>
                                    <a
                                        href={fileNames.find((file) => file.name === fileName)?.url || "#"}
                                        download={fileName}
                                        className="text-sm text-blue-500 underline cursor-pointer"
                                    >
                                        {fileName}
                                    </a>
                                </p>
                            ))}
                            <p>{entry.text || "(No Text)"}</p>
                            <div className="flex justify-between">
                                <p>John Doe</p>
                                <p>{formattedDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Form {...form}>
                    <form id="fileUploadForm" onSubmit={form.handleSubmit(() => handleAddText())}>
                        <div className="flex flex-col">
                            <div className="flex items-center justify-end gap-2">
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="file-upload" className="sr-only">
                                        Upload Files
                                    </Label>
                                    <Button variant="outline" asChild>
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <UploadIcon className="w-5 h-5" />
                                        </label>
                                    </Button>
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        multiple
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        form="createFolderForm"
                                        type="submit"
                                        // className="bg-blue-500 text-white w-full sm:w-auto"
                                        className="w-full sm:w-auto"
                                        onClick={uploadFile}
                                    >
                                        Upload
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    );
}

