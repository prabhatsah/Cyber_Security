export async function AWSConnection(
  accessKeyId: string,
  secretAccessKey: string
) {
  if (!accessKeyId || !secretAccessKey) {
    return {
      success: false,
      error: "AWS Access Key and Secret Key are required.",
    };
  }

  try {
    const response = await fetch("/api/cloud-container/amazon-web-services", {
      method: "POST",
      body: JSON.stringify({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
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
      error: "An error occurred while testing the AWS connection.",
    };
  }
}
