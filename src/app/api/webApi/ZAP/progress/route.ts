import { NextResponse } from "next/server";

const zapApiUrl = "https://ikoncloud-dev.keross.com/scan";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const scanId = searchParams.get("scanId");
    const type = searchParams.get("type");

    if (!scanId) {
      return NextResponse.json({ message: "Missing scan ID" }, { status: 400 });
    }

    // Get Spider Scan Status
    const response = await fetch(
      `${zapApiUrl}/JSON/${type}/view/status/?scanId=${scanId}`
    );
    const data = await response.json();

    return NextResponse.json({
      progress: data.status,
    });
  } catch (error) {
    console.error("Error fetching scan progress:", error);
    return NextResponse.json(
      { message: "Error fetching progress", error: error.message },
      { status: 500 }
    );
  }
}
