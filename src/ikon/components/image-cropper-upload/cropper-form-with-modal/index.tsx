import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import React from 'react'
import CropperForm from '../cropper-form'
import { TextButton } from '../../buttons'
import { AspectRatioWiseImagesProps, OriginalImageProps, useImageCropper } from '..'

function CropperFormWithModal
    ({ open, onOpenChange, onCropperChange }:
        Readonly<{ open: boolean, onOpenChange: (open: boolean) => void, onCropperChange: (originalImage: OriginalImageProps, aspectRatioWiseImages: AspectRatioWiseImagesProps) => void }>) {
    const { originalImage, aspectRatioWiseImages } = useImageCropper();
    return (
        <Dialog modal open={open} onOpenChange={(isOpen) => {
            onOpenChange(isOpen)
        }}>
            <DialogContent className="max-w-full lg:max-w-5xl max-h-full overflow-auto">
                <DialogHeader>
                    <DialogTitle>Image to upload</DialogTitle>
                </DialogHeader>
                <CropperForm />
                <DialogFooter>
                    <TextButton onClick={() => {
                        onCropperChange(originalImage, aspectRatioWiseImages)
                        onOpenChange(false);
                    }}>
                        Save Changes
                    </TextButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CropperFormWithModal