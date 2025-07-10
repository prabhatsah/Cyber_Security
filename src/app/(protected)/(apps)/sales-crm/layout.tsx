import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
const menuitems = [
  {
    title: "Home",
    href: "/sales-crm",
    iconName: "house",
  },
  {
    title: "Lead",
    submenu: [
      {
        title: "Details",
        href: "/sales-crm/lead/details",
        iconName: "menu",
      },
      {
        title: "Activity",
        href: "/sales-crm/lead/activity",
        iconName: "hourglass",
      },
    ],
    iconName: "hotel",
  },
  {
    title: "Deal",
    submenu: [
      {
        title: "Details",
        href: "/sales-crm/deal/details",
        iconName: "menu",
      },
      {
        title: "Activity",
        href: "/sales-crm/deal/activity",
        iconName: "hourglass",
      },
    ],
    iconName: "landmark",
  },
  {
    title: "Summary",
    href: "/sales-crm/summary",
    iconName: "eye",
  },
  {
    title: "Billing",
    submenu: [
      {
        title: "Invoice Details",
        href: "/sales-crm/billing/invoice-details",
        iconName: "menu",
      },
      {
        title: "Summary",
        href: "/sales-crm/billing/summary",
        iconName: "eye",
      },
    ],
    iconName: "square-user-round",
  },
  {
    title: "Account",
    submenu: [
      {
        title: "Details",
        href: "/sales-crm/account-management/details",
        iconName: "menu",
      },
      {
        title: "License",
        href: "/sales-crm/account-management/license",
        iconName: "copyright",
      },
      {
        title: "Summary",
        href: "/sales-crm/account-management/summary",
        iconName: "eye",
      },
    ],
    iconName: "square-user-round",
  },
  {
    title: "Configuration",
    submenu: [
      {
        title: "Employee Details",
        href: "/sales-crm/configuration/employee-details",
        iconName: "user",
      },
      {
        title: "Company Data",
        href: "/sales-crm/configuration/company-data",
        iconName: "landmark",
      },
      {
        title: "FX Rates",
        href: "/sales-crm/configuration/fx-rates",
        iconName: "dollar-sign",
      },
      {
        title: "Office Details",
        href: "/sales-crm/configuration/office-details",
        iconName: "warehouse",
      },
      {
        title: "Dynamic Product",
        href: "/sales-crm/configuration/dynamic-product",
        iconName: "database",
      },
    ],
    iconName: "settings",
  },
];

async function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppSidebar menuItems={menuitems} />
      <RenderAppBreadcrumb
        breadcrumb={{ level: 1, title: "Sales CRM", href: "/sales-crm" }}
      />
      {children}
    </>
  );
}

export default layout;
