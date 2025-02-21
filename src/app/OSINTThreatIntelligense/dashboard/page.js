"use client";
import { useState } from "react";
import SearchBar from "./SearchBar";
import Widgets from "./Widgets";
import MapView from "./MapView";
import DetailsTable from "./DetailsTable";

export default function Dashboard() {
    const [osintData, setOsintData] = useState(null);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">OSINT & Threat Intelligence Dashboard</h1>
            <SearchBar setOsintData={setOsintData} />
            {osintData && (
                <>
                    <Widgets data={osintData} />
                    <MapView data={osintData} />
                    <DetailsTable data={osintData} />
                </>
            )}
        </div>
    );
}
