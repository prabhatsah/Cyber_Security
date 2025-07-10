import {
  getMyInstancesV2,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { toast } from "sonner";

const updateTenderInterested = async (rowData: any, department: string) => {
  console.log(rowData);
  const tenderId = rowData.id;

  try {
    const response = await getMyInstancesV2({
      processName: "External Tenders",
      predefinedFilters: { taskName: "Edit" },
      processVariableFilters: { tenderId: tenderId },
    });

    if (response.length > 0) {
      console.log("Already interested");
      toast.info("Already present in my bids");
      return;
    } else {
      const processId = await mapProcessName({
        processName: "External Tenders",
      });
      await startProcessV2({
        processId,
        data: { ...rowData, tenderId: rowData.id, department },
        processIdentifierFields: "tenderId",
      });
      toast.success("Updated");
    }
  } catch (error) {
    console.error("error", error);
    throw new Error();
  }
};

export { updateTenderInterested };
