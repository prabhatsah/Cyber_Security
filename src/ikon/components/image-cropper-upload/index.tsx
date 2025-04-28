"use client"
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import CropperFormWithModal from './cropper-form-with-modal'
import { CropperUploadImagesInfoProps, uploadedImagesToCropperImgObj } from './utils';


interface ImageCropperContextProps {
    originalImage: OriginalImageProps;
    setOriginalImage: (originalImage: OriginalImageProps) => void;
    aspectRatioWiseImages: AspectRatioWiseImagesProps;
    setAspectRatioWiseImages: (aspectRatioWiseImages: AspectRatioWiseImagesProps) => void;
}


export interface AspectRatioWiseImagesProps {
    landscape: string | null;
    potrait: string | null;
    icon: string | null;
}

export interface OriginalImageProps {
    image: string | File | null;
    name?: string;
    description?: string;
}

interface ImageCropperProps {
    children: ReactNode,
    uploadedImages: CropperUploadImagesInfoProps | null,
    onCropperChange: (originalImage: OriginalImageProps, aspectRatioWiseImages: AspectRatioWiseImagesProps) => void;
    modalOpen?: boolean;
    onModalOpenChange?: (open: boolean) => void;
}

const ImageCropperContext = createContext<ImageCropperContextProps | undefined>(undefined)

export function ImageCropperProvider({ children, uploadedImages, onCropperChange, modalOpen, onModalOpenChange }: ImageCropperProps) {

    const [aspectRatioWiseImages, setAspectRatioWiseImages] = useState<AspectRatioWiseImagesProps>({
        landscape: null,
        potrait: null,
        icon: null
    });
    const [originalImage, setOriginalImage] = useState<OriginalImageProps>({
        image: null,
        name: "",
        description: "",
    });


    useEffect(() => {
        async function updateCropperImages() {
            if (!uploadedImages) return; // Prevent unnecessary processing

            try {
                const res = await uploadedImagesToCropperImgObj(uploadedImages);
                if (res) {
                    // Check if state is different before updating
                    setOriginalImage((prev) =>
                        JSON.stringify(prev) === JSON.stringify(res.originalImage) ? prev : res.originalImage
                    );

                    setAspectRatioWiseImages((prev) =>
                        JSON.stringify(prev) === JSON.stringify(res.aspectRatioWiseImages) ? prev : res.aspectRatioWiseImages
                    );
                }
            } catch (error) {
                console.error("Error processing uploaded images:", error);
            }
        }

        updateCropperImages();
    }, [uploadedImages]); // Runs only when `uploadedImages` changes


    return (
        <ImageCropperContext.Provider value={{ originalImage, setOriginalImage, aspectRatioWiseImages, setAspectRatioWiseImages }}>
            {children}
            {modalOpen && onModalOpenChange && <CropperFormWithModal open={modalOpen} onOpenChange={onModalOpenChange} onCropperChange={onCropperChange} />}
        </ImageCropperContext.Provider>
    )
}

export const useImageCropper = (): ImageCropperContextProps => {
    const context = useContext(ImageCropperContext);
    if (!context) {
        throw new Error("useImageCropper must be used within a ImageCropperProvider");
    }
    return context;
};