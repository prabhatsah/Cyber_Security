const StartScan = async (
  userId: string,
  tool: string,
  target: string,
  pentestId: string,
  startTime: string
) => {
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
          start_time: startTime,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Scan Initiated:", data);

    return data;
  } catch (error) {
    console.error("Error during scan status fetch:", error);
  }
};

export default StartScan;
