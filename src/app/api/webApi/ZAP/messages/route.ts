import { NextResponse } from "next/server";

const zapApiUrl = "http://localhost:8080";

function getMessages(data) {
  const messages = data.messages.map((msg) => {
    const requestLines = msg.requestHeader.split("\r\n");
    const methodUrl = requestLines[0].split(" "); // Extract method & URL
    const responseLines = msg.responseHeader.split("\r\n");
    const statusParts = responseLines[0].split(" "); // Extract status code & reason
    const contentLengthLine = responseLines.find((line) =>
      line.toLowerCase().startsWith("content-length:")
    );

    return {
      id: msg.id,
      request_timestamp: parseInt(msg.timestamp) - parseInt(msg.rtt), // Estimated request timestamp
      response_timestamp: msg.timestamp, // Response timestamp
      method: methodUrl[0], // "GET"
      url: methodUrl[1], // "https://testmyapi.com/sitemap.xml"
      status_code: statusParts[1], // "403"
      reason: statusParts.slice(2).join(" "), // "Forbidden"
      rtt: msg.rtt, // Round Trip Time
      response_header_size: msg.responseHeader.length, // Size of response header
      response_body_size: contentLengthLine
        ? parseInt(contentLengthLine.split(":")[1].trim())
        : msg.responseBody.length, // Size of response body
    };
  });

  return messages;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const baseurl = searchParams.get("baseurl");
    const start = searchParams.get("start") || "0";

    if (!baseurl) {
      return NextResponse.json(
        { message: "Missing base URL" },
        { status: 400 }
      );
    }

    // Fetch messages from ZAP API
    const response = await fetch(
      `${zapApiUrl}/JSON/core/view/messages/?baseurl=${encodeURIComponent(
        baseurl
      )}&start=${start}&count=5`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }

    const data = await response.json();
    const messages = getMessages(data);
    return NextResponse.json({ messages: messages });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Error fetching messages", error: error.message },
      { status: 500 }
    );
  }
}
