"use client";

import { redirect } from "next/navigation";

export default function ConfigurationPage() {
  // const { setItems } = useBreadcrumb();

  // useEffect(() => {
  //   setItems([{ label: "Configuration", href: "/configuration" }]);
  // }, []);

  redirect("/configuration/cloud-services");
}
