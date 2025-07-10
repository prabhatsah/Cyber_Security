// import UpdatesPageDetails from "./updatesDetails";

// function UpdatePage() {
//     return (
//         <>
//             <h1 className="text-2xl font-bold mb-2 text-foreground">
//                 System & Global Updates
//             </h1>
//             <p>Track the latest updates and modifications implemented within the GRC system</p>

//             <UpdatesPageDetails ></UpdatesPageDetails>
//         </>

//     )

// }
// export default UpdatePage;


import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import UpdatesPageDetails from "./updatesDetails";


async function fetchActivityLogOfRiskLibrary(): Promise<any[]> {
  try {
    const findInsData = await getMyInstancesV2<any>({
      processName: "Activity Log for adding risk library from Global",
      predefinedFilters: { taskName: "View Activity" }
    });
    return findInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching risk library activity log data:", error);
    return [];
  }
}

async function fetchRiskLibraryData(): Promise<any[]> {
  try {
    const findInsData = await getMyInstancesV2<any>({
      processName: "Risk Library",
      predefinedFilters: { taskName: "View Library" }
    });
    return findInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching risk library data:", error);
    return [];
  }
}



async function UpdatePage() {

    const activityLogDataOfRiskLibrary =await fetchActivityLogOfRiskLibrary();
    const riskLibraryData = await fetchRiskLibraryData();
    console.log("Activity Log Data:", activityLogDataOfRiskLibrary);


    return (
        <>
            <h1 className="text-2xl font-bold mb-2 text-foreground">
                System & Global Updates
            </h1>
            <p>Track the latest updates and modifications implemented within the GRC system</p>

            <UpdatesPageDetails activityLogDataOfRiskLibrary={activityLogDataOfRiskLibrary} riskLibraryData={riskLibraryData}></UpdatesPageDetails>
        </>

    )

}

export default UpdatePage;