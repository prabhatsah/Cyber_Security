import type { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
// import KBContextProvider from "./(context)/KnowledgeBaseContext";
// import { DiscoveryProvider } from "./discovery/actions/context/DiscoveryContext";
// import { GlobalContextProvider } from "./context/GlobalContext";

const getMenuItems = (clientId?: string) => {
  console.log("clientId -------", clientId);

  const basePath = `/grc-v2/client/${clientId}`;

  return [
    {
      title: "Home",
      iconName: "home",
      href: `${basePath}/home`,
    },
    {
      title: "SOA",
      iconName: "bar-chart-3",
      href: `${basePath}/soa`,
    },
    {
      title: "BAU",
      iconName: "check-square",
      href: `${basePath}/bau`,
    },
    {
      title: "Supplier Registry",
      iconName: "building",
      href: `${basePath}/supplier-registry`,
    },
    {
      title: "Frameworks",
      iconName: "layers",
      href: `${basePath}/frameworks`,
    },
    {
      title: "Controls",
      iconName: "sliders",
      href: `${basePath}/controls`,
    },
    {
      title: "Audits",
      iconName: "clipboard-list",
      href: `${basePath}/audits`,
    },
    {
      title: "Metadata",
      iconName: "wrench",
      href: `${basePath}/configurator`,
    },
    {
      title: "Risk register",
      iconName: "shield-alert",
      href: `${basePath}/risk/register`,
    },
    {
      title: "Risk library",
      iconName: "book-open",
      href: `${basePath}/risk/library`,
    },
    {
      title: "Assets",
      iconName: "server",
      href: `${basePath}/assets`,
    },
    {
      title: "Responsibility Matrix",
      iconName: "layout-grid",
      href: `${basePath}/responsiblity-matrix`,
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
  const clientId = params.clientId;
  const menuItems = getMenuItems(clientId);

  return (
    // <GlobalContextProvider>
    //   <DiscoveryProvider>
    <>
      <RenderAppSidebar menuItems={menuItems} />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: `GRC V2 / ISO-27001`,
          href: "/grc-v2",
        }}
      />
      {children}
    </>
    //   </DiscoveryProvider>
    // </GlobalContextProvider>
  );
}
