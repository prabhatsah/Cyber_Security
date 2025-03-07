import { NextRequest, NextResponse } from "next/server";

// Function to call Scout Suite API with correct parameters based on the cloud provider
const callScoutApi = async (cloudProvider: string, credentials: any) => {
  const apiUrl = "http://127.0.0.1:5000/run-scout"; // URL for Scout Suite API

  try {
    // Modify the payload based on the cloud provider
    let requestBody;

    if (cloudProvider === "gcp") {
      requestBody = {
        cloudProvider,
        credentials: {
          projectId: credentials.projectId,
          serviceAccountKey: credentials.serviceAccountKey, // GCP specific
          region: credentials.region, // Optional, GCP specific
        },
      };
    } else if (cloudProvider === "aws") {
      requestBody = {
        cloudProvider,
        credentials: {
          awsAccessKey: credentials.awsAccessKey,
          awsSecretKey: credentials.awsSecretKey,
        },
      };
    } else if (cloudProvider === "azure") {
      requestBody = {
        cloudProvider,
        credentials: {
          azureClientId: credentials.azureClientId,
          azureClientSecret: credentials.azureClientSecret,
          azureTenantId: credentials.azureTenantId,
        },
      };
    } else {
      throw new Error("Unsupported cloud provider");
    }

    // Make API request to start the scan
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to initiate scan via API");
    }
    return data; // Return the result from Scout API
  } catch (error) {
    throw new Error(error.message || "Error connecting to Scout API");
  }
};

// API route handler
export async function POST(req: NextRequest) {
  try {
    const { cloudProvider, credentials } = await req.json();
    console.log("cloudProvider - " + cloudProvider);
    console.log("credentials - " + credentials.serviceAccountKey.type);

    // Validate the cloud provider and credentials
    if (!cloudProvider || !credentials) {
      return NextResponse.json(
        { error: "Missing cloud provider or credentials" },
        { status: 400 }
      );
    }

    // Call Scout Suite API to start the scan
    const result = await callScoutApi(cloudProvider, credentials);

    // Respond with the scan results
    return NextResponse.json({
      message: `Scan started successfully for ${cloudProvider}`,
      result: result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "An error occurred during the scan" },
      { status: 500 }
    );
  }
}
