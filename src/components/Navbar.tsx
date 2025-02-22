"use client";
import { Bell } from "lucide-react";
import GenericBreadcrumb from "./GenericBreadcrumb";

export default function Navbar() {
  return (
    <header className=" border-b border-gray-200">
      <div className="flex justify-between items-center py-2 px-6 ">
        <div className="sticky top-0 z-10 py-2 px-4">
          <GenericBreadcrumb />
        </div>
        <div className="flex items-center space-x-4">
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
                <span className="text-sm font-medium text-gray-700">
                  Demo User
                </span>
                <span className="text-xs text-gray-500">Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
