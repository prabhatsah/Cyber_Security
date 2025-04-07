export async function ScoutSuiteScanData(
  cloudProvider: string,
  credentials: Record<string, any>
) {
  if (!credentials) {
    return { success: false, error: "Credentials is required." };
  }

  try {
    const response = await fetch(
      "http://localhost:3000/api/cloud-container/scan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cloudProvider: cloudProvider,
          credentials: credentials,
        }),
      }
    );

    const result = await response.json();

    return result;
  } catch (error) {
    return {
      success: false,
      error: "An error occurred while testing the connection.",
    };
  }
}
