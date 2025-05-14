import { useEffect, useState } from "react";
import io from "socket.io-client";
import { setterWsData } from "./getterSetterWs";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { fetchData } from "./api";
import { ScanNotificationDataModified, ScanNotificationInDatabase } from "@/components/type";
import { useScanNotification } from "@/contexts/ScanNotificationContext";

const fetchReqScanNotificationDetails = async (scanId: string) => {
  const reqScanNotificationData = await fetchData("scandetails", "scan_id", [{ column: "scan_id", value: scanId }]);

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

      const completedScanDataModified: ScanNotificationDataModified = {
        scanId: completedScanDataFromDB.scan_id,
        tool: completedScanDataFromDB.tool,
        target: completedScanDataFromDB.target,
        startTime: completedScanDataFromDB.start_time,
        endTime: completedScanDataFromDB.end_time ?? "",
        status: completedScanDataFromDB.status
      }

      const previousScannedDetails = JSON.parse(localStorage.getItem("scanData") ?? "") ?? [];
      previousScannedDetails.push(completedScanDataModified);

      localStorage.setItem("scanData", JSON.stringify(previousScannedDetails));
      setScanNotificationData(previousScannedDetails);
      setWsData(data);
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
