"use client";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"
import { RiCloudFill } from "@remixicon/react";
import { Box } from 'lucide-react';
import { useState } from "react";

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
  console.log(pathname)
  const [selectedTab, setSelectedTab] = useState("cloud");

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    redirect(`/scans/cloudContainer/${value}`)
  };

  return (
    <>
      {/* <div className="w-full">
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
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
      </div> */}


      {pathname.substring(pathname.lastIndexOf('/') + 1) === 'container' || pathname.substring(pathname.lastIndexOf('/') + 1) === 'cloud' ? (<Tabs defaultValue="cloud" value={selectedTab} onValueChange={handleTabChange}>
        <TabsList variant="solid" className="">
          <TabsTrigger value="cloud" className="gap-1.5 flex ">
            <RiCloudFill className="-ml-1 size-4" aria-hidden="true" />
            Cloud
          </TabsTrigger>
          <TabsTrigger value="container" className="gap-1.5 flex " >
            <Box className="-ml-1 size-4" aria-hidden="true" />
            Container
          </TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="cloud">
            <div>

            </div>
          </TabsContent>
          <TabsContent value="container">
            <div>

            </div>
          </TabsContent>
        </div>
      </Tabs>) : null}
    </>
  );
}