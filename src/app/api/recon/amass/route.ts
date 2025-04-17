// src/app/api/recon/amass/route.ts (for Next.js 13/14 with app router)

import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json(
      { error: "Missing domain parameter" },
      { status: 400 }
    );
  }

  try {
    // Use passive mode for speed, or remove -passive if you want full recon
    const { stdout } = await execAsync(`amass enum -passive -d ${domain}`);
    return NextResponse.json({ output: stdout });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to run amass" },
      { status: 500 }
    );
  }
}
