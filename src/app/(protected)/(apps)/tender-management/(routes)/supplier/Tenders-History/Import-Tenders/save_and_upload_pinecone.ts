"use server";
import { getTicket } from "@/ikon/utils/actions/auth";
import { singleFileUpload } from "@/ikon/utils/api/file-upload";
import {
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { DOWNLOAD_URL } from "@/ikon/utils/config/urls";
import { toast } from "sonner";

export const tenderHistoryUpload = async (data: Record<string, any>) => {
  console.log("RFP Data before try:", data);
  try {
    const handleUpload = async (uploadedFile: any) => {
      const ticket = await getTicket();

      try {
        const fileArray: File[] = [];
        let urlArray: any[] = [];
        console.log("uploaded resource:", uploadedFile);

        let url = "";
        if (uploadedFile) {
          for (const file of uploadedFile) {
            url =
              DOWNLOAD_URL +
              "?ticket=" +
              ticket +
              "&resourceId=" +
              file.resourceId +
              "&resourceName=" +
              file.resourceName +
              "&resourceType=" +
              file.resourceType;
            urlArray.push({
              url: url,
              department: data.department,
              sector: data.sector,
              product_service: data.product_service,
            });
          }
          console.log("Selected RFP File:", urlArray);
        } else {
          console.warn(`RFP with ID ${rfpData.id} not found in the map.`);
        }
        console.log("Selected RFP File Array:", fileArray);

        fetch(
          "https://ikoncloud-dev.keross.com/aiagent/webhook/d172d647-03c4-43f0-aff5-ac30a0b69b34",
          {
            method: "POST", // Specify the request method
            headers: {
              "Content-Type": "application/json", // Indicate the data format
            },
            body: JSON.stringify({
              // Convert the data to JSON
              docs: urlArray,
            }),
          }
        )
          .then(async (response) => {
            //let audioData = await response.json();
            //audioData = audioData.data
            console.log("g", response);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          })
          .then((data) => {
            console.log("Success:", data);
            toast.success("File uploaded succesfully.");
            // Handle the server's response
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };
    const resourceData = [];
    for (const file of data.files) {
      //const fileData = await singleFileUpload(file);
      const fileData = {
        resourceId: file.id,
        resourceName: file.fileName,
        resourceSize: file.fileSize,
        resourceType: file.fileType,
      };
      console.log("File upload result:", fileData);
      resourceData.push(fileData);
    }
    data.files = resourceData;
    //const resourceData = await singleFileUpload(data.file);
    console.log("File upload result:", resourceData);
    // delete data.file;
    // data.resourceData = resourceData;
    const processId = await mapProcessName({
      processName: "DM File Tender Response Upload Tracker",
    });
    await startProcessV2({
      processId,
      data: data,
      processIdentifierFields: "id",
    });
    await handleUpload(resourceData);
    console.log(
      "------------------RFP draft started successfully and uploaded to pinecone.-------------------"
    );
  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};
