"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  useState,
  JSX,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from "react";
import { redirect, usePathname } from "next/navigation";
import Icon from "../icon";
import { MenuItem } from "./type";

export function AppSidebar() {
  const { menuItems, toggleAppSidebar } = useAppSidebar();
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [activeMenu, setActiveMenu] = useState<string>("");

  useEffect(() => {
    setActiveMenu(pathname);
    const newOpenSubmenus: Record<string, boolean> = {};
    expandParents(menuItems, pathname, "", newOpenSubmenus);
    setOpenSubmenus(newOpenSubmenus);
  }, [pathname, menuItems]);

  const expandParents = (
    items: MenuItem[],
    path: string,
    parentIndex: string,
    state: Record<string, boolean>
  ): boolean => {
    let found = false;

    items.forEach((item, index) => {
      const currentIndex = parentIndex ? `${parentIndex}-${index}` : `${index}`;

      const hasSubmenu = item.submenu && item.submenu.length > 0;

      if (item.href === path) {
        found = true;
      }

      if (hasSubmenu) {
        const childFound = expandParents(
          item.submenu!,
          path,
          currentIndex,
          state
        );
        if (childFound) {
          state[currentIndex] = true;
          found = true;
        }
      }
    });

    return found;
  };

  const toggleSubmenu = (index: string) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const renderMenu = (
    items: MenuItem[],
    parentIndex: string = ""
  ): JSX.Element => {
    return (
      <ul className="">
        {items.map((item, index) => {
          const currentIndex = parentIndex
            ? `${parentIndex}-${index}`
            : `${index}`;
          const hasSubmenu = item.submenu && item.submenu.length > 0;

          // Determine if this item is active
          const isActive =
            activeMenu === item.href ||
            (hasSubmenu &&
              item.submenu!.some((sub) => sub.href === activeMenu));

          return (
            <li key={currentIndex} className="lg:pl-2">
              <div
                className={
                  "flex items-center gap-1 p-2 my-1 justify-between hover:bg-sidebar-accent-new hover:text-accent-foreground rounded-md cursor-pointer" +
                  (isActive && parentIndex ?
                    " bg-sidebar-accent-new text-accent-foreground" : "") +
                  (isActive && !hasSubmenu ?
                    " bg-sidebar-accent-new text-accent-foreground" : "")
                }

              >
                <div className="flex items-center gap-1 grow"
                  onClick={() => {
                    if (hasSubmenu && !item?.href) {
                      toggleSubmenu(currentIndex);
                    }

                    if (item.onClick) {
                      item.onClick();
                    }

                    if (item.href) {
                      setActiveMenu(item.href);
                      redirect(item.href);
                    }
                  }}
                >
                  {!parentIndex && item.iconName && (
                    <Icon name={item.iconName} className="w-4 h-4" />
                  )}
                  <span className="hidden lg:inline">{item.title}</span>
                </div>
                {hasSubmenu && (
                  <span className="z-50"
                    onClick={() => {
                      toggleSubmenu(currentIndex);
                    }}
                  >
                    {openSubmenus[currentIndex] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                )}
              </div>

              {hasSubmenu && (
                <div
                  className={`ml-3 border-l-submenu overflow-hidden transition-all duration-300 ease-in-out ${openSubmenus[currentIndex] ? "max-h-96" : "max-h-0"
                    }`}
                >
                  {renderMenu(item.submenu!, currentIndex)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  if (!menuItems || menuItems.length === 0) {
    return null;
  }

  return (
    <div className={(!toggleAppSidebar ? 'lg:w-64 shrink-0' : 'w-0 overflow-hidden ') + ' text-nowrap transition-[width] duration-500 ease-in-out border-r h-full p-1 lg:pr-2 lg:pl-0 lg:py-2 bg-app-sidebar-new'}>
      {renderMenu(menuItems)}
    </div>
  );
}

export function RenderAppSidebar({ menuItems }: { menuItems: MenuItem[] }) {
  const { addMenuItems } = useAppSidebar();

  useEffect(() => {
    addMenuItems(menuItems);
  }, [menuItems]);

  return null;
}

export interface AppSidebarContextProps {
  menuItems: MenuItem[];
  addMenuItems: (menuItem: MenuItem[]) => void;
  clearMenuItem: () => void;
  toggleAppSidebar: boolean;
  toggleAppSidebarFunc: () => void;
}

const AppSidebarContext = createContext<AppSidebarContextProps | undefined>(
  undefined
);

export function AppSidebarProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const addMenuItems = (items: MenuItem[]) => {
    setMenuItems(items);
  };

  const clearMenuItem = () => {
    setMenuItems([]);
  };

  const [toggleAppSidebar, setToggleAppSidebar] = useState(false);

  function toggleAppSidebarFunc() {
    setToggleAppSidebar((prev) => !prev);
  }

  return (
    <AppSidebarContext.Provider value={{ menuItems, addMenuItems, clearMenuItem, toggleAppSidebar, toggleAppSidebarFunc }}>
      {children}
    </AppSidebarContext.Provider>
  );
}

export function useAppSidebar() {
  const context = useContext(AppSidebarContext);

  if (!context) {
    throw new Error("useAppSidebar must be used within a AppSidebarProvider");
  }
  return context;
}
