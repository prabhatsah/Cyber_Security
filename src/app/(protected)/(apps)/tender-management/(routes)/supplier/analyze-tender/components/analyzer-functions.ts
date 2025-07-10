
import { getTicket } from "@/ikon/utils/actions/auth";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { singleFileUpload } from "@/ikon/utils/api/file-upload";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { DOWNLOAD_URL } from "@/ikon/utils/config/urls";



export default async function analyzeTender(file : any,tenderData : any) {
    const handleUpload = async (uploadedFile : any) => {
      const ticket = await getTicket();
      try {
        let urlArray: { url: string,department : string,sector:string,product_service : string ,file_name : string}[] = [];
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
            urlArray.push({ 
              url: url,
              department: tenderData.tender_department,
              sector: tenderData.sector,
              product_service: tenderData.product_service,
            file_name: uploadedFile.resourceName });
            
            console.log("Selected RFP File:", urlArray);
          } else {
           // console.warn(`RFP with ID ${rfpData.id} not found in the map.`);
          }
      
        fetch(
          "https://ikoncloud-dev.keross.com/aiagent/webhook/61a00338-4888-49da-b48e-01606e42017c",
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

    const generateWithAI = async (fileName: string): Promise<any> => {
    const link =
      "https://ikoncloud-dev.keross.com/aiagent/webhook/d572c096-56fa-4fa6-9597-4b8641dba326";
    //setGenerateLoading(true);

    console.log("chat input", `analyze the tender for file name ${fileName}`);

    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatinput: `analyze the tender for file name ${fileName}`,
        //reference: templateData,
        //reference: htmlToText(template),
      }),
    });

    const data = await response.json();
    //setGenerateLoading(false);
console.log("chat response in generate with ai", data);
return data; // Ensure the function returns the fetched data
  };

const resourceData = await singleFileUpload(file);
console.log("uploaded resource:", resourceData);
await handleUpload(resourceData);
if (resourceData.resourceName) {
 const data= await generateWithAI(resourceData.resourceName);
 console.log("chat resposnse----------------------->", data[0]?.output);
 return data[0]?.output || "I couldn't process that request.";
// return data?.[0]?.output || "I couldn't process that request.";
 
}
else{
   console.error("resourceName is undefined");
  return "I couldn't process that request.";
}

}

export const invokeWorkflowAction = async (
  draftId: string,
  accountId: string,
  taskName: string,
  transitionName: string,
  data: any
) => {
  const softwareId = await getSoftwareIdByNameVersion("Tender Management", "1");
  try {
    const response = await getMyInstancesV2({
      processName: "Tender Response",
      predefinedFilters: { taskName: taskName },
      processVariableFilters: { tenderId: draftId, accountId: accountId },
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const taskData: any = response[0].data;
      await invokeAction({
        taskId: taskId,
        transitionName: transitionName,
        data: { ...taskData, ...data },
        processInstanceIdentifierField: "tenderId,accountId",
        softwareId: softwareId,
      });
    }
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};