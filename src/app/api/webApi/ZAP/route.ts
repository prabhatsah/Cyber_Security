import { NextResponse } from "next/server";

const zapApiUrl = "https://ikoncloud-dev.keross.com/scan";

export async function POST(req: Request) {
  try {
    const { url, type } = await req.json();
    if (!url) {
      return NextResponse.json(
        { message: "Missing target URL" },
        { status: 400 }
      );
    }

    // Start Spider Scan
    if (type == "spider") {
      const response = await fetch(
        `${zapApiUrl}/JSON/${type}/action/scan/?url=${encodeURIComponent(
          url
        )}&maxChildren=10`
      );
      const data = await response.json();

      if (!data.scan) {
        throw new Error("Failed to start spider scan");
      }

      console.log(`Spider scan started with ID: ${data.scan}`);

      return NextResponse.json({
        message: "Scans started",
        scanId: data.scan,
      });
    }

    // Start Active Scan
    if (type == "ascan") {
      const response = await fetch(
        `${zapApiUrl}/JSON/${type}/action/scan/?url=${encodeURIComponent(
          url
        )}&recurse=false`
      );
      const data = await response.json();

      if (!data.scan) {
        throw new Error("Failed to start spider scan");
      }

      console.log(`Spider scan started with ID: ${data.scan}`);

      return NextResponse.json({
        message: "Scans started",
        scanId: data.scan,
      });
    }

    // Start Active Scan (after Spider scan completes)
    // const ascanResponse = await fetch(
    //   `${zapApiUrl}/JSON/ascan/action/scan/?url=${encodeURIComponent(
    //     url
    //   )}&recurse=false`
    // );
    // const ascanData = await ascanResponse.json();

    // if (!ascanData.scan) {
    //   throw new Error("Failed to start active scan");
    // }

    // console.log(`Active scan started with ID: ${ascanData.scan}`);

    // // Send scan IDs to the frontend
    // return NextResponse.json({
    //   message: "Scans started",
    //   spiderScanId: spiderData.scan,
    //   activeScanId: ascanData.scan,
    // });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
