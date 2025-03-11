'use client';
import { createSideMenu } from "@/ikon/components/side-menu-items";

// Sidebar Components (Assuming these are imported)
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/shadcn/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/shadcn/ui/collapsible';
import { redirect } from 'next/navigation';
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

export default function DocumentSidebar(documentData: any) {
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    const items = createSideMenu(documentData);
    setMenuItems(items);
  }, []);

  const [rotated, setRotated] = useState<{ [key: number]: boolean }>({});

  const handleIconClick = (idx: number) => {
    setRotated(prevState => ({
      ...prevState,
      [idx]: !prevState[idx]
    }));
  };
  return (
    <>
      {/* <SidebarMenu className='border-r h-full w-64 p-4 overflow-y-auto'>
        {menuItems.map((menu: any, idx: any): any => (
          <Collapsible key={idx} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <ChevronRight />
              </CollapsibleTrigger>
                <SidebarMenuButton className="text-md flex items-center whitespace-nowrap overflow-hidden"
                  onClick={() => {
                    // if (menu.title !== "My Drive")
                      redirect(menu.href)
                  }}
                >
                  <menu.iconClass className="mr-2" />
                  <span className="truncate">{menu.title}</span>
                </SidebarMenuButton>
              {menu.submenu.length > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {menu.submenu.map((subItem: any, subIdx: any) => (
                      <SidebarMenuButton key={subIdx} className="flex items-center text-sm whitespace-nowrap overflow-hidden">
                        <subItem.iconClass className="h-4 w-4 mr-2" />
                        <span className="truncate">{subItem.title}</span>
                      </SidebarMenuButton>
                      // <SidebarMenuSubItem key={subIdx} className="flex items-center text-sm">
                      //   <subItem.iconClass className="h-4 w-4 mr-2" />
                      //   {subItem.title}
                      // </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu> */}

      <SidebarMenu className='border-r h-full w-64 p-4 overflow-y-auto'>
        {menuItems.map((menu: any, idx: any): any => (
          <Collapsible key={idx} className="group/collapsible">
            <SidebarMenuItem>
              <div className="flex items-center">
                <CollapsibleTrigger asChild>
                  {
                    menu.submenu?.length > 0 && (
                      <ChevronRight style={{ marginLeft: "5px" }}
                        className={`transition-transform duration-300 ${rotated[idx] ? 'rotate-90' : ''}`}
                        onClick={() => handleIconClick(idx)}
                      />
                    )
                  }
                  {/* <ChevronRight
                  className={`transition-transform duration-300 ${rotated[idx] ? 'rotate-90' : ''}`}
                  onClick={() => handleIconClick(idx)}
                /> */}
                </CollapsibleTrigger>
                <SidebarMenuButton
                  className="text-md flex items-center whitespace-nowrap overflow-hidden"
                  onClick={() => {
                    redirect(menu.href);
                  }}
                >
                  <menu.iconClass className="mr-2" />
                  <span className="truncate">{menu.title}</span>
                </SidebarMenuButton>
              </div>
              {menu.submenu.length > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub className="pl-4">
                    {menu.submenu.map((subItem: any, subIdx: any) => (
                      <SidebarMenuButton key={subIdx} className="flex items-center text-sm whitespace-nowrap overflow-hidden"
                        onClick={() => {
                          redirect(subItem.href);
                        }} 
                      >
                        <subItem.iconClass className="h-4 w-4 mr-2" />
                        <span className="truncate">{subItem.title}</span>
                      </SidebarMenuButton>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </>
  );
}