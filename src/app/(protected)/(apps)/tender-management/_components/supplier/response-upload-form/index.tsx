"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Form } from "@/shadcn/ui/form";
import Countries from "../../../_utils/common/country";
import { sectors } from "../../../_utils/common/sector";
import { responseUpload } from "../response-upload";
import { startTransition } from "react";

const responseSchema = z.object({
  responseTitle: z.string().min(1, "Response Title is required"),
  responseDeadline: z.string().min(1, "Response Deadline is required"),
  sector: z.string().min(1, "Sector is required"),
  country: z.string().min(1, "Country is required"),
  file: z.instanceof(File, { message: "Please select a file" }),
});

interface ResponseFormValues {
  responseTitle: string;
  responseDeadline: string;
  sector: string;
  country: string;
  file: File;
}

interface ResponseProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OpenModal({ isOpen, onClose }: ResponseProps) {
  const router = useRouter();

  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
  });

  const handleGenerateUUID = () => {
    return crypto.randomUUID();
  };

  const onSubmit = async (data: ResponseFormValues) => {
    try {
      console.log("Form Data:", data);
      const uuid = handleGenerateUUID();
      const formData = {} as any;
      formData["id"] = uuid;
      formData["responseTitle"] = data.responseTitle;
      formData["responseDeadline"] = data.responseDeadline;
      formData["sector"] = data.sector;
      formData["country"] = data.country;
      formData["file"] = data.file;

      await responseUpload(formData);
      console.log("Response draft started successfully.");
    } catch (error) {
      console.error("Error starting Response draft:", error);
    } finally {
      onClose();
      startTransition(() => {
        router.refresh();
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Upload Response</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              {/* Response Title */}
              <div className="grid gap-1.5">
                <Label htmlFor="responseTitle">
                  Response Title <b className="text-danger">&nbsp;*</b>
                </Label>
                <Input
                  type="text"
                  id="responseTitle"
                  placeholder="Enter Response Title"
                  {...form.register("responseTitle")}
                />
                {form.formState.errors.responseTitle && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.responseTitle.message}
                  </p>
                )}
              </div>

              {/* Response Deadline */}
              <div className="grid gap-1.5">
                <Label htmlFor="responseDeadline">
                  Response Deadline <b className="text-danger">&nbsp;*</b>
                </Label>
                <Input
                  type="date"
                  id="responseDeadline"
                  {...form.register("responseDeadline")}
                />
                {form.formState.errors.responseDeadline && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.responseDeadline.message}
                  </p>
                )}
              </div>

              {/* Sector */}
              <div className="grid gap-1.5">
                <Label htmlFor="sector">
                  Sector <b className="text-danger">&nbsp;*</b>
                </Label>
                <Select
                  onValueChange={(value) => form.setValue("sector", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((option: any) => (
                      <SelectItem
                        key={option.sectorId}
                        value={option.sectorName}
                      >
                        {option.sectorName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.sector && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.sector.message}
                  </p>
                )}
              </div>

              {/* Country */}
              <div className="grid gap-1.5">
                <Label htmlFor="country">
                  Country <b className="text-danger">&nbsp;*</b>
                </Label>
                <Select
                  onValueChange={(value) => form.setValue("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {Countries.map((option: any) => (
                      <SelectItem
                        key={option.countryId}
                        value={option.countryName}
                      >
                        {option.countryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.country.message}
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div className="grid gap-1.5 col-span-2">
                <Label htmlFor="file">
                  Upload Response Document{" "}
                  <b className="text-danger">&nbsp;*</b>
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      form.setValue("file", file);
                    }
                  }}
                />
                {form.formState.errors.file && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.file.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <DialogFooter>
              <div className="flex justify-end mt-6">
                <Button type="submit">Submit</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
