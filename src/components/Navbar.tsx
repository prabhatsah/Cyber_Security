"use client";
import { Bell, Sun, Moon, ChevronsUpDown } from "lucide-react";
import GenericBreadcrumb from "./GenericBreadcrumb";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AppBreadcrumb from "./app-breadcrumb";

import { cx, focusRing } from "@/lib/utils";
import { Button } from "@tremor/react";
import { DropdownUserProfile } from "./dropdownuserprofile";
import { getProfileData } from "@/ikon/utils/actions/auth";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);
  const [profileData, setProfileData] = useState({})
  async function logindata() {
    try {
      const profile = await getProfileData()
      setProfileData(profile)
    } catch (error) {
      console.error(error)
    }

  }
  useEffect(() => {
    logindata();
  }, [])
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
          {/* <GenericBreadcrumb /> */}
          <AppBreadcrumb />
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
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error transform translate-x-1/2 -translate-y-1/2"></span>
          </button>

          <div className="relative">
            <div className="flex items-center">
              <DropdownUserProfile profileData={profileData}>
                <button
                  aria-label="User settings"
                  // variant="ghost"
                  className={cx(
                    "group flex gap-2 w-full items-center justify-between rounded-md px-1 py-2 text-sm font-medium  hover:bg-gray-200/50 data-[state=open]:bg-gray-200/50 hover:dark:bg-gray-800/50 data-[state=open]:dark:bg-gray-900",
                    focusRing,
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                      aria-hidden="true"
                    >
                      {profileData?.USER_THUMBNAIL}
                    </span>
                    <span>{profileData?.USER_NAME}</span>
                  </span>
                  <ChevronsUpDown
                    className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-hover:dark:text-gray-400"
                    aria-hidden="true"
                  />
                </button>
              </DropdownUserProfile  >
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
