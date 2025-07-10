import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService"

export default async function InvokePaymentStatusPaidOrPartiallyPaid({invoiceData,invoiceIdentifier,invoiceStatus}:{invoiceData:any,invoiceIdentifier:string,invoiceStatus:string}) {

    invoiceData["invoiceStatus"] = invoiceStatus;

    const generateInvInstance = await getMyInstancesV2({
        processName: "Generate Invoice",
        predefinedFilters: {"taskName": "Raised Invoice"},
        processVariableFilters: {"invoiceIdentifier":invoiceIdentifier}

    })
    
    const taskId = generateInvInstance[0].taskId;
    console.log("taskId", taskId)
    if(invoiceStatus === "paid"){
        var transitionName = "Transition To Paid Invoice From Raised Invoice"
    }
    else{
        var transitionName = "Transition To Partially Paid Invoice From Raised Invoice"
    }
    await invokeAction({
        taskId: taskId,
        transitionName: transitionName,
        data: invoiceData,
        processInstanceIdentifierField: "invoiceStatus,dealIdentifier,defaultContact,invoiceIdentifier"
    })
}
    
    
