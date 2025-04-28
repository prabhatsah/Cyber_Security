import { NextResponse } from "next/server";

const zapApiUrl = "https://ikoncloud-dev.keross.com/scan";

export async function GET() {
  try {
    // Fetch active scan details from ZAP API
    const response = await fetch(`${zapApiUrl}/JSON/ascan/view/scans`);
    if (!response.ok) {
      throw new Error(`Failed to fetch scan details: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching scan details:", error);
    return NextResponse.json(
      { message: "Error fetching scan details", error: error.message },
      { status: 500 }
    );
  }
}
