import { Input } from '@/shadcn/ui/input'
import { Label } from '@/shadcn/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, FileImage, ImageIcon, RotateCcw, RotateCw, Square, Upload, ZoomIn, ZoomOut } from 'lucide-react'
import { memo, useEffect, useState } from 'react'
import ImageCropper from '../image-cropper'
import Image from 'next/image'
import { AspectRatio } from '@/shadcn/ui/aspect-ratio'
import { TextButton } from '../../buttons'
import { toast } from 'sonner'
import FileInput from '../../file-input'
import { OriginalImageProps, useImageCropper } from '..'
import { set } from 'date-fns'

type ActiveState = "landscape" | "potrait" | "icon";

const stateWiseAspectRatio = {
    landscape: 4 / 3,
    potrait: 3 / 4,
    icon: 1 / 1
}


function CropperForm() {

    const { originalImage, setOriginalImage, aspectRatioWiseImages, setAspectRatioWiseImages } = useImageCropper();
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [activeState, setActiveState] = useState<ActiveState | undefined>();
    const [rotationAngle, setRotationAngle] = useState(0);
    const [scale, setScale] = useState(1);
    const [moveDirection, setMoveDirection] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        handleFileChange(event.dataTransfer.files[0]);
    };

    const handleFileChange = (file: File | string) => {
        if (typeof file === "string") {
            setImageSrc(file);
        } else {
            if (file?.type?.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageSrc(reader.result as string);
                    setActiveState(undefined);
                };
                reader.readAsDataURL(file);
                setOriginalImage({ ...originalImage, image: file, name: file.name });
            } else {
                toast.error("Please select a valid image file.");
            }
        }
    };

    useEffect(() => {
        if (originalImage.image) {
            handleFileChange(originalImage.image)
        }
    }, [originalImage.image]);


    const getImagePreview = (state: ActiveState) => {
        const imgSource = croppedImage && activeState === state ? croppedImage : aspectRatioWiseImages[state];
        return (
            <>
                <h3 className='mb-3'>{state}</h3>
                <AspectRatio ratio={stateWiseAspectRatio[state]} className='bg-muted'>
                    {imgSource &&
                        <Image
                            src={imgSource || ""}
                            alt={`Preview ${state}`}
                            fill
                        />
                    }
                </AspectRatio>
            </>
        )
    };



    useEffect(() => {
        if (croppedImage) {
            if (activeState) {
                setAspectRatioWiseImages({ ...aspectRatioWiseImages, [activeState]: croppedImage });
            } else {
                setAspectRatioWiseImages({
                    landscape: croppedImage,
                    potrait: croppedImage,
                    icon: croppedImage
                });
            }
        }

    }, [croppedImage]);

    return (
        <>
            <div className='flex flex-col gap-3 h-full overflow-auto'>
                <div className='flex flex-col lg:flex-row gap-3 justify-between'>
                    <div className='w-full'>
                        <Label htmlFor="imageName">
                            Image Name
                        </Label>
                        <FileInput
                            id="inputImage"
                            accept="image/*"
                            fileNamePlaceholder="Enter image name"
                            fileName={originalImage?.name || ""}
                            onChange={(e) => handleFileChange(e.target.files?.[0]!)}
                            onFileNameChange={(e) => {
                                setOriginalImage({ ...originalImage, name: e.target.value })
                            }}
                        />

                    </div>
                    <div className='w-full'>
                        <Label htmlFor="imageDescription">
                            Image Description
                        </Label>
                        <Input
                            id="imageDescription"
                            placeholder="Enter image Description"
                            value={originalImage?.description || ""}
                            onChange={(e) => setOriginalImage({ ...originalImage, description: e.target.value })}
                        />
                    </div>
                </div>
                <div className='flex flex-col lg:flex-row gap-3'>
                    <div className='flex-grow flex flex-col gap-3'>
                        <div>
                            <h3 className='mb-3'>Original Image</h3>
                            <AspectRatio
                                ratio={4 / 3}
                                className='flex justify-center items-center bg-muted text-muted-foreground'
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                {imageSrc ?
                                    <ImageCropper
                                        src={imageSrc}
                                        onCroppedImage={setCroppedImage}
                                        aspectRatio={stateWiseAspectRatio[activeState || "icon"]}
                                        rotationAngle={rotationAngle}
                                        zoomLevel={scale}
                                        moveDirection={moveDirection}
                                    />
                                    :
                                    <div className="text-center">
                                        <Label htmlFor="inputImage">Drag and drop an image here</Label>
                                        <div className="mt-3">
                                            <TextButton
                                                variant="outline"
                                                onClick={() => document.getElementById("inputImage")?.click()}
                                            >
                                                Browse Image
                                            </TextButton>

                                        </div>
                                    </div>
                                }
                            </AspectRatio>

                        </div>
                        <div className="flex flex-col lg:flex-row gap-3 justify-between">
                            <div>
                                <ToggleGroup type="single" variant='outline' value={activeState} onValueChange={(value) => setActiveState(value as ActiveState)}>
                                    <ToggleGroupItem className="rounded-e-none" value="landscape">
                                        <ImageIcon />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem className="rounded-none border-x-0" value="potrait">
                                        <FileImage />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem className='rounded-s-none' value="icon">
                                        <Square />
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            <div className='flex flex-col lg:flex-row gap-3 justify-between'>
                                <ToggleGroup type="single" variant='outline' value="" onValueChange={(value) => setRotationAngle(parseInt(value))}>
                                    <ToggleGroupItem className="rounded-e-none" value="90">
                                        <RotateCw />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem className='rounded-s-none border-s-0' value="-90">
                                        <RotateCcw />
                                    </ToggleGroupItem>
                                </ToggleGroup>
                                <ToggleGroup type="single" variant='outline' value=''>
                                    <ToggleGroupItem className="rounded-e-none" value="up" onClick={() => setMoveDirection({ x: 0, y: -5 })}>
                                        <ArrowUp />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem className="rounded-none border-x-0" value="down" onClick={() => setMoveDirection({ x: 0, y: 5 })}>
                                        <ArrowDown />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem className='rounded-none border-e-0' value="left" onClick={() => setMoveDirection({ x: -5, y: 0 })}>
                                        <ArrowLeft />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem className='rounded-s-none' value="right" onClick={() => setMoveDirection({ x: 5, y: 0 })}>
                                        <ArrowRight />
                                    </ToggleGroupItem>
                                </ToggleGroup>
                                <ToggleGroup type="single" variant='outline' value="" onValueChange={(value) => setScale(pre => pre + parseFloat(value))} >
                                    <ToggleGroupItem className="rounded-e-none" value="0.1">
                                        <ZoomIn />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem className='rounded-s-none border-s-0' value="-0.1">
                                        <ZoomOut />
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                        </div>

                    </div>
                    {/* Image Previews */}
                    <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-48">
                        <div className='w-5/5'>
                            {getImagePreview("landscape")}
                        </div>
                        <div className='w-4/5'>
                            {getImagePreview("potrait")}
                        </div>
                        <div className='w-3/5'>
                            {getImagePreview("icon")}
                        </div>
                    </div>
                </div>

            </div >


        </>
    )
}

export default memo(CropperForm)