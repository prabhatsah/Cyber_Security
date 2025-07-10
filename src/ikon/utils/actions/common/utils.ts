import { FileinfoProps } from "../../api/file-upload/type";
import { DOWNLOAD_URL } from "../../config/urls";
import { getTicket } from "../auth";

export function getSrcFromBase64String(imgString?: string | null, type?: string) {
    return imgString ? `data:${type || "image/webp"};base64,${imgString}` : "";
}

export async function getResourceUrl(fileInfo: FileinfoProps): Promise<string> {
    const globalTicket = await getTicket();
    return DOWNLOAD_URL + "?ticket=" + globalTicket + "&resourceId=" + fileInfo.resourceId + "&resourceName=" + fileInfo.resourceName + "&resourceType=" + fileInfo.resourceType
}

export async function downloadResource(fileInfo: FileinfoProps) {
    const resourceUrl = await getResourceUrl(fileInfo)
    window.open(encodeURI(resourceUrl))
}

export async function openFileInNewTab(url: string) {
    const encodedLink = encodeURI(url);
    try {
        const response = await fetch(encodedLink);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    } catch (err) {
        console.error('Failed to open file in new tab:', err);
    }
};