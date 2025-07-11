import { NextResponse } from "next/server";

const zapApiUrl = "https://ikoncloud-dev.keross.com/scan";

export async function GET(req) {
  try {
    const response = await fetch(`${zapApiUrl}/OTHER/core/other/jsonreport/`);
    const report = await response.json();
    console.log("Fetched ZAP report.");
    return NextResponse.json({ report: report });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
