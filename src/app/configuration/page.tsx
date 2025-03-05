"use client";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import setBreadcrumb from "@/lib/setBreadcrumb";

export default function ConfigurationPage() {
  // const { setItems } = useBreadcrumb();
  // // setBreadcrumb([
  // //   { label: "Configuration", href: "/configuration" },
  // //   { label: "Cloud Services", href: "/configuration/cloud-services" },
  // // ]);

  // useEffect(() => {
  //   setItems([
  //     { label: "Configuration", href: "/configuration" },
  //     { label: "Cloud Services", href: "/configuration/cloud-services" },
  //   ]);
  // }, []);

  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems([{ label: "Configuration", href: "/configuration" }]);
  }, []);

  redirect("/configuration/cloud-services");
}
