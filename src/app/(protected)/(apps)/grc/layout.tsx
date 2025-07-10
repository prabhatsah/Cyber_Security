import type { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
import { Chatbot } from "./components/chatbot/chatbot";

const menuitems = [
  {
    title: "Dashboard",
    iconName: "shield-check",
    href: "/grc",
  },
  {
    title: "Overview",
    iconName: "shield-check",
    href: "/grc/overview",
  },
  {
    title: "Governance",
    iconName: "gavel",
    href: "/grc/governance",
    submenu: [
      // {
      //   title: "Audit",
      //   iconName: "file-stack",
      //   href: "/grc/governance/audit",
      // },
      // {
      //   title: "Reporting",
      //   iconName: "file-check-2",
      //   href: "/grc/governance/reporting",
      // },
      {
        title: "Self Assessment",
        iconName: "file-stack",
        href: "/grc/governance/planning",
      },
      // {
      //   title: "Self Assessment New",
      //   iconName: "file-stack",
      //   href: "/grc/governance/planning_new",
      // },
      // {
      //   title: "Evaluation",
      //   iconName: "file-check-2",
      //   href: "/grc/governance/evaluation",
      // },
      // {
      //   title:"SOP",
      //   iconName: "file-code",
      //   href: "/grc/governance/sop",
      // }
      // {
      //   title: "Audit",
      //   iconName: "file-check-2",
      //   href: "/grc/governance/audits1",
      // }
    ],
  },
  {
    title: "Compliance",
    href: "/grc/compliance",
    iconName: "file-warning",
  },
  {
    title: "Risk",
    iconName: "gauge",
    href: "/grc/risk",
  },
  {
    title: "Knowledge Base",
    iconName: "graduation-cap",
    href: "/grc/knowledge-base",
  },
  // {
  //   title: "Framework Mapping",
  //   iconName: "graduation-cap",
  //   href: "/grc/framework-mapping",
  // },
  // {
  //   title: "demo",
  //   iconName: "graduation-cap",
  //   href: "/grc/demo",
  // },
  // {
  //   title: "Knowledge Base New",
  //   iconName: "graduation-cap",
  //   href: "/grc/kbnew",
  // },
  // {
  //   title: "Sample Form",
  //   iconName: "graduation-cap",
  //   href: "/grc/governance/reports",
  // },
];

async function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppSidebar menuItems={menuitems} />
      <RenderAppBreadcrumb
        breadcrumb={{ level: 1, title: "GRC", href: "/grc" }}
      />
      {children}
      {/* <Chatbot /> */}
    </>
  );
}

export default layout;
