// 'use client' ensures this part is only client-side
"use client";

import { usePathname } from "next/navigation";
import Layout from "./Layout";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // Get the current pathname

  // Check if the current route is the login page
  const isLoginPage = pathname === "/login";

  return <Layout isLoginPage={isLoginPage}>{children}</Layout>;
};

export default ClientLayout;
