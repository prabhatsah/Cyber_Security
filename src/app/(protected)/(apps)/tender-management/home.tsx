'use client'


import RfpDataTable from "./_components/buyer/home/rfp-datatable";
import { RfpData } from "./_utils/common/types";

export default function TenderHomeComponent({rfpData} : {rfpData : RfpData[]}){
    return (
        <>
            {/* Datatable render here */}
            <RfpDataTable rfpData={rfpData}/>
        </>
    )
}