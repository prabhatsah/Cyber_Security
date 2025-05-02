// src/app/api/nmap/route.ts
import { NextResponse } from "next/server";

const parseDnsData = (lines) => {
  const result = [];

  lines.forEach((line) => {
    const regex = /^(.*?) \((.*?)\) --> (.*?) --> (.*?) \((.*?)\)$/;
    const match = line.match(regex);

    if (match) {
      const [, source, source_type, relation, target, target_type] = match;

      result.push({
        source: source.trim(),
        source_type: source_type.trim(),
        relation: relation.trim(),
        target: target.trim(),
        target_type: target_type.trim(),
      });
    } else {
      // Fallback parser for simpler cases (like ASN to Netblock relationships)
      const fallbackRegex = /^(.*?) --> (.*?) --> (.*?)$/;
      const fallbackMatch = line.match(fallbackRegex);

      if (fallbackMatch) {
        const [, source, relation, target] = fallbackMatch;

        result.push({
          source: source.trim(),
          relation: relation.trim(),
          target: target.trim(),
        });
      } else {
        console.warn("Unrecognized format:", line);
      }
    }
  });

  return result;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("target");

  if (!target) {
    return NextResponse.json({ error: "Missing target" }, { status: 400 });
  }
  // const res = await fetch(`http://192.168.121.128:5000/nmap?target=${target}`);
  const res = await fetch(`${process.env.KALI_LINUX_IP}/nmap?target=${target}`);
  const data = await res.json();

  return NextResponse.json(data);
}
