"use client"
import { Items, WorkflowActionBtns } from "@/app/(protected)/(apps)/sales-crm/components/type";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import React from "react";
import { TicketWorkflowActionBtns, TicketWorkflowItems } from "@/app/(protected)/(apps)/customer-support/components/type";

const TicketWorkflowComponentTemplet = ({ items, pipelineActionBtns }: { items: TicketWorkflowItems[], pipelineActionBtns: TicketWorkflowActionBtns[] }) => {
  const handleLoadWonForm = () => {
    console.log("Load Won Form function triggered.");
    // Add your logic here for the "Update Won Date" action
  };


  return (
<>
  {items.map((item, index) => (
    <div
      key={index}
      className="list-group-item px-3 py-2 border-b flex flex-col"
    >
      {/* First Row: Name on Left, Side Name on Right */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">{item.name}</span>
          {item.dropdown && pipelineActionBtns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-2 px-2 text-sm focus:outline-none" aria-expanded="false">
                  <ChevronDown />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  {pipelineActionBtns.map((option, ind) => (
                    <DropdownMenuItem key={ind} onClick={() => option.btnFn()}>
                      {option.btnIcon}
                      <span>{option.btnText}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {item.assigneeName && (
          <span className="text-sm">{item.assigneeName}</span>
        )}
      </div>

      {/* Second Row: Status on Left, Date on Right */}
      <div className="flex justify-between items-center w-full">
        <span className={`text-sm font-medium ${item.color}`}>{item.status}</span>
        {item.actionDate && (
        <span className="text-sm text-gray-300">{item.actionDate || "No date"}</span>
    )}
      </div>
    </div>
  ))}
</>

  );
};

export default TicketWorkflowComponentTemplet;