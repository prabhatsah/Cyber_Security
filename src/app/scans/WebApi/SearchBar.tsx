"use client";
import { useState } from "react";
import { FiSearch, FiXCircle } from "react-icons/fi";
import { Menu } from "@headlessui/react";

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
      <div className="bg-white py-4 rounded-lg flex items-center gap-4 mb-6">
        {/* Input Field */}
        <input
          type="text"
          placeholder={`Enter ${searchType}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <span className="animate-spin">🔄</span>
          ) : (
            <FiSearch size={20} />
          )}
          Search
        </button>
      </div>
    </>
  );
}
