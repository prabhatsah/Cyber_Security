import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import RFPTamplate from "../../../_components/buyer/my-templates/template-page/RFPTemplate";

export default async function page() {
  const response = await getMyInstancesV2({
    processName: "RFP Template",
    predefinedFilters: { taskName: "View" },
  });
  const rfpTemplateData = Array.isArray(response)
    ? response.map((e: any) => e.data)
    : [];

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{ level: 1, title: "RFP", href: "/tender-management" }}
      />
      <RFPTamplate templates={rfpTemplateData} />
    </>
  );
}
