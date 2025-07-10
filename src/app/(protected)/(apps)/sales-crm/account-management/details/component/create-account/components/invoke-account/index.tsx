import { z } from "zod";

import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { accountSchema } from "../account-form-schema";
// import { RoleSchema } from "../edit-role-form-component/editRoleFormSchema";


export async function editRoleSubmit(
    data: z.infer<typeof accountSchema>,
) {
    try {
        const instanceData = await getMyInstancesV2({
            processName: "Account",
            predefinedFilters: { taskName: "Edit State" },
            projections: ["Data"],
            mongoWhereClause: `this.Data.accountIdentifier == "${data.accountIdentifier}"`,
        });
        const result = await invokeAction({
            taskId: instanceData[0].taskId,
            transitionName: "Update Edit State",
            data: data,
            processInstanceIdentifierField: "accountIdentifier,accountName,accountManager,createdOn,updatedOn",
        });
        console.log(result)
    } catch (error) {
        console.error("Failed to invoke action:", error);
    }
}
