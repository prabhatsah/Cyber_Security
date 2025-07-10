import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";
export const updatePolicy = async (updatedControlData, fullData) => {
    try{
        const controlPolicyInstances = await getMyInstancesV2({
            processName: "Control Objectives",
            predefinedFilters: { taskName: "edit control objective" }, 
            mongoWhereClause: `this.Data.frameworkId == "${fullData.frameworkId}"`,
          });

          const instanceOfParticular = controlPolicyInstances.find(e=>e.data.policyName == fullData.policyName)
        
          if (!controlPolicyInstances.length) {
            throw new Error("No control policy instances found");
          }
        
          const taskId = instanceOfParticular.taskId;
          
          await invokeAction({
            taskId: taskId,
            data: {
              ...fullData, 
              lastUpdatedOn : new Date().toISOString(),
              controls: updatedControlData 
            },
            transitionName: 'update edit controlObj',
            processInstanceIdentifierField: 'frameworkId',
          });
    }
    catch(e){
        console.log("error--",e);
        throw new Error("No control policy instances found");
    }
  };
