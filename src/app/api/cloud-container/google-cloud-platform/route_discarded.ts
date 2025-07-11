import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { serviceAccountKey } = await req.json();

    if (!serviceAccountKey) {
      return NextResponse.json(
        { success: false, error: "Missing serviceAccountKey in request body" },
        { status: 400 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountKey,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const compute = google.compute({ version: "v1", auth });    

    const projectId = serviceAccountKey.project_id;

    // Step 1: Get all zones in the project
    const zonesRes = await compute.zones.list({ project: projectId });
    const zones =
      zonesRes.data.items?.map((zone) => zone.name).filter(Boolean) || [];

    const allInstances: any[] = [];

    // Step 2: For each zone, get instances (if any)
    for (const zone of zones) {
      const instancesRes = await compute.instances.list({
        project: projectId,
        zone,
      });
      const instances = instancesRes.data.items || [];
      allInstances.push(...instances.map((vm) => ({ ...vm, zone })));
    }

    return NextResponse.json({
      success: true,
      message: "Scan completed across all zones",
      instanceCount: allInstances.length,
      data: allInstances,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
