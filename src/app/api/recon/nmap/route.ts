// src/app/api/nmap/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("target");

  if (!target) {
    return NextResponse.json({ error: "Missing target" }, { status: 400 });
  }

  const res = await fetch(`http://192.168.32.128:5000/nmap?target=${target}`);
  const data = await res.json();

  return NextResponse.json(data);
}
