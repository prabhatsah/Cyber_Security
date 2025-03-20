"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  // const { setItems } = useBreadcrumb();

  // useEffect(() => {
  //   setItems([{ label: "Dashboard", href: "/dashboard" }]);
  // }, []);

  redirect("/dashboard");

  // return (
  //   // <Layout>
  //   //   <Dashboard />
  //   // </Layout>

  // );
}
