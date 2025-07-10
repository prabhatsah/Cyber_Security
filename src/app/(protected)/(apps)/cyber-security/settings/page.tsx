"use client";

import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { Settings } from "../../components/Settings";

export default function SettingsPage() {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 0,
          title: "Settings",
          href: "/settings",
        }}
      />
      <Settings />
    </>
  );
}
