"use client";
import { useState } from "react";
import { FiSearch, FiXCircle } from "react-icons/fi";
import { Menu } from "@headlessui/react";
import { LuRefreshCw } from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { GiElectric } from "react-icons/gi";

interface SearchBarProps {
    query: string;
    setQuery: (query: string) => void;
    fetchData: (searchType: string) => Promise<void>;
}

export default function SearchBar({
    query,
    setQuery,
    fetchData,
}: SearchBarProps) {
    const [searchType, setSearchType] = useState<string>("domain"); // Default search type
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async () => {
        setIsLoading(true);
        await fetchData(searchType);
        setIsLoading(false);
    };

    const handleClear = () => {
        setQuery("");
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-950 py-4 rounded-lg flex items-center gap-4">
                {/* Input Field */}
                <Input
                    type="text"
                    placeholder="Enter a File Path"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-grow "
                />

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    disabled={isLoading || !query}
                    className={`flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {isLoading ? (
                        <span className="animate-spin"><LuRefreshCw /></span>
                    ) : (
                        <GiElectric size={20} style={{ transform: 'rotate(15deg)' }} />
                    )}
                    {isLoading ? "Scanning..." : "Scan"}
                </button>
            </div>

        </>
    );
}
