import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
//import LeadWorkflowComponent from "./LeadWorkflow";
import { InvoiceData, LeadData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import { console } from "inspector";
///import InvoiceWorkflowComponent from "./InvoiceWorkflow";
import { getUserIdWiseUserDetailsMap, getUsersByGroupName } from "@/ikon/utils/actions/users";
import InvoiceWorkflowComponent from "./InvoiceWorkflow";

export default async function InvoiceWorkflowLayout({ invoiceIdentifier, userEmails }: { invoiceIdentifier: string, userEmails: { label: string; value: string; }[] }) {

    const invoiceData = await getMyInstancesV2<InvoiceData>({
        processName: "Generate Invoice",
        predefinedFilters: { "taskName": "View Invoice" },
        processVariableFilters: { "invoiceIdentifier": invoiceIdentifier },
        projections: ['Data.AEDNumber','Data.PaymentMode','Data.PaidAmount', 'Data.accountDetails', 'Data.accountId', 'Data.accountManagerEmail', 'Data.dealIdentifier', 'Data.defaultContact', 'Data.invoiceDate', 'Data.invoiceIdentifier', 'Data.invoiceNumber', 'Data.invoiceStatus', 'Data.mailCc', 'Data.mailTo', 'Data.pdfName', 'Data.productInitials', 'Data.remarks', 'Data.remarksForLostInv', 'Data.revenue', 'Data.subject', 'Data.type'],

    });
    console.log("invoiceData workflow- ", invoiceData)

    const invoiceStatus = invoiceData[0].data.invoiceStatus;
    const invoiceDate = invoiceData[0].data.invoiceDate;
    const productInitials = invoiceData[0].data.productInitials;
    const thisInvoiceData = invoiceData[0].data;
    const dealInstanceData = await getMyInstancesV2({
        processName: "Deal",
        predefinedFilters: { "taskName": "View State" },
        processVariableFilters: { "dealIdentifier": invoiceData[0].data.dealIdentifier },
        projections: ["Data.accountDetails"]
    })
    const accountData = dealInstanceData.map((e: any) => e.data)[0].accountDetails;
    const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
    const bankInstanceData = await getMyInstancesV2({
        processName: "Banking Details",
        predefinedFilters: { "taskName": "Edit Bank Details" }
    })
    const accountNoWiseDetails: Record<string, any> = {}
    const BankData = (bankInstanceData[0].data as { bankDetails: any }).bankDetails;
    var defaultBankAEDNum = ""
    for (var i in BankData) {
        const accountNumber = BankData[i].AED_Number;
        accountNoWiseDetails[accountNumber] = BankData[i];
        if (BankData[i].Default_Bank) {
            defaultBankAEDNum = BankData[i].AED_Number;
        }

    }
    return (
        <Card className="h-1/2">
            <CardHeader className="flex flex-row justify-between items-center border-b">
                <CardTitle>Invoice Workflow</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <InvoiceWorkflowComponent invoiceIdentifier={invoiceIdentifier} invoiceStatus={invoiceStatus} userEmails={userEmails} accountData={accountData} invoiceDate={invoiceDate} productInitials={productInitials} userIdWiseUserDetailsMap={userIdWiseUserDetailsMap} accountNoWiseDetails={accountNoWiseDetails} thisInvoiceData={thisInvoiceData} defaultBankAEDNum={defaultBankAEDNum}/>
                {/* <LeadWorkflowComponent
                    leadIdentifier={leadIdentifier}
                    leadStatus={leadStatus}
                /> */}
            </CardContent>
        </Card>
    )
}