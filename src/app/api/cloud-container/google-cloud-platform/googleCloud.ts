export async function GoogleCloudConnection(
  projectId: string,
  serviceAccountKey: File | null
) {
  if (!serviceAccountKey) {
    return { success: false, error: "Service account key file is required." };
  }

  try {
    const response = await fetch("/cyber-security/api/cloud-container/google-cloud-platform", {
      method: "POST",
      body: JSON.stringify({
        serviceAccountKey: serviceAccountKey,
        projectId: projectId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    return result;
  } catch (error) {
    return {
      success: false,
      error: "An error occurred while testing the connection.",
    };
  }
}
