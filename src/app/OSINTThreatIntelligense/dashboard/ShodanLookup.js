"use client";
import { useState } from "react";

export default function ShodanLookup() {
    const [ip, setIp] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchShodanData = async () => {
        setError(null);
        setData(null);
        try {
            const response = await fetch(`/api/shodan?ip=${ip}`);
            const result = await response.json();
            if (result.error) throw new Error(result.error);
            setData(result);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-white shadow">
            <h2 className="text-xl font-bold">Shodan IP Lookup</h2>
            <input
                type="text"
                placeholder="Enter IP address"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="border p-2 rounded w-full"
            />
            <button onClick={fetchShodanData} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded">
                Search
            </button>

            {error && <p className="text-red-500">{error}</p>}

            {data && (
                <div className="mt-4">
                    <p><strong>ISP:</strong> {data.isp}</p>
                    <p><strong>Organization:</strong> {data.org}</p>
                    <p><strong>City:</strong> {data.city}</p>
                    <p><strong>Country:</strong> {data.country_name}</p>
                    <p><strong>Open Ports:</strong> {data.ports?.join(", ")}</p>
                </div>
            )}
        </div>
    );
}
