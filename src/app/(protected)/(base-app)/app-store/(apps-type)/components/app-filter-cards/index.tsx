'use client'
import React, { useContext, useState } from 'react'

import { AppContext } from '../app-context';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shadcn/ui/dropdown-menu';
import { Button } from '@/shadcn/ui/button';
interface SoftwareFilterProps {
    filterField: string;
}

export default function AppFilterCards({ filterField }: SoftwareFilterProps) {

    const context = useContext(AppContext);

    if (!context) {
        throw new Error('Filter Data must be used within a StateProvider');
    }
    const { filterData, setFilterData, appsData } = context;


    const uniqueValuesByKey = (fieldName: string) => {
        const result: string[] = [];

        appsData?.map(obj => {
            Object.keys(obj).map(key => {
                if (key === fieldName && !result.includes(obj[key])) {
                    result.push(obj[key]);
                }
            });
        });

        return result;
    };

    // Define the type of the state object
    const [filterType, setFilterType] = useState<Record<string, boolean>>(
        uniqueValuesByKey(filterField).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {} as Record<string, boolean>)
    );
    const changeFilterStatus = (filterTypeName: string) => {
        setFilterType((prev) => ({
            ...prev,
            [filterTypeName]: !prev[filterTypeName],
        }));
        setFilterData((prev) => {
            const currentFilterName = prev[filterField] || []
            if (currentFilterName.includes(filterTypeName)) {
                return {
                    ...prev,
                    [filterField]: currentFilterName.filter((item) => item !== filterTypeName),
                }
            } else {
                return {
                    ...prev,
                    [filterField]: [...currentFilterName, filterTypeName],
                };
            }
        })
    };

    // console.log(filterData);

    return (
        <>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='outline' >
                        {filterField}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {uniqueValuesByKey(filterField).length === 0 ? (
                        <DropdownMenuItem disabled>No items available</DropdownMenuItem>
                    ) : (
                        uniqueValuesByKey(filterField).map((filterTypeName, index) => (
                            <DropdownMenuCheckboxItem
                                key={index}
                                checked={filterType[filterTypeName]} // Access the corresponding value
                                onCheckedChange={() => changeFilterStatus(filterTypeName)}
                            >
                                {filterTypeName}
                            </DropdownMenuCheckboxItem>
                        ))
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}


