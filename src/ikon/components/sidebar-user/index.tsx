import MenuUser from "@/ikon/components/menu-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { SidebarMenuButton } from "@/shadcn/ui/sidebar";
import { ChevronsUpDown } from "lucide-react";
import UserDropdownMenu from "@/ikon/components/user-dropdown-menu";

export function SidebarUser() {
  //const { isMobile } = useSidebar ()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent shadow-[0_0_0_1px_hsl(var(--sidebar-border))] data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
        >
          <MenuUser />
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        // side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <UserDropdownMenu />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
