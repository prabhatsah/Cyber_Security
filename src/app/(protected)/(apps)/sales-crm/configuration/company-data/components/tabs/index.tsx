'use client'

import TabContainer from "@/ikon/components/tabs";
import { TabArray } from "@/ikon/components/tabs/type";
import OrganizationDataTable from "../organization-table";
import RolesDataTable from "../role-table";
import GradeDataTable from "../grade-table";

const tabArray: TabArray[] = [
    {
        tabName: "Organization",
        tabId: "tab-organization",
        default: true,
        tabContent: <OrganizationDataTable />
    },
    {
        tabName: "Role",
        tabId: "tab-role",
        default: false,
        tabContent: <RolesDataTable />
    },
    {
        tabName: "Grade",
        tabId: "tab-grade",
        default: false,
        tabContent: <GradeDataTable />
    },
];

const CompanyDataTab = () => {
    return (
        <TabContainer
            tabArray={tabArray}
            tabListClass=""
            tabListButtonClass="text-md"
            tabListInnerClass="items-center"
        />
    );
}

export default CompanyDataTab;