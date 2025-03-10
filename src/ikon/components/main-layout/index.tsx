import { ReactNode } from "react";
import { BreadcrumbProvider } from "@/ikon/components/app-breadcrumb/BreadcrumbProvider";
import { SidebarInset, SidebarProvider } from "@/shadcn/ui/sidebar";
import MainSideBar from "@/ikon/components/main-sidebar";
import Header from "@/ikon/components/header";
import Footer from "@/ikon/components/footer";
import { AppSidebar, AppSidebarProvider } from "../app-sidebar";

function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "49px",
            } as React.CSSProperties
          }
        >
          <MainSideBar />
          <SidebarInset className="flex h-screen overflow-hidden">
            <Header />
            <div className="flex-grow overflow-hidden flex">
              <AppSidebarProvider>
                <AppSidebar />
                <div className="p-2 lg:p-4 flex-grow overflow-hidden">{children}</div>
              </AppSidebarProvider>
            </div>
            <Footer />
          </SidebarInset>
        </SidebarProvider>
      </BreadcrumbProvider>
    </>
  );
}

export default MainLayout;
