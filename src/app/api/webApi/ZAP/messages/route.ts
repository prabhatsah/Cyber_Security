// import { NextResponse } from "next/server";

// const zapApiUrl = "http://localhost:8080";

// function getMessages(data) {
//   const messages = data.messages.map((msg) => {
//     const requestLines = msg.requestHeader.split("\r\n");
//     const methodUrl = requestLines[0].split(" "); // Extract method & URL
//     const responseLines = msg.responseHeader.split("\r\n");
//     const statusParts = responseLines[0].split(" "); // Extract status code & reason
//     const contentLengthLine = responseLines.find((line) =>
//       line.toLowerCase().startsWith("content-length:")
//     );

//     return {
//       id: msg.id,
//       request_timestamp: parseInt(msg.timestamp) - parseInt(msg.rtt), // Estimated request timestamp
//       response_timestamp: msg.timestamp, // Response timestamp
//       method: methodUrl[0], // "GET"
//       url: methodUrl[1], // "https://testmyapi.com/sitemap.xml"
//       status_code: statusParts[1], // "403"
//       reason: statusParts.slice(2).join(" "), // "Forbidden"
//       rtt: msg.rtt, // Round Trip Time
//       response_header_size: msg.responseHeader.length, // Size of response header
//       response_body_size: contentLengthLine
//         ? parseInt(contentLengthLine.split(":")[1].trim())
//         : msg.responseBody.length, // Size of response body
//     };
//   });

//   return messages;
// }

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const baseurl = searchParams.get("baseurl");
//     const start = searchParams.get("start") || "0";

//     if (!baseurl) {
//       return NextResponse.json(
//         { message: "Missing base URL" },
//         { status: 400 }
//       );
//     }

//     // Fetch messages from ZAP API
//     const response = await fetch(
//       `${zapApiUrl}/JSON/core/view/messages/?baseurl=${encodeURIComponent(
//         baseurl
//       )}&start=${start}&count=5`
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to fetch messages: ${response.statusText}`);
//     }

//     const data = await response.json();
//     const messages = getMessages(data);
//     return NextResponse.json({ messages: messages });
//   } catch (error: any) {
//     console.error("Error fetching messages:", error);
//     return NextResponse.json(
//       { message: "Error fetching messages", error: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

const zapApiUrl = "https://ikoncloud-dev.keross.com/scan";

function formatTimestamp(timestamp: string | number | null) {
  if (!timestamp) return "N/A";

  const date = new Date(parseInt(timestamp));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2 digits
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getMessages(data: any) {
  if (!data?.messages || !Array.isArray(data.messages)) return [];

  return data.messages.map((msg: any) => {
    const requestLines = msg?.requestHeader?.split("\r\n") || [];
    const methodUrl = requestLines[0]?.split(" ") || ["UNKNOWN", "UNKNOWN"];

    const responseLines = msg?.responseHeader?.split("\r\n") || [];
    const statusParts = responseLines[0]?.split(" ") || ["UNKNOWN", "000"];

    const contentLengthLine = responseLines.find((line: string) =>
      line.toLowerCase().startsWith("content-length:")
    );

    // Convert timestamps
    const responseTimestamp = msg?.timestamp ?? null;
    const requestTimestamp = responseTimestamp
      ? parseInt(responseTimestamp) - parseInt(msg?.rtt || "0")
      : null;

    return {
      id: msg?.id ?? "N/A",
      request_timestamp: formatTimestamp(requestTimestamp), // Custom format
      response_timestamp: formatTimestamp(responseTimestamp), // Custom format
      method: methodUrl[0], // "GET"
      url: methodUrl[1], // "https://testmyapi.com/sitemap.xml"
      status_code: statusParts[1], // "403"
      reason: statusParts.slice(2).join(" ") || "Unknown",
      rtt: msg?.rtt ?? 0, // Round Trip Time
      response_header_size: msg?.responseHeader?.length || 0, // Size of response header
      response_body_size: contentLengthLine
        ? parseInt(contentLengthLine.split(":")[1].trim())
        : msg?.responseBody?.length || 0, // Size of response body
    };
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const baseurl = searchParams.get("baseurl");
    const start = searchParams.get("start") || "0";
    // const count = searchParams.get("count") || "5"; // Allow dynamic count

    console.log("inside fetch messages api");

    if (!baseurl) {
      return NextResponse.json(
        { message: "Missing base URL" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${zapApiUrl}/JSON/core/view/messages/?baseurl=${encodeURIComponent(
        baseurl
      )}&start=${start}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: `Failed to fetch messages: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ messages: getMessages(data) });
  } catch (error: unknown) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Error fetching messages", error: (error as Error).message },
      { status: 500 }
    );
  }
}
