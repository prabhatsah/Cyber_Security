// import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";

// interface ScanResult {
//   source: string;
//   data: any;
// }

// const handleActiveReconClick = async (pentestData) => {
//     const amassData = pentestData?.scanData?.amass || {};
//     const nmapData = pentestData?.scanData?.nmap || {};
//     const theHarvesterData = pentestData?.scanData?.theHarvester || {};
//     const whatwebData = pentestData?.scanData?.whatweb || {};
//     const userId = (await getLoggedInUserProfile()).USER_ID;
//     try {
//         const response = await fetch(
//             "https://ikoncloud-uat.keross.com/cstools/AiScan",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     scanData: amassData,
//                     source: "amass",
//                 }),
//             }
//         );

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("AI Response for Amass:", data);
//         callNmapData(nmapData, whatwebData, theHarvesterData)


//     } catch (error) {
//         console.error("Error during scan status fetch:", error);
//     }
// };

// const callNmapData = async (nmapData, whatwebData, theHarvesterData) => {
//     try {
//         const response = await fetch(
//             "https://ikoncloud-uat.keross.com/cstools/AiScan",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     scanData: nmapData,
//                     source: "nmap",
//                 }),
//             }
//         );

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("AI Response for Nmap:", data);
//         callWhatwebData(whatwebData, theHarvesterData)

//     } catch (error) {
//         console.error("Error during scan status fetch:", error);
//     }
// };

// const callWhatwebData = async (whatwebData, theHarvesterData) => {
//     try {
//         const response = await fetch(
//             "https://ikoncloud-uat.keross.com/cstools/AiScan",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     scanData: whatwebData,
//                     source: "whatweb",
//                 }),
//             }
//         );

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("AI Response for whatweb:", data);
//         callHarvesterData(theHarvesterData)

//     } catch (error) {
//         console.error("Error during scan status fetch:", error);
//     }
// };


// const callHarvesterData = async (theHarvesterData) => {
//     try {
//         const response = await fetch(
//             "https://ikoncloud-uat.keross.com/cstools/AiScan",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     scanData: theHarvesterData,
//                     source: "harvester",
//                 }),
//             }
//         );

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("AI Response for theHarvester:", data);


//     } catch (error) {
//         console.error("Error during scan status fetch:", error);
//     }
// };

// export default handleActiveReconClick;

import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";

interface ScanResult {
    source: string;
    data: any;
}

/**
 * Sends each recon scan payload to the AI endpoint in parallel
 * and aggregates all responses into one array.
 *
 * @param pentestData - The pentestData object containing scanData for amass, nmap, whatweb, theHarvester.
 * @returns Array of ScanResult objects for each source.
 */
const handleActiveReconClick = async (
    pentestData: Record<string, any>
): Promise<ScanResult[]> => {
    const scanData = pentestData?.scanData ?? {};
    const { USER_ID: userId } = await getLoggedInUserProfile();

    // Define each scan source and its key in scanData
    const sources: { key: keyof typeof scanData; source: string }[] = [
        { key: "amass", source: "amass" },
        { key: "nmap", source: "nmap" },
        { key: "whatweb", source: "whatweb" },
        // { key: "theHarvester", source: "harvester" },
    ];

    // Create fetch promises for all scans
    const fetchPromises = sources.map(async ({ key, source }) => {
        const payload = {
            scanData: scanData[key] || {},
            source,
            userId,
        };

        const res = await fetch(
            "https://ikoncloud-uat.keross.com/cstools/AiScan",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            console.error(`Error from ${source}:`, res.statusText);
            throw new Error(`HTTP ${res.status} on ${source}`);
        }

        const data = await res.json();
        return { source, data } as ScanResult;
    });

    // Wait for all requests to finish
    const allResponses = await Promise.all(fetchPromises);
    console.log("All AI Responses:", allResponses);

    return allResponses;
};

export default handleActiveReconClick;

