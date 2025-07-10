import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
const menuitems = [
  {
    title: "Category",
    href: "/supplier-management",
    iconName: "chart-bar-stacked",
  },
  {
    title: "Vendor",
    href: "/supplier-management/vendor",
    iconName: "file-pen-line",
  },
  {
    title: "Items",
    href: "/supplier-management/items",
    iconName: "eye",
  },
  {
    title: "Requisition",
    href: "/supplier-management/requisition",
    iconName: "shapes",
  },
  {
    title: "Purchase Order",
    href: "/supplier-management/purchase-order",
    iconName: "shopping-cart",
  },
  {
    title: "Configuration",
    submenu: [
      {
        title: "Organization Details",
        href: "/supplier-management/configuration/organization-details",
        iconName: "building-2",
      },
     {
        title: "FX Rates",
        href: "/supplier-management/configuration/fx-rates",
        iconName: "equal-approximately",
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
        breadcrumb={{ level: 1, title: "Supplier Management", href: "/supplier-management" }}
      />
      {children}
    </>
  );
}

export default layout;
