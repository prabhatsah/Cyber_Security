import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService"

export default async function InvokePaymentStatus({invoiceData,invoiceIdentifier}:{invoiceData:any,invoiceIdentifier:string}) {

    invoiceData["invoiceStatus"] = "paid"

    const generateInvInstance = await getMyInstancesV2({
        processName: "Generate Invoice",
        predefinedFilters: {"taskName": "Partially Paid Invoice"},
        processVariableFilters: {"invoiceIdentifier":invoiceIdentifier}

    })
    const taskId = generateInvInstance[0].taskId;
    console.log("taskId", taskId)
    await invokeAction({
        taskId: taskId,
        transitionName: "Transition To Paid From Partially paid",
        data: invoiceData,
        processInstanceIdentifierField: "invoiceStatus,dealIdentifier,defaultContact,invoiceIdentifier"
    })
    
}