import "../../styles/globals.css";
import ConfigSidebar from "./components/ConfigSidebar";
import { ConfigurationProvider } from "./components/ConfigurationContext";
import * as api from "@/utils/api";

export async function fetchdata() {
  const tableName = "cloud_config";
  const provider = "google-cloud-platform";
  const data = await api.fetchData(tableName, provider, "name", null, null);
  return data;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let currentTime = new Date();
  console.log("Layout called: " + currentTime.toISOString());

  const configData = await fetchdata();
  console.log("configData - ");
  console.log(configData.data);

  return (
    <>
      <div className="flex h-full">
        {/* <ConfigSidebar /> */}
        <ConfigurationProvider configData={configData.data}>
          {children}
        </ConfigurationProvider>
      </div>
    </>
  );
}
