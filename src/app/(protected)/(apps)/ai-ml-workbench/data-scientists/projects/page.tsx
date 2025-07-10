// "use client";
// import { DataTable } from "@/components/ikon-components/data-table";
// import { DTColumnsProps } from "@/components/ikon-components/data-table/type";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";

// type Project = {
//   project: string;
//   assignment: string;
//   createdBy: string;
//   creationOn: string;
//   lastUpdated: string;
// };

// const columns: DTColumnsProps<Project, unknown>[] = [
//   {
//     header: "Project",
//     accessorKey: "project", // Use the correct key in your data
//     cell: (row) => <span>{row.row.original.project}</span>,
//   },
//   {
//     header: "Assignment",
//     accessorKey: "assignment",
//     cell: (row) => <span>{row.row.original.assignment}</span>,
//   },
//   {
//     header: "Created By",
//     accessorKey: "createdBy",
//     cell: (row) => <span>{row.row.original.createdBy}</span>,
//   },
//   {
//     header: "Creation On",
//     accessorKey: "creationOn",
//     cell: (row) => <span>{row.row.original.creationOn}</span>,
//   },
//   {
//     header: "Last Updated",
//     accessorKey: "lastUpdated",
//     cell: (row) => <span>{row.row.original.lastUpdated}</span>,
//   },
//   {
//     header: "Action",
//     accessorKey: "action",
//     cell: (row) => (
//       <button
//         className="bg-blue-500 text-white px-4 py-1 rounded"
//         onClick={() => alert(`Action clicked for ${row.row.original.project}`)}
//       >
//         Action
//       </button>
//     ),
//   },
// ];

// const projectData = [
//   {
//     project: "Home Value Prediction",
//     assignment: "Zestimate",
//     createdBy: "Rizwan Ansari",
//     creationOn: "20-01-2024",
//     lastUpdated: "20-01-2024",
//   },
//   {
//     project: "Music Recommendation System",
//     assignment: "Dataset Prediction",
//     createdBy: "Rizwan Ansari",
//     creationOn: "20-01-2024",
//     lastUpdated: "20-01-2024",
//   },
//   {
//     project: "Iris Flowers Classification",
//     assignment: "API Implementaion",
//     createdBy: "Rizwan Ansari",
//     creationOn: "20-01-2024",
//     lastUpdated: "20-01-2024",
//   },
//   {
//     project: "Stock Prices Predictor",
//     assignment: "Modal Selection",
//     createdBy: "Rizwan Ansari",
//     creationOn: "20-01-2024",
//     lastUpdated: "20-01-2024",
//   },
// ];

// const extraTools = [
//   <Button variant="outline" size={"icon"}>
//     <Plus />
//   </Button>,
// ];

// const extraParams = {
//   pageSize: 5,
//   showPagination: true,
//   extraTools: extraTools,
// };
// export interface assignmentData {
//   organisationDetails: {
//     organisationName: string;
//     email: string;
//     orgContactNo: string;
//     noOfEmployees?: number | string;
//     sector: string;
//     source: string;
//     website: string;
//     street: string;
//     city: string;
//     state: string;
//     postalCode: string;
//     country: string;
//     landmark: string;
//   };
//   teamInformation: {
//     salesManager: string;
//     salesteam: string[];
//   };
//   leadIdentifier: string;
//   leadStatus: string;
//   updatedOn: string;
//   dealDetails?: {
//     dealIdentifier: string;
//     dealNo: string;
//     dealName: string;
//     expectedRevenue: number;
//     currency: string;
//     dealStatus: string;
//     productDetails: {
//       [key: string]: {
//         productIdentifier: string;
//         productType: string;
//         productDescription: string;
//         projectManager: string;
//       };
//     };
//     updatedOn: string;
//     isDebtRevenue: boolean;
//     dealStartDate: string;
//     createdBy?: string;
//     leadIdentifier: string;
//     contactDetails?: object;
//   };
//   activeStatus?: string;
//   commentsLog?: object[];
// }

// export default function MLProjects() {
//   return (
//     <>
//       <div className="w-full h-full flex flex-col gap-3">
//         <div className="flex-grow overflow-hidden">
//           <DataTable
//             columns={columns}
//             data={projectData}
//             extraParams={extraParams}
//           />
//         </div>
//       </div>
//     </>
//   );
// }

import ProjectDataTable from "./components/project-datatable";
import { ProjectData } from "../../components/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function Project() {
  const ProjectsData = await getMyInstancesV2<ProjectData>({
    processName: "Alert Rule",
    predefinedFilters: { taskName: "View Alert" },
  });

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex-grow overflow-hidden">
        <ProjectDataTable projectsData={ProjectsData.map((e: any) => e.data)} />
      </div>
    </div>
  );
}
