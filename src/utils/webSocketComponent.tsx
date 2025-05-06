import { useEffect, useState } from "react";
import io from "socket.io-client";
import { setterWsData } from "./getterSetterWs";

const ScanStatus = () => {
  const [wsData, setWsData] = useState<Record<string, string>>({});

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

    socket.on("scan_complete", (data) => {
      console.log("Scan completed:", data);
      localStorage.setItem("scanData_" + data.scan_id, JSON.stringify(data));
      setWsData(data)
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
