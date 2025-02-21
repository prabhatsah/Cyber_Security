"use client";
import { useState } from "react";
import { FiSearch, FiXCircle } from "react-icons/fi";
import { Menu } from "@headlessui/react";

export default function SearchBar({ query, setQuery, fetchData }) {
  const [searchType, setSearchType] = useState("domain"); // Default search type
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    await fetchData(searchType);
    setIsLoading(false);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-4 mb-6">
      {/* Dropdown for search type */}
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          {searchType.toUpperCase()}
        </Menu.Button>
        <Menu.Items className="absolute mt-2 w-32 bg-white shadow-lg rounded-lg z-10">
          {["domain", "ip", "email"].map((type) => (
            <Menu.Item key={type}>
              {({ active }) => (
                <button
                  onClick={() => setSearchType(type)}
                  className={`block px-4 py-2 w-full text-left ${
                    active ? "bg-blue-100" : "text-gray-700"
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>

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
  );
}
