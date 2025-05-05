import { useEffect, useState } from "react";
import io from "socket.io-client";
export let globalWsData: Record<string, string> | null = null;

const ScanStatus = () => {
  const [wsData, setWsData] = useState<Record<string, string>>({});

  useEffect(() => {

    //globalWsData = null;

    const socket = io("https://ikoncloud-uat.keross.com", {
      path: "/cstools/socket.io",
      transports: ["websocket"],
    });

    socket.on("scan_complete", (data) => {
      console.log("Scan completed:", data);
      setWsData(data);
      globalWsData = data;
    });

    return () => {
      globalWsData = null;
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
