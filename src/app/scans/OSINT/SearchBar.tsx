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
          placeholder="URL, IP address, or domain"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow "
        />

        {/* Dropdown for search type */}
        {/* <Menu as="div" className="relative inline-block text-left">
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
        
        {query && (
          <button
            onClick={handleClear}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <FiXCircle size={24} />
          </button>
        )} */}

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
