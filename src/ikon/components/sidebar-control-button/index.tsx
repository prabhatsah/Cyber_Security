"use client"

import { Button } from "@/shadcn/ui/button"
import { SidebarIcon } from "lucide-react"
import { useAppSidebar } from "../app-sidebar"
import { Separator } from '@/shadcn/ui/separator'

export function SidebarControlButton() {
  const { menuItems, toggleAppSidebarFunc } = useAppSidebar()
  if (menuItems.length == 0) {
    return null
  } else {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={toggleAppSidebarFunc}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4 bg-foreground" />
      </>
    )
  }
}