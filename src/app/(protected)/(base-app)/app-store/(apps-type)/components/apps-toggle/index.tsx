"use client"
import { usePathname, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../app-context'
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group'

function AppsToggle() {
    const [toggleValue, setToogleValue] = useState('')

    const router = useRouter();
    const pathName = usePathname();
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('AppCards must be used within a AppProvider');
    }
    const { filterData, setFilterData,filterTypeField ,setFilterTypeField} = context;
    useEffect(() => {
        const pathParts = pathName.split('/')
        console.log(pathParts)
        const value = pathParts[pathParts.length - 1]
        setToogleValue(value == "app-store" ? "all-apps" : value)
    }, [pathName])


    return (
        <ToggleGroup type="single" variant='outline' value={toggleValue} onValueChange={(value: string) => {
            const url = value == 'all-apps' ? "/app-store" : "/app-store/" + value
            router.push(url)
            setToogleValue(value)
        }}>
            <ToggleGroupItem className="rounded-e-none" value="all-apps">
                All Apps
            </ToggleGroupItem>
            <ToggleGroupItem className='rounded-none border-x-0' value="subscribed-apps">
                Subscribed Apps
            </ToggleGroupItem>
            <ToggleGroupItem className='rounded-s-none' value="my-apps">
                My Apps
            </ToggleGroupItem>
        </ToggleGroup>
    )
}

export default AppsToggle