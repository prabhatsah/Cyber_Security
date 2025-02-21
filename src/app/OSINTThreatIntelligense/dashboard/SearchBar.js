"use client";
import { useState } from "react";

export default function SearchBar({ setOsintData }) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/osint?query=${query}`);
            const result = await response.json();
            if (result.error) throw new Error(result.error);
            setOsintData(result);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex gap-4 mb-6">
            <input
                type="text"
                placeholder="Enter IP, Domain, or URL"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border p-2 rounded w-full"
            />
            <button onClick={fetchData} className="bg-green-600 text-white px-4 py-2 rounded">
                {loading ? "Loading..." : "Search"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
