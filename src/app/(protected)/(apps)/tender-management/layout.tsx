import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
const menuitems = [
  {
    title: "External Tenders",
    href: "/tender-management",
    iconName: "file-stack",
  },
  {
    title: "Internal Tenders",
    submenu: [
      {
        title: "Tender Templates",
        href: "/tender-management/buyer/my-templates",
        iconName: "scroll-text",
      },
      {
        title: "My Tenders",
        href: "/tender-management/buyer/my-rfps",
        iconName: "hourglass",
      },
      {
        title: "My Suppliers",
        href: "/tender-management/buyer/my-suppliers",
        iconName: "users",
      },
    ],
    iconName: "cog",
  },
  {
    title: "My Tender Responses",
    submenu: [
      {
        title: "Response Templates",
        href: "/tender-management/supplier/template",
        iconName: "scroll-text",
      },
    ],
    iconName: "cog",
  },
  {
    title: "Tender Historical Uploads",
    submenu: [
      {
        title: "Tenders",
        href: "/tender-management/buyer/Tenders-History",
        iconName: "scroll-text",
      },
      {
        title: "Tender Responses",
        href: "/tender-management/supplier/Tenders-History",
        iconName: "scroll-text",
      },
    ],
    iconName: "upload",
  },
  {
    title: "Analytics",
    submenu: [
      {
        title: "Buyer",
        href: "/tender-management/buyer/analytics",
        iconName: "chart-line",
      },
      {
        title: "Supplier",
        href: "/tender-management/supplier/analytics",
        iconName: "chart-line",
      },
    ],
    iconName: "chart-pie",
  },
  {
    title: "Profile",
    href: "/tender-management/my-profile",
    iconName: "circle-user-round",
  },
  // {
  //   title: "Home",
  //   href: "/tender-management",
  //   iconName: "house",
  // },
  // {
  //   title: "My RFPs",
  //   href: "/tender-management/buyer/my-rfps",
  //   iconName: "file-check-2",
  // },
  // {
  //   title: "My Templates",
  //   href: "/tender-management/buyer/my-templates",
  //   iconName: "layout-template",
  // },
  // {
  //   title: "Analytics",
  //   href: "/tender-management/buyer/analytics",
  //   iconName: "chart-spline",
  // },
  // {
  //   title: "Response Upload",
  //   href: "/tender-management/supplier/upload",
  //   iconName: "file-up",
  // },
  // {
  //   title: "Response Template",
  //   href: "/tender-management/supplier/template",
  //   iconName: "layout-template",
  // },
];

async function layout({ children }: Readonly<{ children: ReactNode }>) {
  getSoftwareIdByNameVersion("Tender Management", "1");
  return (
    <>
      <RenderAppSidebar menuItems={menuitems} />
      <RenderAppBreadcrumb
        breadcrumb={{ level: 1, title: "RFP", href: "/tender-management" }}
      />
      {children}
    </>
  );
}

export default layout;
