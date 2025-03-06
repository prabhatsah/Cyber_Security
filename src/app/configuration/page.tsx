"use client";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function ConfigurationPage() {
  const { setItems } = useBreadcrumb();

  useEffect(() => {
    setItems([{ label: "Configuration", href: "/configuration" }]);
  }, []);

  redirect("/configuration/cloud-services");
}
