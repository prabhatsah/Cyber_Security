"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Scan,
  FileText,
  Settings,
  Shield,
  Activity,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Scans", href: "/scans", icon: Scan },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Audit Log", href: "/audit", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-secondary">
        <div
          className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto  border-r 
        border-gray-200 "
        >
          <div className="flex items-center flex-shrink-0 px-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">
              SecureGuard
            </h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-300 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto px-4 py-4">
            <div className="bg-secondary rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900">Need Help?</h3>
              <p className="mt-2 text-xs text-gray-500">
                Contact our support team for assistance with your security
                assessments.
              </p>
              <button className="mt-3 w-full btn-primary">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
