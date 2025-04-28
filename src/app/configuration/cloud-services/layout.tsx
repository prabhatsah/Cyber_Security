import * as api from "@/utils/api";
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
  // const configData = await fetchdata();
  // console.log("configData - ");
  // console.log(configData.data);

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 0,
          title: "Configuration",
        }}
      />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Cloud Services",
          href: "/configuration/cloud-services",
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
