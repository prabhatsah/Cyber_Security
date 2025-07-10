import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import ResponseTemplate from "../../../_components/supplier/response-template-dt";


export default async function TemplateResponse(){
    const response = await getMyInstancesV2({
      processName: "Response Template",
      predefinedFilters: { taskName: "View" },
    });
     const rfpTemplateData = Array.isArray(response)
       ? response.map((e: any) => e.data)
       : [];
   
     return (
       <>
         <ResponseTemplate templates={rfpTemplateData} />
       </>
     );
}