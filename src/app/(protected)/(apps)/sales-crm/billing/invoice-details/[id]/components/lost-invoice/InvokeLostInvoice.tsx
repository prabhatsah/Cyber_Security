import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService"

export default async function InvokeLostInvoice({invoiceData,invoiceIdentifier}:{invoiceData:any,invoiceIdentifier:string}) {

    invoiceData["invoiceStatus"] = "lost"

    const generateInvInstance: any = await getMyInstancesV2({
        processName: "Generate Invoice",
        predefinedFilters: {"taskName": "View Invoice"},
        processVariableFilters: {"invoiceIdentifier":invoiceIdentifier}

    })
    const taskId = generateInvInstance[0].taskId;
    invoiceData["lastUpdatedStatus"] = generateInvInstance[0].data.invoiceStatus
    console.log("taskId", taskId)
    await invokeAction({
        taskId: taskId,
        transitionName: "Update View Invoice",
        data: invoiceData,
        processInstanceIdentifierField: "invoiceStatus,dealIdentifier,defaultContact,invoiceIdentifier"
    })
    
}