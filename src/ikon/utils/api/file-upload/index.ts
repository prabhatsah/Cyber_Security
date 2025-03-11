"use server";
import { AxiosResponse } from "axios";
import { axiosInstance } from "../ikonBaseApi";
import { v4 } from "uuid";
import { FileinfoProps } from "./type";
import { getTicket } from "../../actions/auth";
import { UPLOAD_URL } from "../../config/urls";

export async function singleFileUpload(
  file: File,
  resourceId?: string
): Promise<FileinfoProps> {
  const formData = new FormData();
  formData.append("file", file);

  const fileInfo = {} as FileinfoProps;
  fileInfo["resourceId"] = resourceId || v4();
  fileInfo["resourceName"] = file.name;
  fileInfo["resourceSize"] = file.size;
  fileInfo["resourceType"] = file.type;

  const globalTicket = (await getTicket()) || "";
  const queryParams = new URLSearchParams({
    ticket: globalTicket,
    resourceId: fileInfo["resourceId"],
  });
  try {
    const result: AxiosResponse<unknown> = await axiosInstance({
      method: "POST",
      url: `${UPLOAD_URL}?${queryParams.toString()}`,
      data: formData,
      responseType: "json",
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("File upload result:", result);
  } catch (error) {
    throw error;
  }

  return fileInfo;
}

export async function multipleFileUpload(
  files: File[],
  resourceId?: string
): Promise<FileinfoProps[]> {
  const fileInfos: FileinfoProps[] = [];
  for (const file of files) {
    const fileInfo = await singleFileUpload(file, resourceId);
    fileInfos.push(fileInfo);
  }
  return fileInfos;
}

export async function base64FileUpload(base64File: string, resourceName: string, resourceType: string, resourceId?: string): Promise<FileinfoProps> {
  const base64 = base64File.split(',')[1];
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: resourceType });
  const file = new File([blob], resourceName, { type: resourceType });
  return await singleFileUpload(file, resourceId);
}