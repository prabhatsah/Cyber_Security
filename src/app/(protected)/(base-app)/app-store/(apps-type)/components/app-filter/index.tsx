"use client";

import React, { useContext, useState } from "react";

import { Button } from "@/shadcn/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { AppContext } from "../app-context";
import AppFilterCards from "../app-filter-cards";
import { Filter } from "lucide-react";

// interface SoftwareFilterProps {
//     filterTypeField: string[]; 
// }

export function AppFilter() {

    const context = useContext(AppContext);


    if (!context) {
        throw new Error('Filter Data must be used within a StateProvider');
    }
    const { filterData, setFilterData, filterTypeField,appsData } = context;

    const [filterField, setFilterField] = useState<Record<string, boolean>>(
        filterTypeField.reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {} as Record<string, boolean>)
    );

    console.log(filterTypeField);
    console.log(filterField);
    

    const changeFilterStatus = (filterTypeName: string) => {
        setFilterField((prev) => ({
          ...prev,
          [filterTypeName]: !prev[filterTypeName],
        }));
    
      };

    return (
        <>
            <div className="flex flex-row gap-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {filterTypeField?.map((filterTypeName, index) => (
                            <DropdownMenuCheckboxItem
                                key={index}
                                checked={filterData[filterTypeName]} 
                                onCheckedChange={() => changeFilterStatus(filterTypeName)}
                            >
                                {filterTypeName}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {
                    (Object.keys(filterData)).map((filter, index) => (
                        filterData[filter] &&
                        <AppFilterCards filterData={filter} key={index} />
                    ))
                }
            </div>

        </>
    );
}