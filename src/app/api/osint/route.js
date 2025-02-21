import { NextResponse } from "next/server";

const SHODAN_API_KEY = process.env.SHODAN_API_KEY;
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;
const ABUSEIPDB_API_KEY = process.env.ABUSEIPDB_API_KEY;
const GREYNOISE_API_KEY = process.env.GREYNOISE_API_KEY;
const IPINFO_API_KEY = process.env.IPINFO_API_KEY;

async function fetchShodanData(query) {
    //Check if the query is an IP (Shodan free API does not support domain lookups)
    if (!/^\d+\.\d+\.\d+\.\d+$/.test(query)) {
        return { error: "Shodan only supports IP lookups in the free API." };
    }

    const url = `https://api.shodan.io/shodan/host/${query}?key=${SHODAN_API_KEY}`;
    try {
        const response = await fetch(url);
        console.log("response - " + response);
        if (!response.ok) throw new Error("Shodan API Error");
        return await response.json();
    } catch (error) {
        console.error("Shodan Error:", error);
        return { error: "Shodan data unavailable" };
    }
}

async function fetchVirusTotalData(query) {
    const url = `https://www.virustotal.com/api/v3/domains/${query}`;
    try {
        const response = await fetch(url, {
            headers: { "x-apikey": VIRUSTOTAL_API_KEY },
        });
        if (!response.ok) throw new Error("VirusTotal API Error");
        return await response.json();
    } catch (error) {
        console.error("VirusTotal Error:", error);
        return { error: "VirusTotal data unavailable" };
    }
}

// async function fetchAbuseIPDBData(query) {
//     if (!/^\d+\.\d+\.\d+\.\d+$/.test(query)) {
//         return { error: "AbuseIPDB only supports IP lookups." };
//     }

//     const url = `https://api.abuseipdb.com/api/v2/check?ipAddress=${query}`;
//     try {
//         const response = await fetch(url, {
//             headers: { "Key": ABUSEIPDB_API_KEY, "Accept": "application/json" },
//         });
//         if (!response.ok) throw new Error("AbuseIPDB API Error");
//         return await response.json();
//     } catch (error) {
//         console.error("AbuseIPDB Error:", error);
//         return { error: "AbuseIPDB data unavailable" };
//     }
// }


// async function fetchGreyNoiseData(query) {
//     try {
//         const controller = new AbortController();
//         const timeout = setTimeout(() => controller.abort(), 10000); // 10-second timeout

//         const response = await fetch(`https://api.greynoise.io/v3/community/${query}`, {
//             headers: { "key": GREYNOISE_API_KEY },
//             signal: controller.signal,
//         });

//         clearTimeout(timeout);
//         if (!response.ok) throw new Error("GreyNoise API Error");
//         return await response.json();
//     } catch (error) {
//         console.error("GreyNoise Error:", error);
//         return { error: "GreyNoise data unavailable (possibly timed out)." };
//     }
// }

// async function fetchIPInfoData(query) {
//     try {
//         const controller = new AbortController();
//         const timeout = setTimeout(() => controller.abort(), 10000); // 10-second timeout

//         const response = await fetch(`https://ipinfo.io/${query}/json?token=${IPINFO_API_KEY}`, {
//             signal: controller.signal,
//         });

//         clearTimeout(timeout);
//         if (!response.ok) throw new Error("IPInfo API Error");
//         return await response.json();
//     } catch (error) {
//         console.error("IPInfo Error:", error);
//         return { error: "IPInfo data unavailable (possibly timed out)." };
//     }
// }


export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const responses = await Promise.allSettled([
        fetchShodanData(query),
        fetchVirusTotalData(query),
        // fetchAbuseIPDBData(query),
        // fetchGreyNoiseData(query),
        // fetchIPInfoData(query),
    ]);

    return NextResponse.json({
        query,
        shodan: responses[0].status === "fulfilled" ? responses[0].value : { error: "Shodan failed" },
        virustotal: responses[1].status === "fulfilled" ? responses[1].value : { error: "VirusTotal failed" },
        // abuseipdb: responses[2].status === "fulfilled" ? responses[2].value : { error: "AbuseIPDB failed" },
        // greynoise: responses[3].status === "fulfilled" ? responses[3].value : { error: "GreyNoise failed" },
        // ipinfo: responses[4].status === "fulfilled" ? responses[4].value : { error: "IPInfo failed" },
    });
}

