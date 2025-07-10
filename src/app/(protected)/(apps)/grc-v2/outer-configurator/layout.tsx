import type { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";

const menuitems = [
  {
    title: "New Framework",
    iconName: "shield-check",
    href: "/grc-v2/outer-configurator/dynamicFramework",
  },
  {
    title: "Frameworks",
    iconName: "shield-check",
    href: "/grc-v2/outer-configurator/frameworks",
  },
  {
    title: "Custom Controls",
    iconName: "gavel",
    href: "/grc-v2/outer-configurator/custom-controls",
  },
  {
    title: "Policy Management",
    href: "/grc-v2/outer-configurator/policynew",
    iconName: "file-warning",
  },
  {
    title: "Editor",
    href: "/grc-v2/outer-configurator/editor",
    iconName: "file-pen-line",
  },
  {
    title: "Dummy Policy Form",
    href: "/grc-v2/outer-configurator/dummyPolicyForm",
    iconName: "file-warning",
  },
  // {
  //   title: "Risk Metadata",
  //   iconName: "gauge",
  //   href: "/grc/risk",
  // },
  {
    title: "Risk Library",
    iconName: "shield",
    href: "/grc-v2/outer-configurator/risk-library",
  },
  {
    title: "Audit Questionnaire",
    iconName: "gauge",
    href: "/grc-v2/outer-configurator/audit-questionnaire",
  },
  {
    title: "BAU",
    iconName: "list-checks",
    href: "/grc-v2/outer-configurator/bau",
  },
  {
    title: "Metadata",
    iconName: "sliders-horizontal",
    href: "/grc-v2/outer-configurator/configurator",
  },
  {
    title: "Cross Reference",
    iconName: "network",
    href: "/grc-v2/outer-configurator/framework-mapping",
  },
];

async function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppSidebar menuItems={menuitems} />
      <RenderAppBreadcrumb
        breadcrumb={{ level: 1, title: "GRC", href: "/grc" }}
      />
      {children}
    </>
  );
}

export default layout;
