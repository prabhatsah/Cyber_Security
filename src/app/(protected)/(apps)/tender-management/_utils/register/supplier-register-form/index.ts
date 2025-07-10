import { getCurrentUserId } from "@/ikon/utils/actions/auth";
import { getUserGroups } from "@/ikon/utils/actions/users";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";

export const startRegistration = async (data: Record<string, any>) => {
  try {
    const processId = await mapProcessName({ processName: "RFP Supplier" });
    await startProcessV2(
      {
        processId,
        data: data,
        processIdentifierFields: "supplierId",
      },
      ["userGroups"]
    );
  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};

export const getSupplierRegistrationData = async (accountId: string | null) => {
  const response: any[] = await getMyInstancesV2({
    processName: "Tender Management User Register",
    predefinedFilters: { taskName: "View User registration" },
    processVariableFilters: { accountId: accountId },
  });
  const supplierData = response.length > 0 ? response[0].data.supplierDetails : {};

  return supplierData;
};

export const getBuyerRegistrationData = async (accountId: string | null) => {
  const response: any[] = await getMyInstancesV2({
    processName: "Tender Management User Register",
    predefinedFilters: { taskName: "View User registration" },
    processVariableFilters: { accountId: accountId },
  });
  const supplierData =
    response.length > 0 ? response[0].data.buyerDetails : {};

  return supplierData;
};

export const getAllSuppliers = async () => {
  const response: any[] = await getMyInstancesV2({
    processName: "RFP Supplier",
    predefinedFilters: { taskName: "View" },
    //processVariableFilters: { supplierId: supplierId },
  });
  const supplierData =
    response.length > 0 ? response.map((res) => res.data) : [];

  return supplierData;
};

export const editSupplierRegistrationData = async (
  accountId: string,
  editedData: Record<string, any>
) => {
  try {
    const response = await getMyInstancesV2({
      processName: "Tender Management User Register",
      predefinedFilters: { taskName: "Edit User registration" },
      processVariableFilters: { accountId: accountId },
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const data : any = response[0].data;
      await invokeAction({
        taskId: taskId,
        transitionName: "Update Edit User Registration",
        data: { ...data, supplierDetails: editedData },
        processInstanceIdentifierField: "accountId",
      });
    }
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const editBuyerRegistrationData = async (
  accountId: string,
  editedData: Record<string, any>
) => {
  try {
    const response = await getMyInstancesV2({
      processName: "Tender Management User Register",
      predefinedFilters: { taskName: "Edit User registration" },
      processVariableFilters: { accountId: accountId },
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const data: any = response[0].data;
      await invokeAction({
        taskId: taskId,
        transitionName: "Update Edit User Registration",
        data: { ...data, buyerDetails: editedData },
        processInstanceIdentifierField: "accountId",
      });
    }
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const getCurrentSupplierId = async () => {
  const currUser = await getCurrentUserId();
  const userGroupDetails = await getUserGroups(currUser);
  console.log(userGroupDetails, "curr user groups");
  const userGroupArray = userGroupDetails.map((group: any) => group.groupName);
  console.log("group arr", userGroupArray);
  const allSuppliers = await getAllSuppliers();
  const pendingOrReviewSuppliers = allSuppliers.filter(
    (supplier) => supplier.status === "Pending" || supplier.status === "Review"
  );
  let currSupplier = null;
  pendingOrReviewSuppliers.forEach((supplier) => {
    const id = supplier.supplierId;
    const name = supplier.companyName;
    const group = `Supplier_${name}_${id}`;
    if (userGroupArray.includes(group)) currSupplier = id;
  });
  return currSupplier;
};
