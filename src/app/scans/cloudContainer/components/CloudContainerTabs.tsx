"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Cloud",
    href: "/scans/cloudContainer/cloud",
  },
  {
    name: "Container",
    href: "/scans/cloudContainer/containers",
  },
];

export default function CloudContainerTabs() {
  const pathname = usePathname();

  return (
    <>
      <div className="w-full">
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-x-2.5 text-lg font-semibold px-10 py-2
                    ${
                      pathname.includes(item.href)
                        ? "border-b-2 border-primary text-primary"
                        : "text-gray-700 dark:text-gray-400 hover:text-primary hover:dark:text-primary"
                    }
                    `}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
