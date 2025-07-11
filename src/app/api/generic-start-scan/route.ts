// import io from "socket.io-client";

// const ScanStatus = () => {
//   const socket = io("https://ikoncloud-uat.keross.com", {
//     path: "/cstools/socket.io",
//     transports: ["websocket"],
//   });

//   socket.on("scan_complete", (data: any) => {
//     console.log("Scan completed:", data);
//   });

//   return () => {
//     socket.disconnect();
//   };
// };

// export default ScanStatus;

const ScanStatus = async (userId, tool, target, pentestId) => {
  try {
    const response = await fetch(
      "https://ikoncloud-uat.keross.com/cstools/startScan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          tool: tool,
          target: target,
          pentestid: pentestId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Scan completed:", data);
  } catch (error) {
    console.error("Error during scan status fetch:", error);
  }
};

export default ScanStatus;
