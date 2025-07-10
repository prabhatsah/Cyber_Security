'use client'
import TabContainer from "@/ikon/components/tabs";
import { TabArray } from "@/ikon/components/tabs/type";
import OfficeDetailsTable from "../office-details-table";
import BankingDetailsTable from "../banking-details-table";
import WorkingDaysDetailsTable from "../working-days-table";
import LicenseTypeTable from "../license-table";

const tabArray: TabArray[] = [
    {
        tabName: "Office Details",
        tabId: "tab-organization",
        default: true,
        tabContent: <OfficeDetailsTable />
    },
    {
        tabName: "Baking Details",
        tabId: "tab-banking",
        default: false,
        tabContent: <BankingDetailsTable />
    },
    {
        tabName: "Working Days",
        tabId: "tab-working-days",
        default: false,
        tabContent: <WorkingDaysDetailsTable />
    },
    {
        tabName: "License",
        tabId: "tab-license",
        default: false,
        tabContent: <LicenseTypeTable />
    },
];

const OfficeDeailsDataTab = () => {
    return (
        <TabContainer
            tabArray={tabArray}
            tabListClass=""
            tabListButtonClass="text-md"
            tabListInnerClass="items-center"
        />
    );
}

export default OfficeDeailsDataTab;