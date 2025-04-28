"use client"
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';
import { useState, JSX, useContext, createContext, ReactNode, useEffect } from 'react';
import { redirect } from 'next/navigation';
import Icon from '../icon';
import { MenuItem } from './type';

export function AppSidebar() {
  const { menuItems } = useAppSidebar();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [activeMenu, setActiveMenu] = useState<string>("");

  const toggleSubmenu = (index: string) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const renderMenu = (items: MenuItem[], parentIndex: string = ''): JSX.Element => {
    return (
      <ul className="">
        {items.map((item, index) => {
          const currentIndex = parentIndex ? `${parentIndex}-${index}` : `${index}`;
          const hasSubmenu = item.submenu && item.submenu.length > 0;

          return (
            <li key={currentIndex} className='lg:pl-2'>
              <div
                //href={item.href || ''}
                className={"flex items-center gap-1 p-2 justify-between hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer" + (activeMenu == item.href ? " bg-accent text-accent-foreground" : "")}
                onClick={(e) => {
                  //e.preventDefault();
                  if (hasSubmenu) {
                    toggleSubmenu(currentIndex);
                  }

                  if (item.href) {
                    setActiveMenu(item.href)
                    redirect(item.href)
                  }
                }}
              >
                <span className='flex items-center gap-1'>
                  {item.iconName && <Icon name={(item.iconName)} className="w-4 h-4" />}
                  <span className="hidden lg:inline">{item.title}</span>
                </span>
                {hasSubmenu && (
                  <span>
                    {openSubmenus[currentIndex] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                )}
              </div>

              {hasSubmenu && item.submenu && openSubmenus[currentIndex] && renderMenu(item.submenu, currentIndex)}
            </li>
          );
        })}
      </ul>
    );
  };

  if (!menuItems || menuItems?.length == 0) {
    return null
  }

  return (
    <div className="lg:min-w-64 border-r h-full p-1 lg:pr-2 lg:pl-0 lg:py-2 ">
      {renderMenu(menuItems)}
    </div>
  );
};

export function RenderAppSidebar({ menuItems }: { menuItems: MenuItem[] }) {
  const { addMenuItems } = useAppSidebar();

  useEffect(() => {
    addMenuItems(menuItems)
  }, [menuItems])

  return null
}


export interface AppSidebarContextProps {
  menuItems: MenuItem[];
  addMenuItems: (menuItem: MenuItem[]) => void;
  clearMenuItem: () => void;
}

const AppSidebarContext = createContext<AppSidebarContextProps | undefined>(undefined);

export function AppSidebarProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const addMenuItems = (items: MenuItem[]) => {
    setMenuItems(items);
  };

  const clearMenuItem = () => {
    setMenuItems([]);
  };

  return (
    <AppSidebarContext.Provider value={{ menuItems, addMenuItems, clearMenuItem }}>
      {children}
    </AppSidebarContext.Provider>
  );
}

export function useAppSidebar() {
  const context = useContext(AppSidebarContext);
  if (!context) {
    throw new Error('useAppSidebar must be used within a AppSidebarProvider');
  }
  return context;
}

