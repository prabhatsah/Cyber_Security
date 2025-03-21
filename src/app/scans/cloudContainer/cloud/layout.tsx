import * as api from "@/utils/api";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { ConfigurationProvider } from "../components/ConfigurationContext";

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
  console.log("Cloud layout starts, Current Time: " + currentTime.toISOString());

  // const configData = await fetchdata();
  // console.log("configData - ");
  // console.log(configData.data);

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 2,
          title: "Cloud Security",
          href: "/scans/cloudContainer/cloud",
        }}
      />
      <div className="flex h-full">
        {/* <ConfigurationProvider configData={configData.data}> */}
        {children}
        {/* </ConfigurationProvider> */}
      </div>
    </>
  );
}
