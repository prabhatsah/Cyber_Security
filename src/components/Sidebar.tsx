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
  PackageCheck,
  CloudCog,
  Network,
  PackageOpen,
  ShieldCheck,
} from "lucide-react";
import { RiArrowDownSLine } from "@remixicon/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Scans", href: "/scans", icon: Scan },
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
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:flex-shrink-0 h-full">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="flex items-center  px-4 ">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
              SecureGuard
            </h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenus ? (
                  <details className="group">
                    <summary className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 hover:dark:text-gray-50 hover:dark:bg-gray-800 cursor-pointer">
                      <div className="flex items-center gap-x-2.5">
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.name}
                      </div>
                      <RiArrowDownSLine className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenus.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`flex items-center gap-x-2.5 px-3 py-2 text-sm rounded-md
                            ${pathname.includes(sub.href)
                              ? "bg-primary text-gray-50"
                              : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 hover:dark:text-gray-50 hover:dark:bg-gray-800"
                            }
                          `}
                        >
                          <sub.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-x-2.5 text-sm font-medium px-3 py-2 rounded-md
                      ${pathname.includes(item.href)
                        ? "bg-primary text-gray-50"
                        : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 hover:text-gray-900 hover:dark:text-gray-50 hover:dark:bg-gray-800"
                      }
                      `}
                  >
                    <item.icon
                      className="mr-3 h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          {/* <div className="mt-auto px-4 py-4">
            <div className="bg-secondary rounded-lg p-4">
              <h3 className="text-sm font-medium">Need Help?</h3>
              <p className="mt-2 text-xs text-gray-500">
                Contact our support team for assistance with your security
                assessments.
              </p>
              <button className="mt-3 w-full btn-primary">
                Contact Support
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
