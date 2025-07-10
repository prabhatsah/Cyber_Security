import { NextResponse } from "next/server";

const zapApiUrl = "https://ikoncloud-dev.keross.com/scan";

function structureSpiderData(data) {
  const structuredData = [];

  if (!data || !data.fullResults) return structuredData;

  data.fullResults.forEach((result) => {
    if (result.urlsInScope) {
      result.urlsInScope.forEach((urlInfo) => {
        structuredData.push({
          method: urlInfo.method,
          url: urlInfo.url,
          flags: urlInfo.statusReason,
        });
      });
    }

    if (result.urlsOutOfScope) {
      result.urlsOutOfScope.forEach((url) => {
        structuredData.push({
          method: "GET",
          url: url,
          flags: "Out of Scope",
        });
      });
    }
  });

  return structuredData;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const scanId = searchParams.get("scanId");

    if (!scanId) {
      return NextResponse.json(
        { message: "Missing scanId parameter" },
        { status: 400 }
      );
    }

    // Fetch Spider scan results from ZAP
    const response = await fetch(
      `${zapApiUrl}/JSON/spider/view/fullResults/?scanId=${scanId}`
    );
    const data = await response.json();

    if (!data || !data.fullResults) {
      return NextResponse.json(
        { message: "Failed to fetch Spider scan results" },
        { status: 500 }
      );
    }

    const urls = structureSpiderData(data);

    return NextResponse.json({ urls: urls });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
