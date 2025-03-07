"use client";
import { Bell, Sun, Moon } from "lucide-react";
import GenericBreadcrumb from "./GenericBreadcrumb";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex justify-between items-center py-2 px-6">
        <div className="sticky top-0 z-10 py-2 px-4">
          <GenericBreadcrumb />
        </div>
        <div className="flex items-center space-x-4 relative">
          {/* Dark Mode Toggle */}
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
            whileTap={{ scale: 0.9 }}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            ) : (
              <Moon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            )}
          </motion.button>
          <button
            type="button"
            className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error transform translate-x-1/2 -translate-y-1/2"></span>
          </button>

          <div className="relative">
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <div className="hidden md:flex flex-col ml-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Demo User
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
