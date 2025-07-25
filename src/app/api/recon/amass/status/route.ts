import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  // const kaliIp = "http://192.168.1.34:5000"; // Replace with your Kali Linux IP
  const kaliIp = process.env.KALI_LINUX_IP;

  try {
    const res = await fetch(`${kaliIp}/amass/status/${jobId}`);

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `Kali server error: ${errorText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching job status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
