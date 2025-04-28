"use client";
import React, { createRef, useEffect, useState } from "react";

import { Copy } from "lucide-react";

import { Button } from "@/shadcn/ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/ui/dialog";
import CropperImg from "./components/cropperImg";
import ImageForm from "./components/imageUploadForm";
import NewImageForm from "./components/newImageUploadForm";

type ImageData = string | null;
interface UploadSettingPictureProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  iconImageData: (data: ImageData) => void; // Expect a function that will be called when image data is submitted
}
export default function ImageCropper({
  open,
  setOpen,
  iconImageData,
}: UploadSettingPictureProps) {
  // const [imageData, setImageData] = useState<ImageData>(null); // To store the image data

  const handleImageData = (data: ImageData): void => {
    // console.log("Received image data from child:", data);
    // setImageData(data); // Update the state with the image data
    iconImageData(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-[1024px] sm:max-w-[445px] sm: max-h-[100vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Image to upload</DialogTitle>
        </DialogHeader>
        <NewImageForm
          open={open}
          setOpen={setOpen}
          onImageSubmit={handleImageData}
        />
      </DialogContent>
    </Dialog>
  );
}
