// src/app/api/nmap/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "Missing target" }, { status: 400 });
  }

  // const res = await fetch(`http://192.168.121.128:5000/amass?domain=${domain}`);
  const res = await fetch(`${process.env.KALI_LINUX_IP}/amass?domain=${domain}`);
  console.log("amass response");
  const data = await res.json();

  return NextResponse.json(data);
}
