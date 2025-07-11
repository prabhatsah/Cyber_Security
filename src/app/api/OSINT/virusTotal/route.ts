// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";

// // Helper function to extract the bare domain from a URL
// function extractDomain(url: string): string | null {
//   try {
//     const parsedUrl = new URL(url);
//     return parsedUrl.hostname;
//   } catch (error) {
//     return null;
//   }
// }

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const input = searchParams.get("domain");

//   // Validate input
//   if (!input) {
//     return NextResponse.json({ error: "Domain is required" }, { status: 400 });
//   }

//   // Extract the bare domain from the input (handles both URLs and bare domains)
//   const domain = extractDomain(input) || input;

//   try {
//     // Fetch domain intelligence from VirusTotal
//     const response = await axios.get(
//       `https://www.virustotal.com/api/v3/domains/${domain}`,
//       {
//         headers: {
//           "x-apikey": process.env.VIRUSTOTAL_API_KEY as string,
//         },
//       }
//     );

//     // Return the response data
//     return NextResponse.json(response.data, { status: 200 });
//   } catch (error: any) {
//     console.error("Error fetching domain intelligence:", error);

//     // Handle errors gracefully
//     const errorMessage =
//       error.response?.data?.error?.message ||
//       "Failed to fetch domain intelligence";
//     const statusCode = error.response?.status || 500;

//     return NextResponse.json({ error: errorMessage }, { status: statusCode });
//   }
// }

// app/api/threats/domain/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Function to check if input is a valid IP address
function isIPAddress(input: string): boolean {
  const ipRegex =
    /^(?:\d{1,3}\.){3}\d{1,3}$|^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;
  return ipRegex.test(input);
}

// Extracts the domain from a URL, or returns the input if it's not a URL
function extractDomainOrIP(input: string): string | null {
  try {
    const parsedUrl = new URL(input);
    return parsedUrl.hostname; // Extracts domain (e.g., "example.com" from "https://example.com")
  } catch (error) {
    return input; // If not a URL, return the input as is (for direct domain/IP input)
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("query"); // Change "domain" to "query" to support both domains & IPs

  // Validate input
  if (!input) {
    return NextResponse.json(
      { error: "Domain or IP is required" },
      { status: 400 }
    );
  }

  // Extract domain or IP
  const extractedValue = extractDomainOrIP(input);

  // Determine if the input is an IP address or a domain
  const isIP = isIPAddress(extractedValue);

  // Select the appropriate VirusTotal API endpoint
  const endpoint = isIP
    ? `https://www.virustotal.com/api/v3/ip_addresses/${extractedValue}`
    : `https://www.virustotal.com/api/v3/domains/${extractedValue}`;

  try {
    // Fetch data from VirusTotal
    const response = await axios.get(endpoint, {
      headers: {
        "x-apikey": process.env.VIRUSTOTAL_API_KEY as string,
      },
    });

    // Return the VirusTotal API response
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching intelligence:", error);

    // Handle errors gracefully
    const errorMessage =
      error.response?.data?.error?.message ||
      "Failed to fetch data from VirusTotal";
    const statusCode = error.response?.status || 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
