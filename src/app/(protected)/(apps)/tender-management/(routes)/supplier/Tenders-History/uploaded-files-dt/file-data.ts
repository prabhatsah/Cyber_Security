import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function getFileData(department?: string) {
//   const fileData = [
//     {
//       resourceId: "12345",
//       resourceName: "Tender Document",
//       resourceType: "PDF",
//       resourceData: {
//         fileName: "tender.pdf",
//         fileSize: "2MB",
//         fileType: "application/pdf",
//       },
//       sector: "Construction",
//       product_service: "Building Materials",
//     },
//     {
//       resourceId: "67890",
//       resourceName: "Bid Submission Form",
//       resourceType: "DOCX",
//       resourceData: {
//         fileName: "bid_submission.docx",
//         fileSize: "1MB",
//         fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       },
//       sector: "IT Services",
//       product_service: "Software Development",
//     },
//   ];

const response = await getMyInstancesV2({
        processName: "DM File Tender Response Upload Tracker",
        predefinedFilters: { taskName: "View Upload Form" },
       
      });
      console.log('response', response);
      const fileData = Array.isArray(response)
        ? response.map((e: any) => e.data)
        : [];
    
      return fileData;
}