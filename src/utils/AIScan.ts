import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";

const handleActiveReconClick = async (pentestData) => {
    const amassData = pentestData?.scanData?.amass || {};
    const nmapData = pentestData?.scanData?.nmap || {};
    const theHarvesterData = pentestData?.scanData?.theHarvester || {};
    const whatwebData = pentestData?.scanData?.whatweb || {};
    const userId = (await getLoggedInUserProfile()).USER_ID;
    try {
        const response = await fetch(
            "https://ikoncloud-uat.keross.com/cstools/AiScan",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    scanData: amassData,
                    source: "amass",
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("AI Response for Amass:", data);
        callNmapData(nmapData, whatwebData, theHarvesterData)


    } catch (error) {
        console.error("Error during scan status fetch:", error);
    }
};

const callNmapData = async (nmapData, whatwebData, theHarvesterData) => {
    try {
        const response = await fetch(
            "https://ikoncloud-uat.keross.com/cstools/AiScan",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    scanData: nmapData,
                    source: "nmap",
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("AI Response for Nmap:", data);
        callWhatwebData(whatwebData, theHarvesterData)

    } catch (error) {
        console.error("Error during scan status fetch:", error);
    }
};

const callWhatwebData = async (whatwebData, theHarvesterData) => {
    try {
        const response = await fetch(
            "https://ikoncloud-uat.keross.com/cstools/AiScan",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    scanData: whatwebData,
                    source: "whatweb",
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("AI Response for whatweb:", data);
        callHarvesterData(theHarvesterData)

    } catch (error) {
        console.error("Error during scan status fetch:", error);
    }
};


const callHarvesterData = async (theHarvesterData) => {
    try {
        const response = await fetch(
            "https://ikoncloud-uat.keross.com/cstools/AiScan",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    scanData: theHarvesterData,
                    source: "harvester",
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("AI Response for theHarvester:", data);


    } catch (error) {
        console.error("Error during scan status fetch:", error);
    }
};

export default handleActiveReconClick;
