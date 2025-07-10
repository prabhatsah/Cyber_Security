import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { DealData, InvoiceData, LeadData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import InvoiceCalculation from "../../../../component/invoice-calculation";
import { getDateFormat } from "@/ikon/utils/actions/format";
import { IconTextButtonWithTooltip, TextButton } from "@/ikon/components/buttons";
import { Button } from "@/app/(protected)/(apps)/ai-workforce/components/ui/Button";
import { Cross, Download, Eye, X } from "lucide-react";
import ViewInvoice from "../view-invoice-modal";
import ViewInvoiceCalc from "../../../../component/calculation-for-view-invoice";
import DownloadInvoice from "../download-invoice";
import LostInvoice from "../lost-invoice";

export default async function InvoiceDetailsComponent({ invoiceIdentifier, dateObj }: { invoiceIdentifier: string, dateObj : {startDate : string, endDate : string} }): Promise<ReactNode> {

    // const leadsData = await getMyInstancesV2<LeadData>({
    //     processName: "Leads Pipeline",
    //     predefinedFilters: { taskName: "View State" },
    //     mongoWhereClause: `this.Data.leadIdentifier == "${leadIdentifier}"`,
    //     projections: ["Data.organisationDetails", "Data.salesManager", "Data.leadStatus", "Data.leadType"],
    // });
    const { gridData } = await InvoiceCalculation();
    var thisInvoiceData: InvoiceData = gridData.find((inv) => inv.invoiceIdentifier === invoiceIdentifier) || {} as InvoiceData;
    var { viewInvoiceContent , quotationDetailsDealTableInvoice} = await ViewInvoiceCalc({ invoiceIdentifier });
    console.log("viewInvoiceContent", viewInvoiceContent);

    // console.log("leadIdWiseLeadData", leadsData);
    // const leadIdWiseLeadData = leadsData[0].data;

    return (
        <>
        <Card className="h-1/2 flex flex-col">
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 4,
                    title: thisInvoiceData.invoiceNumber,
                    href: `/sales-crm/billing/invoice-details/${thisInvoiceData.invoiceIdentifier}`,
                }}
            />
            <CardHeader className="flex flex-row justify-between items-center border-b">
                <CardTitle>Invoice Details</CardTitle>
                <LostInvoice invoiceIdentifier={invoiceIdentifier}/>
                {/* <IconTextButtonWithTooltip tooltipContent={"Lost Invoice"} ><X/> Lost</IconTextButtonWithTooltip> */}
                {/* <DropdownMenuWithEditLead leadIdentifier={leadIdentifier} /> */}
            </CardHeader>
            <CardContent className="grid gap-2 p-0 overflow-hidden">
                <div className="flex flex-col flex-grow overflow-auto">
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Account Manager :{" "}
                        {thisInvoiceData.accountManager}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Account : {thisInvoiceData.accountName}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Invoice Date :{" "}
                        {thisInvoiceData.invoiceDates}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Due Date : {thisInvoiceData.receiptDates}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Status :{" "}
                        {thisInvoiceData.invoiceStatus}
                    </span>
                    <span className="flex gap-2 align-middle border-b py-2 px-3">
                        Start Date :{" "}
                       {getDateFormat(dateObj.startDate)}
                    </span>
                    <span className="flex gap-2 align-middle py-2 px-3">
                        End Date :{" "}
                        {getDateFormat(dateObj.endDate)}
                    </span>
                    <span className="flex gap-2 justify-center align-middle border-b py-2 px-3">
                       <ViewInvoice viewInvoiceContent={viewInvoiceContent} quotationDetailsDealTableInvoice={quotationDetailsDealTableInvoice}/>
                        
                        {/* <DownloadInvoice viewInvoiceContent={viewInvoiceContent} quotationDetailsDealTableInvoice={quotationDetailsDealTableInvoice}/> */}
                    </span>
                </div>
            </CardContent>
        </Card>
        
        </>
    )
}