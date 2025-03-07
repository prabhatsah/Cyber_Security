import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process"; // To run Scout Suite commands
import path from "path"; // For file path manipulation
import fs from "fs"; // To handle file system operations

// Function to execute the Scout Suite scan command
const executeScan = (cloudProvider: string, credentials: any) => {
  return new Promise((resolve, reject) => {
    const scanCommand = getScanCommand(cloudProvider, credentials);

    exec(scanCommand, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

// Function to get the scan command based on cloud provider
const getScanCommand = (cloudProvider: string, credentials: any): string => {
  const credentialsFilePath = saveCredentialsToFile(cloudProvider, credentials);

  if (cloudProvider === "gcp") {
    return `scout scan --gcp-project-id=${credentials.projectId} --gcp-service-account-key=${credentialsFilePath}`;
  }

  if (cloudProvider === "aws") {
    return `scout scan --aws-access-key=${credentials.awsAccessKey} --aws-secret-key=${credentials.awsSecretKey}`;
  }

  if (cloudProvider === "azure") {
    return `scout scan --azure-client-id=${credentials.azureClientId} --azure-client-secret=${credentials.azureClientSecret} --azure-tenant-id=${credentials.azureTenantId}`;
  }

  return ""; // Default empty command for unsupported providers
};

// Function to save credentials to a temporary file (like JSON) for Scout Suite CLI usage
const saveCredentialsToFile = (
  cloudProvider: string,
  credentials: any
): string => {
  const tempFilePath = path.join(
    __dirname,
    `temp-credentials-${cloudProvider}.json`
  );

  // Write the credentials to a temporary file
  fs.writeFileSync(tempFilePath, JSON.stringify(credentials), "utf8");

  return tempFilePath;
};

// API route handler
export async function POST(req: NextRequest) {
  try {
    const { cloudProvider, credentials } = await req.json();

    // Validate the cloud provider and credentials
    if (!cloudProvider || !credentials) {
      return NextResponse.json(
        { error: "Missing cloud provider or credentials" },
        { status: 400 }
      );
    }

    // Execute the scan command for the specific cloud provider
    const result = await executeScan(cloudProvider, credentials);

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
