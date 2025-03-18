import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "../styles/globals.css";
import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import GlobalLoadingSpinner from "@/components/GlobalLoadingSpinner";
import Layout from "@/components/Layout";
import ClientLayout from "@/components/ClientLayout";

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
    // <html lang="en">
    //   <body className={`${inter.className} dark:bg-gray-950`}>
    //     <LoadingProvider>
    //       <GlobalLoadingSpinner />
    //       <BreadcrumbProvider>
    //         <Providers>
    //           <Layout>{children}</Layout>
    //         </Providers>
    //       </BreadcrumbProvider>
    //     </LoadingProvider>
    //   </body>
    // </html>

    <html lang="en" className="dark">
      <body className="">
        <LoadingProvider>
          <GlobalLoadingSpinner />
          <BreadcrumbProvider>
            <Providers>
              <ClientLayout>{children}</ClientLayout>{" "}
            </Providers>
          </BreadcrumbProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
