"use client";
import { useState } from "react";
import { FiSearch, FiXCircle } from "react-icons/fi";
import { GiElectric } from "react-icons/gi";
import { LuRefreshCw } from "react-icons/lu";
import { Menu } from "@headlessui/react";
import { Input } from "@/components/Input";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  fetchData: (searchType: string) => Promise<void>;
  isLoading: boolean;
}

export default function SearchBar({
  query,
  setQuery,
  fetchData,
  isLoading,
}: SearchBarProps) {
  const [searchType, setSearchType] = useState<string>("URL to attack"); // Default search type
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    // setIsLoading(true);
    await fetchData(searchType);
    // setIsLoading(false);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-950 py-4 rounded-lg flex items-center gap-4 mb-6">
        {/* Input Field */}
        <Input
          type="text"
          placeholder={`Enter ${searchType}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow"
          disabled={isLoading}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <FiXCircle size={24} />
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isLoading || !query}
          className={`flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <span className="animate-spin"><LuRefreshCw /></span>
          ) : (
            <GiElectric size={20} style={{ transform: 'rotate(15deg)' }} />
          )}
          
          {isLoading ? "Attacking...": "Attack"}

        </button>
      </div>
    </>
  );
}
