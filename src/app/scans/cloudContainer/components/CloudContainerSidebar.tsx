"use client";
import { CloudCog, PackageOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Cloud",
    href: "/scans/cloudContainer/cloud",
    icon: CloudCog,
  },
  {
    name: "Container",
    href: "/scans/cloudContainer/containers",
    icon: PackageOpen,
  },
];

export default function CloudContainerSidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow overflow-y-auto border-gray-500 dark:border-gray-800 bg-white dark:bg-gray-950">
            <nav className="flex-1 p-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-x-2.5 text-sm font-medium px-3 py-2 rounded-md
                    ${
                      pathname.includes(item.href)
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
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
