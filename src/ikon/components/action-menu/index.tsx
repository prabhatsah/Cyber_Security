"use client"
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ActionMenuProps, ExtraActionParams } from "./type";
import { IconButtonWithTooltip } from "../buttons";

export default function ActionMenu({
  actionMenus,
  extraActionParams,
}: {
  actionMenus: ActionMenuProps[];
  extraActionParams?: ExtraActionParams;
}) {



  const renderMenuItems = (items: ActionMenuProps[]) => {
    items = items.filter((item) => {
      return (item?.visibility == undefined || item.visibility == true || (item.visibility && item.visibility(...(extraActionParams?.arguments || []))))
    })
    if (items.length == 0) {
      return <DropdownMenuItem className="text-center">No action available.</DropdownMenuItem>
    }
    return items.map((item, index) => {
      if (item.type === "label") {
        return <DropdownMenuLabel key={index}>{item.label}</DropdownMenuLabel>;
      }

      if (item.type === "separator") {
        return <DropdownMenuSeparator key={index} />;
      }

      if (item.type === "group" && item.items) {
        return (
          <DropdownMenuGroup key={index}>
            {renderMenuItems(item.items)}
          </DropdownMenuGroup>
        );
      }

      if (item.items) {
        return (
          <DropdownMenuSub key={index}>
            <DropdownMenuSubTrigger>{item.label}</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {renderMenuItems(item.items)}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        );
      }

      return (
        <DropdownMenuItem
          key={index}
          disabled={item.disabled}
          onClick={() =>
            item.onClick &&
            item.onClick(...(extraActionParams?.arguments || []))
          }
        >
          {item.icon && <item.icon />}
          {item.label}
          {/* {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>} */}
        </DropdownMenuItem>
      );
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButtonWithTooltip variant="ghost" tooltipContent="Actions" className="h-8 w-8 p-0">
          <MoreHorizontal />
        </IconButtonWithTooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {renderMenuItems(actionMenus)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
