// app/api/threats/domain/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Helper function to extract the bare domain from a URL
function extractDomain(url: string): string | null {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname; // Extracts the domain (e.g., "mail.google.com")
    } catch (error) {
        return null; // Return null if the URL is invalid
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const input = searchParams.get("domain");

    // Validate input
    if (!input) {
        return NextResponse.json(
            { error: "Domain is required" },
            { status: 400 }
        );
    }

    // Extract the bare domain from the input (handles both URLs and bare domains)
    const domain = extractDomain(input) || input;

    try {
        // Fetch domain intelligence from VirusTotal
        const response = await axios.get(
            `https://www.virustotal.com/api/v3/domains/${domain}`,
            {
                headers: {
                    "x-apikey": process.env.VIRUSTOTAL_API_KEY as string,
                },
            }
        );

        // Return the response data
        return NextResponse.json(response.data, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching domain intelligence:", error);

        // Handle errors gracefully
        const errorMessage =
            error.response?.data?.error?.message ||
            "Failed to fetch domain intelligence";
        const statusCode = error.response?.status || 500;

        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}