import "../../styles/globals.css";
import ConfigSidebar from "./components/ConfigSidebar";
import { ConfigurationProvider } from "./components/ConfigurationContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-full">
        <ConfigSidebar />
        <ConfigurationProvider>{children}</ConfigurationProvider>
      </div>
    </>
  );
}
