// app/api/run-puppeteer/route.ts
import { runPuppeteerTask } from "@/app/(protected)/(apps)/tender-management/_utils/import-external-utils/puppeteerRunner";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
     const body = await req.json();
     const url = body?.url;

     if (!url) {
       return NextResponse.json({ message: "Missing URL" }, { status: 400 });
     }
    const content = await runPuppeteerTask(url);
    return NextResponse.json(
      { message:  content},
      { status: 200 }
    );
  } catch (err) {
    console.error("Puppeteer error:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
