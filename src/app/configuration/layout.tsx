import Layout from "@/components/Layout";
import "../../styles/globals.css";
import ConfigSidebar from "./components/ConfigSidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Layout>
        <div className="flex h-full">
          <ConfigSidebar />
          {children}
        </div>
      </Layout>
    </>
  );
}
