import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Route called");
    const body = await req.json();
    console.log("body - ");
    console.log(body);

    const scoutRes = await fetch("http://127.0.0.1:5000/run-scout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // This should include serviceAccountKey
    });

    const result = await scoutRes.json();

    return NextResponse.json({
      success: true,
      message: "Scan completed using Scout API",
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
