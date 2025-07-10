import type { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
// import KBContextProvider from "./(context)/KnowledgeBaseContext";
import { DiscoveryProvider } from "./discovery/actions/context/DiscoveryContext";
import { GlobalContextProvider } from "./context/GlobalContext";
import KBContextProvider from "../(context)/KnowledgeBaseContext";

// const getMenuItems = (framework?: string) => [
//   {
//     title: "Home",
//     iconName: "house",
//     href: `/grc-v2/${framework}/home`,
//   },
//   {
//     title: "Reports",
//     iconName: "chart-no-axes-column",
//     href: `/grc-v2/${framework}/reports`,
//   },
//   {
//     title: "SOA",
//     iconName: "chart-no-axes-column",
//     href: `/grc-v2/${framework}/soa`,
//   },
//   {
//     title: "BAU",
//     iconName: "list-checks", // Business-as-usual implies ongoing operations/metrics
//     href: `/grc-v2/${framework}/bau`,
//   },
//   {
//     title: "Supplier Registry",
//     iconName: "building-2",
//     href: `/grc-v2/${framework}/supplier-registry`,
//   },
//   // {
//   //   title: "Policy New",
//   //   iconName: "file-stack",
//   //   href: `/grc-v2/${framework}/policynew`,
//   // },
//   {
//     title: "Governance",
//     iconName: "gavel",
//     submenu: [
//       {
//         title: "Frameworks",
//         iconName: "file-stack",
//         href: `/grc-v2/${framework}/compliance/frameworks`,
//       },
//       {
//         title: "Controls",
//         iconName: "file-stack",
//         href: `/grc-v2/${framework}/compliance/controls`,
//       },
//       {
//         title: "Policies",
//         iconName: "file-stack",
//         href: `/grc-v2/${framework}/compliance/policies`,
//       },
//       {
//         title: "Audits",
//         iconName: "file-stack",
//         href: `/grc-v2/${framework}/compliance/audits`,
//       },
//     ],
//   },
//   {
//     title: "Risk",
//     iconName: "gauge",
//     submenu: [
//       {
//         title: "Overview",
//         iconName: "file-stack",
//         href: `/grc-v2/${framework}/risk/overview`,
//       },
//       {
//         title: "Risk register",
//         iconName: "file-stack",
//         href: `/grc-v2/${framework}/risk/register`,
//       },
//       {
//         title: "Risk library",
//         iconName: "file-stack",
//         href: `/grc-v2/${framework}/risk/library`,
//       },
//     ],
//   },
//   {
//     title: "Configurator",
//     iconName: "cog",
//     href: `/grc-v2/${framework}/configurator`,
//   },
//   {
//     title: "Assets",
//     iconName: "database",
//     href: `/grc-v2/${framework}/assets`,
//   },
//   {
//     title: "Discovery",
//     iconName: "search",
//     href: `/grc-v2/${framework}/discovery`,
//   },
//   {
//     title: "Discovered Devices",
//     iconName: "search",
//     href: `/grc-v2/${framework}/discoveredDevices`,
//   },
//   {
//     title: "Updates",
//     iconName: "history",
//     href: `/grc-v2/${framework}/updates`,
//   },
// ];
const getMenuItems = (framework?: string, clientId?: string) => {
  console.log("clientId -------", clientId);

  const basePath = `/grc-v2/${framework}/${clientId}`;

  return [
    {
      title: "Home",
      iconName: "house",
      href: `${basePath}/home`,
    },
    {
      title: "Reports",
      iconName: "chart-no-axes-column",
      href: `${basePath}/reports`,
    },
    {
      title: "SOA",
      iconName: "file-check",
      href: `${basePath}/soa`,
    },
    {
      title: "BAU",
      iconName: "list-checks",
      href: `${basePath}/bau`,
    },
    {
      title: "Supplier Registry",
      iconName: "building-2",
      href: `${basePath}/supplier-registry`,
    },
    {
      title: "Governance",
      iconName: "gavel",
      submenu: [
        {
          title: "Frameworks",
          iconName: "file-stack",
          href: `${basePath}/compliance/frameworks`,
        },
        {
          title: "Controls",
          iconName: "file-stack",
          href: `${basePath}/compliance/controls`,
        },
        {
          title: "Policies",
          iconName: "file-stack",
          href: `${basePath}/compliance/policies`,
        },
        {
          title: "Audits",
          iconName: "file-stack",
          href: `${basePath}/compliance/audits`,
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
          href: `${basePath}/risk/overview`,
        },
        {
          title: "Risk register",
          iconName: "file-stack",
          href: `${basePath}/risk/register`,
        },
        {
          title: "Risk library",
          iconName: "file-stack",
          href: `${basePath}/risk/library`,
        },
      ],
    },
    {
      title: "Configurator",
      iconName: "cog",
      href: `${basePath}/configurator`,
    },
    {
      title: "Assets",
      iconName: "database",
      href: `${basePath}/assets`,
    },
    {
      title: "Discovery",
      iconName: "search",
      href: `${basePath}/discovery`,
    },
    {
      title: "Discovered Devices",
      iconName: "search",
      href: `${basePath}/discoveredDevices`,
    },
    {
      title: "Updates",
      iconName: "history",
      href: `${basePath}/updates`,
    },
  ];
};

export default function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: any;
}) {
  const framework = params.framework;
  const clientId = params.clientId;
  const menuItems = getMenuItems(framework, clientId);

  return (
    <GlobalContextProvider>
      <DiscoveryProvider>
        <KBContextProvider>
          <RenderAppSidebar menuItems={menuItems} />
          <RenderAppBreadcrumb
            breadcrumb={{
              level: 1,
              title: `GRC V2 / ISO-27001`,
              href: "/grc-v2",
            }}
          />
          {children}
        </KBContextProvider>
      </DiscoveryProvider>
    </GlobalContextProvider>
  );
}
