import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";
import { toast } from "sonner";

const getSupplierInReview = async (supplierId: string) => {
  const response: any[] = await getMyInstancesV2({
    processName: "RFP Supplier",
    predefinedFilters: { taskName: "Sent For Review" },
    processVariableFilters: { supplierId: supplierId },
  });

  return response;
};

export const approveSupplier = async (supplierId: string) => {
  const supplier = await getSupplierInReview(supplierId);
  try {
    if (supplier.length > 0) {
      const taskId = supplier[0].taskId;
      await invokeAction(
        {
          taskId: taskId,
          transitionName: "to approved",
          data: { ...supplier[0].data, status: "Approved" },
          processInstanceIdentifierField: "supplierId",
        },
        ["userGroups"]
      );
      toast.success("Supplier Approved");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to approve");
  }
};

export const rejectSupplier = async (supplierId: string) => {
  const supplier = await getSupplierInReview(supplierId);
  try {
    if (supplier.length > 0) {
      const taskId = supplier[0].taskId;
      await invokeAction({
        taskId: taskId,
        transitionName: "to rejected",
        data: { ...supplier[0].data, status: "Rejected" },
        processInstanceIdentifierField: "supplierId",
      });
      toast.success("Supplier Rejected");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to reject");
  }
};
