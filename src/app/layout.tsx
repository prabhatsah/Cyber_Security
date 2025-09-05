export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/utils/secureGaurdService";
import { Providers } from "./providers";
import "../styles/globals.css";
// import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import GlobalLoadingSpinner from "@/components/GlobalLoadingSpinner";
import Layout from "@/components/Layout";
import ClientLayout from "@/components/ClientLayout";
// import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import { BreadcrumbProvider } from "@/components/app-breadcrumb/BreadcrumbProvider";
import { ScanNotificationProvider } from "@/contexts/ScanNotificationContext";
import ToastContainer from "@/components/ToastContainer";
import { DialogProvider } from "@/components/alert-dialog/dialog-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecureGuard - Security Platform",
  description: "Advanced security monitoring and compliance platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="">
        <LoadingProvider>
          <GlobalLoadingSpinner />
          <BreadcrumbProvider>
            <Providers>
              <DialogProvider>
                <ScanNotificationProvider>
                  <ClientLayout>{children}</ClientLayout>
                  <ToastContainer />
                </ScanNotificationProvider>
              </DialogProvider>
            </Providers>
          </BreadcrumbProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
