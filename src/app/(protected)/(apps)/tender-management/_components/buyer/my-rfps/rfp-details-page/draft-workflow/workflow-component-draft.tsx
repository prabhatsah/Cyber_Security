"use client";
import { Items,RfpDraftActionBtns } from "../../../utils/types";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import React from "react";

const WorkflowComponent = ({
  items,
  RfpDraftActionBtns,
}: {
  items: Items[];
  RfpDraftActionBtns: RfpDraftActionBtns[];
}) => {
  const handleLoadWonForm = () => {
    console.log("Load Won Form function triggered.");
    // Add your logic here for the "Update Won Date" action
  };

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
                      {RfpDraftActionBtns &&
                        RfpDraftActionBtns.map((option, ind) => (
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
                      {/* <DropdownMenuItem>
                        <span>Add / Edit Team</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                       
                        <span>Edit Lead</span>
                      </DropdownMenuItem> */}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {/* {item.dropdown && (
                <button
                  className="ml-2 text-sm px-2  focus:outline-none"
                  aria-expanded="false"
                >
                  <ChevronDown />
                </button>
              )} */}
            </div>
            <span className={`text-sm font-medium ${item.color}`}>
              {item.status}
            </span>
          </div>

          {/* {item.dropdown && (
            <ul className="hidden absolute bg-white shadow-lg border rounded mt-2 text-sm">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={handleLoadWonForm}
                >
                  Update Won Date
                </a>
              </li>
            </ul>
          )} */}
        </div>
      ))}
    </>
  );
};

export default WorkflowComponent;
