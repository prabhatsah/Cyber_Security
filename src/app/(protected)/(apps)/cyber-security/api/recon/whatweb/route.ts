// src/app/api/whatweb/route.ts
import { NextResponse } from "next/server";

const parseWhatWebData = (data) => {
  const results = data.result;

  const overview = {};
  const technologies = new Set();
  const headers = {};
  const ipInfo = {};

  for (const item of results) {
    const url = item.url.trim();
    const plugins = item.plugins.map((p) =>
      p.replace(/\x1b\[[0-9;]*m/g, "").trim()
    ); // Remove ANSI escape codes

    if (url === "Title") {
      overview.title = plugins[0].replace(/^:\s*/, "");
    } else if (url === "Status") {
      overview.status = plugins[0].replace(/^:\s*/, "");
    } else if (url === "Summary") {
      plugins.forEach((p) => {
        if (p.includes("nginx")) overview.server = p;
        if (p.includes("Ubuntu Linux")) overview.os = p;
        if (p.includes("RedirectLocation"))
          overview.redirect = p.split("[")[1]?.replace("]", "");
      });
    } else if (url.startsWith("http")) {
      overview.url = url.replace(/\x1b\[[0-9;]*m/g, ""); // Clean ANSI
    } else if (url === "Detected") {
      // ignore
    } else if (url === "[") {
      const tech = plugins[0].replace(/\[|\]/g, "").trim();
      if (tech) technologies.add(tech);
    } else if (url === "IP") {
      ipInfo.ip = plugins[0].replace(/^:\s*/, "");
    } else if (url === "Country") {
      ipInfo.country = plugins[0].replace(/^:\s*/, "");
    } else if (url === "HTTP") {
      // mark start of HTTP Headers
    } else if (url.startsWith("\t")) {
      const [key, ...value] = plugins;
      if (key && value.length > 0) {
        headers[url.trim().replace(":", "")] = value.join(" ");
      } else if (plugins.length === 1 && plugins[0].includes(":")) {
        const [headerKey, ...headerVal] = plugins[0].split(":");
        headers[headerKey.trim()] = headerVal.join(":").trim();
      }
    }
  }

  return {
    domainOverview: overview,
    detectedTechnologies: Array.from(technologies),
    httpResponseHeaders: headers,
    ipGeolocation: ipInfo,
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("target");

  if (!target) {
    return NextResponse.json({ error: "Missing target" }, { status: 400 });
  }

  // const res = await fetch(`http://192.168.121.128:5000/whatweb?target=${target}`);
  const res = await fetch(
    `${process.env.KALI_LINUX_IP}/whatweb?target=${target}`
  );
  const data = await res.json();

  return NextResponse.json(data);
}
