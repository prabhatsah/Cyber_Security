import { useEffect, useState } from "react";
import io from "socket.io-client";
import { setterWsData } from "./getterSetterWs";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { fetchData } from "./api";
import { ScanNotificationDataModified, ScanNotificationInDatabase } from "@/components/type";
import { useScanNotification } from "@/contexts/ScanNotificationContext";
import { toast } from "@/lib/toast";


const toolNameMap = {
  "nmap": "Network Mapping",
  "whatweb": "Technology Discovery",
  "amass": "SubDomain Enumeration",
  "zap": "Vulnerability Scanning",
  "zapSpider": "Web Crawling",
  "zapActiveScan": "Vulnerability Scanning",
  "theHarvester": "Information Gathering",
  "virusTotal": "OSINT and Threat Intelligence"
}

const fetchReqScanNotificationDetails = async (scanId: string) => {
  const reqScanNotificationData = await fetchData("scandetails", "scan_id", [{ table: "scandetails", column: "scan_id", value: scanId }]);

  return reqScanNotificationData;
}

const ScanStatus = () => {
  const [wsData, setWsData] = useState<Record<string, string>>({});
  const { setScanNotificationData } = useScanNotification();

  useEffect(() => {



    const socket = io("https://ikoncloud-uat.keross.com", {
      path: "/cstools/socket.io",
      transports: ["websocket"],
    });

    // socket.on("scan_complete", (data) => {
    //   console.log("Scan completed:", data);
    //   localStorage.setItem("scanData", JSON.stringify(data));
    //   setWsData(data)
    // });

    socket.on("scan_complete", async (data) => {
      console.log("Scan completed: ", data);

      const completedScanDataFromDB: ScanNotificationInDatabase = await fetchReqScanNotificationDetails(data.scan_id) ?
        (await fetchReqScanNotificationDetails(data.scan_id)).data[0] : {};

      const previousScannedDetails: ScanNotificationDataModified[] = JSON.parse(localStorage.getItem("scanData") ?? "") ?? [];
      previousScannedDetails.map((eachScan) => {
        if (eachScan.scanId === completedScanDataFromDB.scan_id) {
          return {
            ...eachScan,
            endTime: completedScanDataFromDB.end_time ?? "",
          };
        }
        return eachScan;
      });

      localStorage.setItem("scanData", JSON.stringify(previousScannedDetails));
      setScanNotificationData((prevScanNotificationData) => {
        return prevScanNotificationData.map((eachScan) => {
          if (eachScan.scanId === completedScanDataFromDB.scan_id) {
            return {
              ...eachScan,
              endTime: completedScanDataFromDB.end_time ?? "",
            };
          }
          return eachScan;
        });
      });
      setWsData(data);

      const toastMsg = toolNameMap[completedScanDataFromDB.tool as keyof typeof toolNameMap] + " Completed!";
      toast.push(toastMsg, "success");
    });

    return () => {
      //globalWsData = null;
      socket.disconnect();
    };
  }, []);

  return (
    <>
      {Object.keys(wsData).length > 0 ? <h1>Scan completed</h1> : null}
    </>
  );
};

export default ScanStatus;
