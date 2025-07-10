import type { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
import KBContextProvider from "../(context)/KnowledgeBaseContext";

const buildPath = (basePath: string, framework?: string) => {
  if (!framework || basePath === "/GRC-DEMO") return basePath;
  return `/GRC-DEMO/${framework}${basePath.replace("/GRC-DEMO", "")}`;
};

const getMenuItems = (framework?: string) => [
  {
    title: "Home",
    iconName: "house",
    href: "/GRC-DEMO",
  },
  {
    title: "Reports",
    iconName: "chart-no-axes-column",
    href: buildPath("/GRC-DEMO/reports", framework),
  },
  {
    title: "SOA",
    iconName: "chart-no-axes-column",
    href: buildPath("/GRC-DEMO/soa", framework),
  },
  {
    title: "Governance",
    iconName: "gavel",
    submenu: [
      {
        title: "Frameworks",
        iconName: "file-stack",
        // href: buildPath("/GRC-DEMO/compliance/frameworks", framework),
        href: `/GRC-DEMO/${framework}/compliance/frameworks`,
      },
      {
        title: "Controls",
        iconName: "file-stack",
        href: buildPath("/GRC-DEMO/compliance/controls", framework),
      },
      {
        title: "Policies",
        iconName: "file-stack",
        href: buildPath("/GRC-DEMO/compliance/policies", framework),
      },
      {
        title: "Audits",
        iconName: "file-stack",
        href: buildPath("/GRC-DEMO/compliance/audits", framework),
      },
    ],
  },
  {
    title: "Risk",
    iconName: "gauge",
    submenu: [
      {
        title: "Overview",
        iconName: "file-stack",
        href: buildPath("/GRC-DEMO/risk/overview", framework),
      },
      {
        title: "Risk register",
        iconName: "file-stack",
        href: buildPath("/GRC-DEMO/risk/register", framework),
      },
      {
        title: "Risk library",
        iconName: "file-stack",
        href: buildPath("/GRC-DEMO/risk/library", framework),
      },
    ],
  },
  {
    title: "Configurator",
    iconName: "cog",
    href: buildPath("/GRC-DEMO/configurator", framework),
  },
];

export default function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { framework: string };
}) {
  const framework = params.framework;
  const menuItems = getMenuItems(framework);

  return (
    <KBContextProvider>
      <RenderAppSidebar menuItems={menuItems} />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: `GRC DEMO / ${framework}`,
          href: "/GRC-DEMO",
        }}
      />
      {children}
    </KBContextProvider>
  );
}
