import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";


export const startTemplate = async (newTemplate: Record<string, any>) => {
  try {
    const processId = await mapProcessName({ processName: "Response Template" });
    await startProcessV2({
      processId,
      data: newTemplate,
      processIdentifierFields: "templateId",
    });
  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};

export const getTemplateData = async (templateId: string) => {
  const response = await getMyInstancesV2({
    processName: "Response Template",
    predefinedFilters: { taskName: "View" },
    processVariableFilters: { templateId: templateId },
  });
  console.log("received response", response);
  const templateData: any[] = Array.isArray(response)
    ? response.map((e: any) => e.data)
    : [];

  console.log("received data", templateData);

  return templateData[0];
};

export const editTemplateData = async (templateId : string, editedTemplate: Record<string, any>) => {
  try {
    const response = await getMyInstancesV2({
        processName: "Response Template",
        predefinedFilters: { taskName: "Templates" },
        processVariableFilters: { templateId: templateId },
      });

      if(response.length > 0){
        const taskId = response[0].taskId;
        await invokeAction({
          taskId: taskId,
          transitionName: "Edit Templates",
          data: editedTemplate,
          processInstanceIdentifierField: "templateId",
        });
      }

  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
}
