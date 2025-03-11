"use client";

import { usePathname } from "next/navigation";
import { TabArray, TabProps } from "./type";
import {
  Tabs as TabsComp,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shadcn/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { TextButton } from "@/ikon/components/buttons";
import { Card } from "@/shadcn/ui/card";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/shadcn/hooks/use-mobile";

export default function Tabs({
  children,
  tabArray,
  tabListClass = "",
  tabListInnerClass = "",
  tabListButtonClass = "",
  tabContentClass = "",
  headerEndComponent,
  onTabChange,
  isSeperatePage = false,
}: TabProps) {
  const pathName = usePathname();
  const [itemToDisplay, setItemToDisplay] = useState<number>(5);
  const isMobile = useIsMobile();
  const [visibleTabs, setVisibleTabs] = useState<TabArray[]>([]);
  const [groupedTabs, setGroupedTabs] = useState<TabArray[]>([]);
  const [activeTab, setActiveTab] = useState<string>(
    tabArray.find((tab) => tab.default)?.tabId || tabArray[0]?.tabId || ""
  );

  useEffect(() => {
    setItemToDisplay(isMobile ? 2 : 5);
  }, [isMobile]);

  useEffect(() => {
    if (pathName && isSeperatePage) {
      const lastPath = pathName.split("/").pop() || "";
      setActiveTab(lastPath);
    }
  }, [pathName, isSeperatePage]);

  useEffect(() => {
    setVisibleTabs(tabArray.slice(0, itemToDisplay));
    setGroupedTabs(tabArray.slice(itemToDisplay));
  }, [tabArray, itemToDisplay]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handleGroupedTabSelect = (tab: TabArray) => {
    setVisibleTabs((prev) => {
      const updatedTabs = [...prev];
      const replacedTab = updatedTabs.pop();
      if (replacedTab) {
        setGroupedTabs((prevGrouped) => [
          ...prevGrouped.filter((t) => t.tabId !== tab.tabId),
          replacedTab,
        ]);
      }
      return [...updatedTabs, tab];
    });
    handleTabChange(tab.tabId);
  };

  return (
    <TabsComp
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full h-full flex flex-col"
    >
      <TabsList className={`flex justify-between items-center ${tabListClass}`}>
        <div className={`flex w-full ${tabListInnerClass}`}>
          {visibleTabs.map((tab) => (
            <TabsTrigger
              key={tab.tabId}
              value={tab.tabId}
              className={tabListButtonClass}
            >
              {tab.tabName}
            </TabsTrigger>
          ))}
          {groupedTabs.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TextButton variant="ghost">
                  <Ellipsis />
                </TextButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {groupedTabs.map((tab) => (
                  <DropdownMenuItem
                    key={tab.tabId}
                    onClick={() => handleGroupedTabSelect(tab)}
                  >
                    {tab.tabName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {headerEndComponent && <div>{headerEndComponent}</div>}
      </TabsList>
      {children ? (
        <TabsContent
          value={activeTab}
          className={`mt-3 flex-grow overflow-auto h-full w-full ${tabContentClass}`}
        >
            <Card className="h-full w-full p-3">{children}</Card>
        </TabsContent>
      ) : (
        tabArray.map((tab) => (
          <TabsContent
            value={tab.tabId}
            key={tab.tabId}
            className={`mt-3 flex-grow overflow-auto h-full w-full ${tabContentClass}`}
          >
            
              <Card className="h-full w-full p-3">{tab?.tabContent}</Card>
          </TabsContent>
        ))
      )}
    </TabsComp>
  );
}
