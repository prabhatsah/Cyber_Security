import React, { act, memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  FileImage,
  Square,
  ZoomIn,
  ZoomOut,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  RotateCcw,
  Upload,
} from "lucide-react";
import { Label } from "@/shadcn/ui/ui/label";
import { Input } from "@/shadcn/ui/ui/input";
import { Button } from "@/shadcn/ui/ui/button";
import CropperImg from "./cropperImg";
// import CropperImg from "../"

type ActiveState = "first" | "second" | "third";

interface ImageFormProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onImageSubmit: (data: string | null) => void;
}
const ImageForm: React.FC<ImageFormProps> = ({
  open,
  setOpen,
  onImageSubmit,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage1] = useState<string | null>(null); // Ensure null when no cropped image
  const [prevImgState1, setPrevImgState1] = useState<string | null>(null);
  const [prevImgState2, setPrevImgState2] = useState<string | null>(null);
  const [prevImgState3, setPrevImgState3] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3); // Default is 4:3 aspect ratio
  const [activeState, setActiveState] = useState<ActiveState>("first");
  const [fileName, setFileName] = useState<string | undefined>("");

  const [rotationAngle, setRotationAngle] = useState(0); // State to track the rotation angle
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom level
  const [moveDirection, setMoveDirection] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [scale, setScale] = useState(1); // Initial scale set to 1

  const handleImageSubmit = () => {
    console.log("Image Submit Button is pressed");
    console.log(prevImgState3);
    onImageSubmit(prevImgState3);
    setOpen(false);
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

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setFileName((prevFileName) => prevFileName || file.name);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please drop a valid image file.");
    }
  };

  // Handle the drag over event (for allowing drop)
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleCroppedImage = (imageUrl: string) => {
    setCroppedImage1(imageUrl); // Update cropped image state
  };

  // Aspect ratio change handler
  const handleAspectRatioChange = (ratio: number, stateName: ActiveState) => {
    setAspectRatio(ratio); // Update the aspect ratio in the state
    setActiveState(stateName);
  };

  const rotateImage = (angle: number) => {
    setRotationAngle((prevAngle) => prevAngle + angle);
  };

  // const zoomImage = (zoomFactor: number) => {
  //     setZoomLevel((prevZoom) => {
  //         const newZoom = prevZoom + zoomFactor; // Adjust zoom level
  //         return newZoom >= 0.1 ? newZoom : prevZoom; // Ensure minimum zoom level
  //     });
  // };

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

  function setActiveImagePath() {
    if (croppedImage && !prevImgState1) {
      setPrevImgState1(croppedImage);
    }
    if (croppedImage && !prevImgState2) {
      setPrevImgState2(croppedImage);
    }
    if (croppedImage && !prevImgState3) {
      setPrevImgState3(croppedImage);
    }
    if (croppedImage && activeState === "first") {
      setPrevImgState1(croppedImage);
    }
    if (croppedImage && activeState === "second") {
      setPrevImgState2(croppedImage);
    }
    if (croppedImage && activeState === "third") {
      setPrevImgState3(croppedImage);
    }
  }

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value); // Allow manual changes to the input field
  };

  useEffect(() => {
    setActiveImagePath();
  }, [croppedImage]);

  return (
    <>
      <div className="flex flex-row gap-2 mb-2">
        <div className="flex-1">
          <div className="flex flex-row">
            <div>
              <Label htmlFor="imageName">Image Name</Label>
              <Input
                id="imageName"
                placeholder="Enter image name"
                value={fileName}
                onChange={handleFileNameChange}
              />
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => document.getElementById("inputImage1")?.click()}
              >
                Upload
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
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <Label htmlFor="imageDesc">Image Description</Label>
          <Input id="imageDesc" placeholder="Describe your image" />
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <div
          className="w-3/5 flex justify-center items-center border-2 border-dashed border-gray-400 bg-gray-100"
          style={{ height: "70vh" }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {imageSrc ? (
            <div className="h-full w-full">
              <CropperImg
                imageSrc={imageSrc}
                onCroppedImage={handleCroppedImage}
                aspectRatio={aspectRatio}
                rotationAngle={rotationAngle}
                zoomLevel={scale}
                moveDirection={moveDirection}
              />
            </div>
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.type.startsWith("image/")) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImageSrc(reader.result as string);
                        setFileName(
                          (prevFileName) => prevFileName || file.name
                        );
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="w-2/5">
          {/* Show the live preview of the cropped image */}
          <div className="flex flex-col gap-3">
            <h3>Landscape</h3>
            {activeState === "first" && croppedImage ? (
              <div className="relative w-3/5 h-[100px] bg-slate-400">
                <Image
                  src={croppedImage || ""}
                  alt="Cropped Preview1"
                  layout="fill"
                  // width={500}
                  // height={500}
                  objectFit="cover"
                />
              </div>
            ) : prevImgState1 ? (
              <div className="relative w-3/5 h-[100px] bg-slate-400">
                <Image
                  src={prevImgState1 || ""}
                  alt="Previous Preview1"
                  // className="object-cover h-full w-full"
                  // width={500}
                  // height={500}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="w-3/5 h-[100px] bg-slate-400"></div>
            )}

            <h3>Potrait</h3>
            {activeState === "second" && croppedImage ? (
              <div className="relative w-1/2 h-[250px] bg-slate-400">
                <Image
                  src={croppedImage || ""}
                  alt="Cropped Preview2"
                  // className="object-cover h-full w-full"
                  // width={500}
                  // height={500}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : prevImgState2 ? (
              <div className="relative w-1/2 h-[250px] bg-slate-400">
                <Image
                  src={prevImgState2 || ""}
                  alt="Previous Preview2"
                  // className="object-cover h-full w-full"
                  // width={500}
                  // height={500}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="w-1/2 h-[250px] bg-slate-400"> </div>
            )}

            <h3>Icon</h3>
            {activeState === "third" && croppedImage ? (
              <div className="relative w-1/3 h-[100px] bg-slate-400">
                <Image
                  src={croppedImage || ""}
                  alt="Cropped Preview3"
                  // className="object-cover h-full w-full"
                  // width={500}
                  // height={500}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : prevImgState3 ? (
              <div className="relative w-1/3 h-[100px] bg-slate-400">
                <Image
                  src={prevImgState3 || ""}
                  alt="Previous Preview3"
                  // className="object-cover h-full w-full"
                  // width={500}
                  // height={500}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="w-1/3 h-[100px] bg-slate-400"> </div>
            )}
          </div>
        </div>
      </div>

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

export default memo(ImageForm);
