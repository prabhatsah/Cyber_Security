"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Scan,
  FileText,
  Settings,
  Shield,
  Activity,
  PackageCheck,
  CloudCog,
  Network,
  PackageOpen,
  ShieldCheck,
  BugPlay,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { RiArrowDownSLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { Button } from "@tremor/react";
import { AiFillAlert } from "react-icons/ai";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vulnerability Scans", href: "/scans", icon: Scan },
  { name: "PenTest", href: "/pen-test", icon: BugPlay },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Audit Log", href: "/audit", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
  {
    name: "Configuration",
    icon: PackageCheck,
    submenus: [
      {
        name: "Cloud Services",
        href: "/configuration/cloud-services",
        icon: CloudCog,
      },
      {
        name: "Network Services",
        href: "/configuration/network-services",
        icon: Network,
      },
      {
        name: "Container Tools",
        href: "/configuration/container-tools",
        icon: PackageOpen,
      },
      {
        name: "Endpoint Tools",
        href: "/configuration/endpoint-tools",
        icon: ShieldCheck,
      },
    ],
  },
  { name: "Ai Agent", href: "/ai-agent", icon: AiFillAlert },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="hidden lg:flex lg:flex-shrink-0 h-full">
      <div
        className={cn(
          "flex flex-col transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 relative",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          <div className={cn(
            "flex items-center px-4 mb-6 pt-5",
            collapsed && "justify-center px-2"
          )}>
            <Shield className="h-8 w-8 text-primary flex-shrink-0" />
            {!collapsed && (
              <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white truncate">
                SecureGuard
              </h1>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 z-50"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>

          <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenus ? (
                  <details className="group">
                    <summary className={cn(
                      "flex items-center justify-between py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 hover:dark:text-gray-50 hover:dark:bg-gray-800 cursor-pointer",
                      collapsed ? "px-2" : "px-3"
                    )}>
                      <div className={cn(
                        "flex items-center",
                        collapsed && "justify-center w-full"
                      )}>
                        <item.icon className={cn(
                          "h-5 w-5 flex-shrink-0",
                          collapsed ? "mr-0" : "mr-3"
                        )} />
                        {!collapsed && item.name}
                      </div>
                      {!collapsed && (
                        <RiArrowDownSLine className="h-4 w-4 transition-transform group-open:rotate-180" />
                      )}
                    </summary>
                    <div className={cn(
                      "mt-1 space-y-1",
                      collapsed ? "ml-0" : "ml-8"
                    )}>
                      {item.submenus.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          title={collapsed ? sub.name : ""}
                          className={cn(
                            "flex items-center py-2 text-sm rounded-md",
                            collapsed ? "px-2 justify-center" : "px-3 gap-x-2.5",
                            pathname.includes(sub.href)
                              ? "bg-primary text-gray-50"
                              : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 hover:dark:text-gray-50 hover:dark:bg-gray-800"
                          )}
                        >
                          <sub.icon className={cn(
                            "h-5 w-5 flex-shrink-0",
                            collapsed ? "mr-0" : "mr-3"
                          )} />
                          {!collapsed && sub.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    href={item.href}
                    title={collapsed ? item.name : ""}
                    className={cn(
                      "flex items-center text-sm font-medium py-2 rounded-md",
                      collapsed ? "px-2 justify-center" : "px-3 gap-x-2.5",
                      pathname.includes(item.href)
                        ? "bg-primary text-gray-50"
                        : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 hover:dark:text-gray-50 hover:dark:bg-gray-800"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        collapsed ? "mr-0" : "mr-3"
                      )}
                      aria-hidden="true"
                    />
                    {!collapsed && item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}