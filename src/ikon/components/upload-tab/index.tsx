"use client";
import { useState, useEffect } from "react";
import { UploadIcon, X, FileWarning, Send } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Progress } from "@/shadcn/ui/progress";
import { useForm } from "react-hook-form";
import axios from "axios";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/shadcn/ui/form";
import NoDataComponent from "../no-data";

interface Entry {
  text: string;
  fileNames: string[];
}

interface FileDetails {
  name: string;
  url: string;
  progress: number;
  file: File;
}

export default function UploadTab() {
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
        file,
      }));
      setFileNames((prev) => [...prev, ...uploadedFiles]); // Type now matches correctly
      setNoFilesUploaded(false);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = fileNames.filter((_, idx) => idx !== index);
    setFileNames(updatedFiles);
    if (updatedFiles.length === 0 && texts.length === 0) {
      setNoFilesUploaded(true);
    }
  };

  const simulateFileUpload = async (idx: number, file: FileDetails) => {
    const formData = new FormData();
    formData.append("file", file.file); // Use the actual file object

    try {
      const response = await axios.post("UPLOAD_ENDPOINT_URL", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setFileNames((prev) =>
            prev.map((f, i) => (i === idx ? { ...f, progress } : f))
          );
        },
      });

      setFileNames((prev) =>
        prev.map((f, i) =>
          i === idx ? { ...f, url: response.data.url, progress: 100 } : f
        )
      );
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <>
      {/* Container for the text list */}
      <div className="flex flex-col h-full w-full gap-3">
        <div className="flex-grow overflow-auto flex flex-col-reverse gap-2">
          {noFilesUploaded && <NoDataComponent text="No files uploaded" />}
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
                    href={
                      fileNames.find((file) => file.name === fileName)?.url ||
                      "#"
                    }
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
          <form onSubmit={form.handleSubmit(() => handleAddText())}>
            <div className="flex flex-col">
              <div className="flex items-center justify-center gap-2">
                <div className="flex-1">
                  <FormField
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            id="text-input"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type something..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                </div>
                <Button variant="outline" type="submit" disabled={isUploading}>
                  <Send />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
