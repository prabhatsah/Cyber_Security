export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
        return new Response(JSON.stringify({ error: "Search query is required" }), { status: 400 });
    }

    try {
        const response = await fetch(`https://api.shodan.io/shodan/host/${query}?key=YOUR_SHODAN_API_KEY`);
        if (!response.ok) throw new Error("Shodan API error");

        const data = await response.json();

        return new Response(JSON.stringify({
            ip: data.ip_str || "N/A",
            isp: data.isp || "Unknown",
            org: data.org || "Unknown",
            country: data.country_name || "Unknown",
            city: data.city || "Unknown",
            asn: data.asn || "Unknown",
            domains: data.domains || [],
            hostnames: data.hostnames || [],
            open_ports: data.ports || [],
            vulnerabilities: data.vulns || [],
            last_update: data.last_update || "N/A",
            os: data.os || "Unknown",
            timezone: data.timezone || "Unknown",
            services: data.data || [],
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            ssl_cert: data.ssl || {},
            dns: data.dns || {},
            tags: data.tags || [],
            banner_data: data.data || [],
        }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
