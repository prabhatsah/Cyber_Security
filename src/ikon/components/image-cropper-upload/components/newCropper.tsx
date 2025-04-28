import React, { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface CropperImgProps {
    imageSrc: string | undefined; // imageSrc can be a string (image URL or base64) or undefined
    onCroppedImage: (imageUrl: string) => void; // Callback function from parent to pass cropped image
    aspectRatio: number;
    rotationAngle: number; // Rotation angle passed from the parent
    zoomLevel: number; // Add zoomLevel prop
    moveDirection: { x: number; y: number }; // Movement props
    currentState: string
}

const NewCropperImg: React.FC<CropperImgProps> = ({ imageSrc, onCroppedImage, aspectRatio, rotationAngle, zoomLevel, moveDirection,currentState }) => {
    const cropperRef = useRef<ReactCropperElement>(null);

    const onCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            cropper.setDragMode('move');
            const croppedCanvas = cropper.getCroppedCanvas();
            const croppedImageUrl = croppedCanvas.toDataURL(); // Data URL for preview
            onCroppedImage(croppedImageUrl);
        } else {
            console.log("Cropper instance is not available.");
        }
    };

    useEffect(() => {
        // Rotate the image whenever the rotation angle changes
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            cropper.rotate(rotationAngle); // Apply the rotation to the image
        }

    }, [rotationAngle]); // Effect will run whenever rotationAngle changes

    useEffect(() => {
        // Zoom the image whenever the zoom level changes
        const cropper = cropperRef.current?.cropper;

        if (cropper) {
            const cropBoxData = cropper.getCropBoxData();
            if (cropBoxData.width) {
                console.log('Inside cropper scale')
                cropper.scale(zoomLevel); // Apply the zoom level
            }
            // Apply zoom directly without using getZoom method
        }
    }, [zoomLevel]); // Effect will run whenever zoomLevel changes

    // Move the image based on the moveDirection prop
    useEffect(() => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            // Make sure moveDirection is available before calling move
            const cropBoxData = cropper.getCropBoxData();
            if (cropBoxData.width) {
                const { x, y } = moveDirection;
                if (typeof x === "number" && typeof y === "number") {
                    cropper.move(x, y); // Move the image
                }
            }

        }
    }, [moveDirection]); // This effect runs whenever moveDirection changes

    useEffect(() => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            cropper.setAspectRatio(aspectRatio); // Dynamically set the aspect ratio
            if (aspectRatio === 1) {
                // Get the displayed (canvas) dimensions of the image
                const canvasData = cropper.getCanvasData();
                const canvasWidth = canvasData.width;  // Displayed width of the image
                const canvasHeight = canvasData.height; // Displayed height of the image
                const canvasLeft = canvasData.left;  // Left offset of the image within the container
                const canvasTop = canvasData.top;    // Top offset of the image within the container

                // Define the desired crop box dimensions
                const cropBoxWidth = 200;  // Desired crop box width
                const cropBoxHeight = 100; // Desired crop box height

                // Calculate the center position for the crop box
                const left = canvasLeft + (canvasWidth - cropBoxWidth) / 2;
                const top = canvasTop + (canvasHeight - cropBoxHeight) / 2;

                // Set the crop box data
                cropper.setCropBoxData({
                    left: left,
                    top: top,
                    width: cropBoxWidth,
                    height: cropBoxHeight,
                });
            }

        }

    }, [aspectRatio]); // Trigger this effect whenever aspectRatio changes

    return (
        <Cropper
            src={imageSrc}
            style={{ height: "100%", width: "100%", objectFit: "contain" }}
            guides={true} // Show guides for cropping
            crop={onCrop} // Callback to capture the cropped area
            ref={cropperRef}
            dragMode='move'
            movable={true}
            zoomable={true} // Allow zooming of the image
            scalable={true} // Prevent scaling of the crop box
            cropBoxMovable={true} // Allow the crop box to be moved inside the image
            cropBoxResizable={false} // Disable resizing the crop box
        />
    );
};

export default NewCropperImg;