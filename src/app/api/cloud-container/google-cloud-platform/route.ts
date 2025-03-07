import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { serviceAccountKey, projectId } = req.body;

    try {
      // Authenticate using the Service Account JSON key
      const auth = new google.auth.GoogleAuth({
        credentials: serviceAccountKey,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"], // You can adjust the scopes based on what you need
      });

      // Initialize the Compute Engine API (or any other GCP API)
      const compute = google.compute({ version: "v1", auth });

      // Test connection by listing the GCP project details
      const result = await compute.projects.get({ project: projectId });

      // If successful, return project details
      res.status(200).json({
        success: true,
        projectInfo: result.data,
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
}
