"use client";

import UnderMaintenance from "@/components/UnderMaintenance";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";

export default function ActiveDirectory() {
  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems([
      { label: "Scans", href: "/scans" },
      { label: "Active Directory Security", href: "/scans/activeDirectory" },
    ]);
  }, []);

  return (
    <>
      <UnderMaintenance />
    </>
  );
}
