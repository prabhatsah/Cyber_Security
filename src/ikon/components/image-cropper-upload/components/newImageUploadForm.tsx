import React, { useState, useEffect, memo } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ImageIcon,
  FileImage,
  Square,
  Upload,
} from "lucide-react";
import { Label } from "@/shadcn/ui/ui/label";
import { Input } from "@/shadcn/ui/ui/input";
import { Button } from "@/shadcn/ui/ui/button";
import NewCropperImg from "./newCropper";
import Image from "next/image";

type ActiveState = "first" | "second" | "third";

interface ImageFormProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onImageSubmit: (data: string | null) => void;
}

const NewImageForm: React.FC<ImageFormProps> = ({
  open,
  setOpen,
  onImageSubmit,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [prevImages, setPrevImages] = useState<
    Record<ActiveState, string | null>
  >({
    first: null,
    second: null,
    third: null,
  });
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const [activeState, setActiveState] = useState<ActiveState>("first");
  const [rotationAngle, setRotationAngle] = useState(0);
  const [scale, setScale] = useState(1);
  const [moveDirection, setMoveDirection] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [fileName, setFileName] = useState<string | undefined>("");

  const handleImageSubmit = () => {
    console.log("Image Submit Button is pressed");
    console.log(prevImages);
    onImageSubmit(prevImages.third);
    setOpen(false);
  };

  const rotateImage = (angle: number) => {
    setRotationAngle((prevAngle) => prevAngle + angle);
  };

  const handleMoveUp = () => {
    setMoveDirection({ x: 0, y: -5 });
  };

  const handleMoveDown = () => {
    setMoveDirection({ x: 0, y: 5 });
  };

  const handleMoveLeft = () => {
    setMoveDirection({ x: -5, y: 0 });
  };

  const handleMoveRight = () => {
    setMoveDirection({ x: 5, y: 0 });
  };

  // Handle zoom in
  const zoomIn = () => {
    setScale((prevScale) => {
      const newScale = prevScale + 0.2;
      if (newScale <= 2) {
        // Ensure scale does not exceed the max value
        return newScale;
      }
      return prevScale;
    });
  };

  // Handle zoom out
  const zoomOut = () => {
    setScale((prevScale) => {
      const newScale = prevScale - 0.2;
      if (newScale >= 0.2) {
        // Ensure scale does not go below the min value
        return newScale;
      }
      return prevScale;
    });
  };

  const handleAspectRatioChange = (ratio: number, stateName: ActiveState) => {
    setAspectRatio(ratio);
    setActiveState(stateName);
  };

  const handleFileChange = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setFileName((prev) => prev || file.name);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please drop a valid image file.");
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    handleFileChange(event.dataTransfer.files[0]);
  };

  const getImagePreview = (state: ActiveState) => {
    const imgSource =
      croppedImage && activeState === state ? croppedImage : prevImages[state];
    // const imgSource = prevImages[state];
    return imgSource ? (
      <div
        className={`
            ${
              state === "first"
                ? "relative w-3/5 h-[200px] bg-slate-400"
                : state === "second"
                ? "relative w-1/2 h-[220px] bg-slate-400"
                : "relative w-1/3 h-[120px] bg-slate-400"
            }`}
      >
        <Image
          src={imgSource || ""}
          alt={`Preview ${state}`}
          layout="fill"
          objectFit="70vh"
        />
      </div>
    ) : (
      <div
        className={`
            ${
              state === "first"
                ? "relative w-3/5 h-[200px] bg-slate-400"
                : state === "second"
                ? "relative w-1/2 h-[220px] bg-slate-400"
                : "relative w-1/3 h-[120px] bg-slate-400"
            }`}
      ></div>
    );
  };

  useEffect(() => {
    if (croppedImage) {
      if (
        prevImages.first === null ||
        prevImages.second === null ||
        prevImages.third === null
      ) {
        setPrevImages({
          first: croppedImage,
          second: croppedImage,
          third: croppedImage,
        });
      } else {
        setPrevImages((prev) => ({ ...prev, [activeState]: croppedImage }));
      }
    }
  }, [croppedImage]);

  return (
    <>
      {/* Form UI */}
      <div className="flex flex-row gap-2">
        <div className="flex-1">
          <Label htmlFor="imageName">Image Name</Label>
          <Input
            id="imageName"
            placeholder="Enter image name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
        <div className="self-end">
          <Button
            variant="outline"
            onClick={() => document.getElementById("inputImage1")?.click()}
          >
            <Upload />
          </Button>
          <Input
            id="inputImage1"
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImageSrc(reader.result as string);
                  setFileName((prevFileName) => prevFileName || file.name);
                };
                reader.readAsDataURL(file);
                setPrevImages({
                  first: null,
                  second: null,
                  third: null,
                });
              }
            }}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="imageDesc">Image Description</Label>
          <Input id="imageDesc" placeholder="Describe your image" />
        </div>
      </div>

      {/* Image Upload */}
      <div className="flex flex-row gap-2">
        <div
          className="w-3/5 flex justify-center items-center border-2 border-dashed border-gray-400 bg-gray-100"
          style={{ height: "70vh" }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {imageSrc ? (
            <NewCropperImg
              imageSrc={imageSrc}
              onCroppedImage={setCroppedImage}
              aspectRatio={aspectRatio}
              rotationAngle={rotationAngle}
              zoomLevel={scale}
              moveDirection={moveDirection}
              currentState={activeState}
            />
          ) : (
            <div className="text-center">
              <Label htmlFor="inputImage">Drag and drop an image here</Label>
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("inputImage")?.click()}
                >
                  Upload Image
                </Button>
                <Input
                  id="inputImage"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0]!)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Image Previews */}
        <div className="w-2/5 flex flex-col gap-2">
          <h3>Landscape</h3>
          {getImagePreview("first")}
          <h3>Potrait</h3>
          {getImagePreview("second")}
          <h3>Icon</h3>
          {getImagePreview("third")}
        </div>
      </div>

      {/* Controls */}

      <div className="flex flex-row gap-1">
        <div className="w-3/5 flex flex-row justify-between">
          <div>
            <Button
              variant="outline"
              onClick={() => handleAspectRatioChange(4 / 3, "first")}
            >
              <ImageIcon />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAspectRatioChange(3 / 4, "second")}
            >
              <FileImage />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAspectRatioChange(1 / 1, "third")}
            >
              <Square />
            </Button>
          </div>

          <div>
            <Button onClick={() => rotateImage(90)} variant="outline">
              {<RotateCw />}
            </Button>

            <Button onClick={() => rotateImage(-90)} variant="outline">
              {<RotateCcw />}
            </Button>
          </div>

          <div>
            <Button onClick={() => zoomIn()} variant="outline">
              {<ZoomIn />}
            </Button>
            <Button onClick={() => zoomOut()} variant="outline">
              {<ZoomOut />}
            </Button>
          </div>
          <div>
            <Button onClick={handleMoveUp} variant="outline">
              {<ArrowUp />}
            </Button>
            <Button onClick={handleMoveDown} variant="outline">
              {<ArrowDown />}
            </Button>
            <Button onClick={handleMoveLeft} variant="outline">
              {<ArrowLeft />}
            </Button>
            <Button onClick={handleMoveRight} variant="outline">
              {<ArrowRight />}
            </Button>
          </div>
        </div>

        <div className="w-2/5 flex flex-row-reverse">
          <Button onClick={handleImageSubmit}>Save</Button>
        </div>
      </div>
    </>
  );
};

export default memo(NewImageForm);
