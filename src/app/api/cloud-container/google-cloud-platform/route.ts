import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

// export default async function handler(
export async function POST(req: NextRequest) {
  console.log(req.method);
  if (req.method === "POST") {
    const { serviceAccountKey, projectId } = await req.json();
    console.log(serviceAccountKey);
    try {
      // Authenticate using the Service Account JSON key
      const auth = new google.auth.GoogleAuth({
        credentials: serviceAccountKey,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"], // You can adjust the scopes based on what you need
      });
      console.log("auth completed");

      // Initialize the Compute Engine API (or any other GCP API)
      const compute = google.compute({ version: "v1", auth });
      console.log("compute completed");
      console.log(compute);

      return NextResponse.json({ success: true, data: compute });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { success: false, error: "Method Not Allowed" },
      { status: 405 }
    );
  }
}
