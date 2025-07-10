"use server"
import { getTicket } from "@/ikon/utils/actions/auth";
import { singleFileUpload } from "@/ikon/utils/api/file-upload";
import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { DOWNLOAD_URL } from "@/ikon/utils/config/urls";



export const rfpUpload = async (rfpData: Record<string, any>) => {
  console.log("RFP Data before try:", rfpData);
  try {
    const handleUpload = async (uploadedFile : any) => {
      const ticket = await getTicket();
      try {
        const fileArray: File[] = [];
        let urlArray: { url: string }[] = [];
        console.log("uploaded resource:", uploadedFile);
       
          let url = "";
          if (uploadedFile) {
            url =
              DOWNLOAD_URL +
              "?ticket=" +
              ticket +
              "&resourceId=" +
              uploadedFile.resourceId +
              "&resourceName=" +
              uploadedFile.resourceName +
              "&resourceType=" +
              uploadedFile.resourceType;
            urlArray.push({ url: url });
            
            console.log("Selected RFP File:", urlArray);
          } else {
            console.warn(`RFP with ID ${rfpData.id} not found in the map.`);
          }
          console.log("Selected RFP File Array:", fileArray);
      
        fetch(
          "https://ikoncloud-dev.keross.com/aiagent/webhook/50b4660c-f2c3-4872-91d4-4c0408362525",
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
            // Handle the server's response
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };
    const resourceData = await singleFileUpload(rfpData.file);
    console.log("File upload result:", resourceData);
    delete rfpData.file;
    rfpData.resourceData = resourceData;
    const processId = await mapProcessName({processName: "RFP Upload",});
   await startProcessV2({processId, data: rfpData, processIdentifierFields: "id",});
   await handleUpload(resourceData);
   console.log("------------------RFP draft started successfully and uploaded to pinecone.-------------------");

  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};