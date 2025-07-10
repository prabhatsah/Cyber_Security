import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { toast } from "sonner";

export const startEnvironmentData = async (envData: any) => {
  try {
    const processId = await mapProcessName({
      processName: "Environment Process",
    });
    await startProcessV2({
      processId,
      data: envData,
      processIdentifierFields: "",
    });
    console.log("success in staring the process ankit");
  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};

export const invokeEnvStatus = async (updatedStatus: string, envId: string) => {
  try {
    var mongoWhereClause = `this.Data.envId == '${envId}'`;
    const response = await getMyInstancesV2({
      processName: "Environment Process",
      predefinedFilters: { taskName: "Edit Environment Task" },
      mongoWhereClause: mongoWhereClause,
    });

    if (response.length > 0) {
      console.log("response delete-----", response);
      let taskId = response[0].taskId;
      response[0].data.envStatus = updatedStatus;

      await invokeAction({
        taskId: taskId,
        transitionName: "reassign Edit Task",
        data: response[0].data,
        processInstanceIdentifierField: envId,
      });
      console.log("SUCCESS IN INVOKE ACTION");
      toast.success("Enviornment updated successfully!");
    }
  } catch (error) {
    toast.error("Failed in Enviornment update!");
    console.error("Failed to update data:", error);
    throw error;
  }
};

export const invokeDeleteEnv = async (envId: string) => {
  try {
    var mongoWhereClause = `this.Data.envId == '${envId}'`;
    const response = await getMyInstancesV2({
      processName: "Environment Process",
      predefinedFilters: { taskName: "Edit Environment Task" },
      mongoWhereClause: mongoWhereClause,
    });

    if (response.length > 0) {
      console.log("response delete-----", response);
      let taskId = response[0].taskId;

      await invokeAction({
        taskId: taskId,
        transitionName: "delete environment",
        data: response[0].data,
        processInstanceIdentifierField: envId,
      });
      console.log("SUCCESS IN INVOKE ACTION");
      toast.success("Enviornment deleted successfully!");
    }
  } catch (error) {
    toast.error("Failed in environment deletion!");
    console.error("Failed to delete environment:", error);
    throw error;
  }
};

export const invokeLibraryAddition = async (
  libraryAdditionData: any,
  envId: string
) => {
  try {
    var mongoWhereClause = `this.Data.envId == '${envId}'`;
    const response = await getMyInstancesV2({
      processName: "Environment Process",
      predefinedFilters: { taskName: "Edit Environment Task" },
      mongoWhereClause: mongoWhereClause,
    });

    if (response.length > 0) {
      console.log("response delete-----", response);
      let taskId = response[0].taskId;

      var addingLibraries = [];
      console.log("libraryAdditionData---", libraryAdditionData);
      for (let i = 0; i < libraryAdditionData.length; i++) {
        let obj = {
          packageName: libraryAdditionData[i].packageName,
          packageVersion: libraryAdditionData[i].packageVersion || "N/A",
        };
        addingLibraries.push(obj);
      }
      console.log("addingLibraries----", addingLibraries);
      response[0].data["envPackages"] = addingLibraries;

      console.log(response);

      await invokeAction({
        taskId: taskId,
        transitionName: "add library",
        data: response[0].data,
        processInstanceIdentifierField: envId,
      });
      console.log("SUCCESS IN INVOKE ACTION");
      toast.success("Library Addition Successfull!");
    }
  } catch (error) {
    toast.error("Failed in adding library!");
    console.error("Failed in adding library:", error);
    throw error;
  }
};
