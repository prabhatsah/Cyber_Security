"use client";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import React from "react";
import { Items, WorkflowActionBtns } from "../type";

const WorkflowComponent = ({
  items,
  pipelineActionBtns,
}: {
  items: Items[];
  pipelineActionBtns: WorkflowActionBtns[];
}) => {
  return (
    <>
      {items.map((item, index) => (
        <div
          key={index}
          className="list-group-item px-3 py-2 border-b flex justify-between items-center"
        >
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="text-base font-medium">{item.name}</span>
              {item.dropdown && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="ml-2 px-2 text-sm  focus:outline-none"
                      aria-expanded="false"
                    >
                      <ChevronDown />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuGroup>
                      {pipelineActionBtns &&
                        pipelineActionBtns.map((option, ind) => (
                          <DropdownMenuItem
                            key={ind}
                            onClick={async () => {
                              option.btnFn();
                            }}
                          >
                            {option.btnIcon}
                            <span>{option.btnText}</span>
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <span className={`text-sm font-medium ${item.color}`}>
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default WorkflowComponent;
