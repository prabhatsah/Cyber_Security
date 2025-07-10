import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { TextButton } from "@/ikon/components/buttons";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Progress } from "@/shadcn/ui/progress";
import { UploadIcon, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import NoDataComponent from "./no-data";
import { FileDetails } from "../../../../components/type";
import { singleFileUpload } from "@/ikon/utils/api/file-upload";

interface UploadFileComponentProps {
  onClose?: () => void; // Optional
  onFileChange?: (files: FileDetails[]) => void; // Optional
  onUploadFiles?: (files: FileDetails[], resource: {}) => void; // Optional
  acceptedFileType?: string; // Optional
  isDownloadable?: boolean; // Optional
  multipleFileUploads?: boolean; // Optional (default: true)
  files?: FileDetails[]; // Optional
}

export const UploadFileComponentV2 = forwardRef(
  (
    {
      acceptedFileType,
      isDownloadable = true,
      multipleFileUploads = true,
      files = [],
      onClose,
      onFileChange,
      onUploadFiles,
    }: UploadFileComponentProps,
    ref
  ) => {
    const [fileNames, setFileNames] = useState<FileDetails[]>(files);
    const [noFilesUploaded, setNoFilesUploaded] = useState(true);

    useImperativeHandle(ref, () => ({
      startUploads,
      resetUploadedFiles,
    }));

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      setNoFilesUploaded(fileNames.length === 0);
    }, [fileNames]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        const uploadedFiles = Array.from(e.target.files).map((file) => ({
          name: file.name,
          url: "",
          progress: 0,
          file,
        }));

        if (multipleFileUploads) {
          // If multiple files are allowed, add them to the list
          setFileNames((prev) => [...prev, ...uploadedFiles]);
        } else {
          // If multiple files are not allowed, replace the current file
          setFileNames(uploadedFiles);
        }

        onFileChange && onFileChange(uploadedFiles);
      }
    };

    const startUploads = () => {
      if (fileNames.length === 0) {
        toast.error("No files to upload.");
        return;
      }

      fileNames.forEach((file, idx) => {
        if (file.progress === 0) {
          stimulateFileUpload(idx, file);
        }
      });
    };

    const stimulateFileUpload = async (idx: number, file: FileDetails) => {
      try {
        const response = await singleFileUpload(file.file);

        setFileNames((prev) => {
          return prev.map((f, i) => (i === idx ? { ...f, progress: 100 } : f));
        });

        const updatedFiles = fileNames.map((f, i) =>
          i === idx ? { ...f, progress: 100 } : f
        );

        if (onUploadFiles) {
          onUploadFiles(updatedFiles, response);
        }

        toast.success(`File "${file.name}" uploaded successfully!`);
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error(`Failed to upload file: ${file.name}`);
      }
    };

    const removeFile = (index: number) => {
      const updatedFiles = fileNames.filter((_, idx) => idx !== index);
      setFileNames(updatedFiles);
      onFileChange && onFileChange(updatedFiles);
      if (updatedFiles.length === 0 && fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const resetUploadedFiles = () => {
      setFileNames([]);
      onFileChange && onFileChange([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    return (
      <div className="flex flex-col h-full w-full gap-3">
        <div className="flex-grow overflow-auto flex flex-col-reverse gap-2">
          {noFilesUploaded && <NoDataComponent text="No files uploaded" />}
          {fileNames.length > 0 && (
            <div className="p-2 my-1 rounded-md border">
              <p className="font-bold">Selected Files:</p>
              {fileNames.map((file, idx) => (
                <div key={idx} className="flex flex-col mb-2">
                  <div className="flex items-center justify-between">
                    {isDownloadable ? (
                      <a
                        href={file.url}
                        download={file.name}
                        className="text-sm text-blue-600 underline cursor-pointer"
                      >
                        {file.name}
                      </a>
                    ) : (
                      <span>{file.name}</span>
                    )}
                    <TextButton
                      onClick={() => removeFile(idx)}
                      className={`text-red-500 hover:text-red-800 ${
                        file.progress === 100
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={file.progress === 100}
                    >
                      <X className="w-4 h-4" />
                    </TextButton>
                  </div>
                  <Progress value={file.progress} />
                  <p className="text-xs text-gray-500">
                    {file.progress}% uploaded
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="file-upload" className="sr-only">
              Select Files
            </Label>
            <TextButton variant="outline" asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                <UploadIcon className="w-5 h-5" />
              </label>
            </TextButton>
            <Input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              multiple={multipleFileUploads} // Controls whether multiple files are allowed
              accept={acceptedFileType || "*/*"} // Accept file type from props
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    );
  }
);
