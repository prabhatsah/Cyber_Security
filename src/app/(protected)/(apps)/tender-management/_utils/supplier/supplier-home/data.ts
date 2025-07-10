import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { json } from "stream/consumers";

export default async function PublishedRfpData() {
    const response = await getMyInstancesV2({
          processName: "RFP Draft",
          predefinedFilters: { taskName: "View" },
          mongoWhereClause: JSON.stringify( { "data.publishedStatus": "published" }),
         
        });
          const publishedRfpDraftData = Array.isArray(response)
            ? response.map((e: any) => e.data)
            : [];
            return publishedRfpDraftData;
}