"use client";
import { CloudCog, Network, PackageOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
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
    name: "Container Services",
    href: "/configuration/container-services",
    icon: PackageOpen,
  },
];

export default function ConfigSidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-50 dark:bg-gray-900">
          <div
            className="flex flex-col flex-grow overflow-y-auto  border-r 
        border-gray-200 "
          >
            <nav className="p-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                    //pathname === item.href
                    pathname.includes(item.href)
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
          </div>
        </div>
      </div>
    </>
  );
}
