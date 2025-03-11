import { base64FileUpload, singleFileUpload } from "@/ikon/utils/api/file-upload";
import { AspectRatioWiseImagesProps, OriginalImageProps } from "..";
import { FileinfoProps } from "@/ikon/utils/api/file-upload/type";
import { getResourceUrl } from "@/ikon/utils/actions/common/utils";

export interface CropperUploadImagesInfoProps {
    originalImageInfo?: FileinfoProps | null,
    imageName?: string,
    imageDescription?: string,
    landscapeImageInfo?: FileinfoProps | null,
    portaitImageInfo?: FileinfoProps | null,
    iconImageInfo?: FileinfoProps | null
}
export interface UploadedImagesToCropperImgObjProps {
    originalImage: OriginalImageProps;
    aspectRatioWiseImages: AspectRatioWiseImagesProps;
}
export async function imageCropperFilesUpload(originalImage: OriginalImageProps, aspectRatioWiseImages?: AspectRatioWiseImagesProps, resourceId?: string): Promise<CropperUploadImagesInfoProps | null> {
    if (!originalImage.image) {
        return null;
    }

    const originalImageInfo = await singleFileUpload(originalImage.image as File, resourceId);

    const cropperUploadImagesInfo: CropperUploadImagesInfoProps = {
        originalImageInfo: originalImageInfo,
        imageName: originalImage.name,
        imageDescription: originalImage.description,
        landscapeImageInfo: null,
        portaitImageInfo: null,
        iconImageInfo: null
    }

    if (aspectRatioWiseImages) {
        if (aspectRatioWiseImages.landscape) {
            try {
                cropperUploadImagesInfo["landscapeImageInfo"] = await base64FileUpload(aspectRatioWiseImages.landscape, originalImage.name + "_L.webp", "image/webp")
            } catch (error) {
                console.error(error)
            }
        }
        if (aspectRatioWiseImages.potrait) {
            try {
                cropperUploadImagesInfo["portaitImageInfo"] = await base64FileUpload(aspectRatioWiseImages.potrait, originalImage.name + "_P.webp", "image/webp")
            } catch (error) {
                console.error(error)
            }
        }
        if (aspectRatioWiseImages.icon) {
            try {
                cropperUploadImagesInfo["iconImageInfo"] = await base64FileUpload(aspectRatioWiseImages.icon, originalImage.name + "_I.webp", "image/webp")
            } catch (error) {
                console.error(error)
            }
        }
    }

    return cropperUploadImagesInfo;
}

export async function uploadedImagesToCropperImgObj(uploadedImages: CropperUploadImagesInfoProps | null): Promise<UploadedImagesToCropperImgObjProps | null> {

    if (!uploadedImages) {
        return null
    }


    const originalImageUrl = uploadedImages.originalImageInfo ? await getResourceUrl(uploadedImages.originalImageInfo) : null;
    const landscapeImageUrl = uploadedImages.landscapeImageInfo ? await getResourceUrl(uploadedImages.landscapeImageInfo) : null;
    const portaitImageUrl = uploadedImages.portaitImageInfo ? await getResourceUrl(uploadedImages.portaitImageInfo) : null;
    const iconImageUrl = uploadedImages.iconImageInfo ? await getResourceUrl(uploadedImages.iconImageInfo) : null;

    const obj: UploadedImagesToCropperImgObjProps = {
        originalImage: {
            image: originalImageUrl,
            name: uploadedImages.imageName,
            description: uploadedImages.imageDescription
        },
        aspectRatioWiseImages: {
            landscape: landscapeImageUrl,
            potrait: portaitImageUrl,
            icon: iconImageUrl
        }
    }

    return obj
}
