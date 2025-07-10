import { z } from "zod";

import { invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { LeadFormSchema } from "../edit_lead_form_component/editLeadFormSchema";

export async function editLeadSubmit(
  data: z.infer<typeof LeadFormSchema>,
  taskId: any
) {
  console.log("Form Data Submitted:", data);

  const leadData = {
    organisationDetails: {
      organisationName: data.organisationName || "",
      email: data.email || "",
      orgContactNo: data.orgContactNo || "",
      noOfEmployees: data.noOfEmployees || "",
      website: data.website || "",
      city: data.city || "",
      state: data.state || "",
      postalCode: data.postalCode || "",
      street: data.street || "",
      sector: data.sector || "",
      source: data.source || "",
      country: data.country || "",
    },
  };
  
  console.log("Final details Sent to API:", leadData);
  

  try {
    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Update Edit State",
      data: leadData,
      processInstanceIdentifierField: "leadIdentifier",
    });
    console.log(result)
} catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
