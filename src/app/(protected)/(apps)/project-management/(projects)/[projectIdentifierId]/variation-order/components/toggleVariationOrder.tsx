'use client'
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import React, { useState } from 'react'
import RequestForVODataTable from './requestForVODataTable';
import SubDealDataTable from './subDealDataTable';

export default function ToggleVariationOrder({notificationData,subDealData,accountDataSubDeal}:{notificationData: Record<string,any>[],subDealData: Record<string,any>[],accountDataSubDeal:Record<string,any>|null }) {
    const [activeTable, setActiveTable] = useState("requestForVo");
    return (
        <div className="space-y-4">
            {/* Toggle Group */}
            <ToggleGroup
                type="single"
                value={activeTable}
                onValueChange={(value) => {
                    if (value) setActiveTable(value);
                }}
            >
                <ToggleGroupItem value="requestForVo">Request For VO</ToggleGroupItem>
                <ToggleGroupItem value="subDeal">Sub Deal</ToggleGroupItem>
            </ToggleGroup>

            {/* Tables */}
            <div>
                {activeTable === "requestForVo" ? (
                    <div>
                        <RequestForVODataTable notificationData={notificationData} />
                    </div>
                ) : activeTable === "subDeal" ? (
                    <div>
                        <SubDealDataTable subDealData={subDealData} accountDataSubDeal={accountDataSubDeal}/>
                    </div>
                ) : null}
            </div>
        </div>
    );
}