export async function fetchVendorsAnalysisData() {
  try {
    const response = await fetch(
      //   `http://192.168.3.23:3000/api/OSINT/virusTotal?domain=${domain}`,
      `http://192.168.3.23:3000/api/OSINT/virusTotal?domain=http://malware.wicar.org`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any | unknown) {
    console.error("Error fetching VirusTotal data:", error);
    return { error: error.message };
  }
}
