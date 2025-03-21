import * as api from "@/utils/api";
import { ConfigurationProvider } from "../components/ConfigurationContext";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";

export async function fetchdata() {
  const tableName = "cloud_config";
  const orderByField = "id";
  const data = await api.fetchData(tableName, orderByField);
  return data;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let currentTime = new Date();
  console.log("Layout called: " + currentTime.toISOString());

  // const configData = await fetchdata();
  // console.log("configData - ");
  // console.log(configData.data);

  return (
    <>
      <div className="flex h-full">
        {/* <ConfigurationProvider configData={configData.data}> */}
        {children}
        {/* </ConfigurationProvider> */}
      </div>
    </>
  );
}
