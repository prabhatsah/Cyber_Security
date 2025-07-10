import React, { useRef } from 'react';
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
//import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/shadcn/ui/table";
import { Separator } from "@radix-ui/react-separator";
import { Building2, Download, X } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { getDateFormat } from "@/ikon/utils/actions/format";
import { getFormattedAmountByUserPreference } from "@/app/(protected)/(apps)/sales-crm/deal/details/[id]/(details)/components/won-form/components/getActualRevenueIncludingVat";
import { Card, CardContent, CardHeader } from '@/shadcn/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

interface ViewInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    viewInvoiceContent: any;
    quotationDetailsDealTableInvoice: any;
}

const ViewInvoiceModal = ({
    isOpen,
    onClose,
    viewInvoiceContent,
    quotationDetailsDealTableInvoice,
}: ViewInvoiceModalProps) => {
    const pdfRef = useRef<HTMLDivElement | null>(null);

    const downloadPDF = async () => {
        console.log("Download clicked");
        const input = pdfRef.current;
    
        if (!input) {
            console.error("PDF reference is null");
            return;
        }
    
        // Clone content to ensure it renders correctly in the PDF
        const clone = input.cloneNode(true) as HTMLDivElement;
        document.body.appendChild(clone);
    
        // Ensure styles are applied
        clone.style.height = "auto";
        clone.style.overflow = "visible";
        clone.style.position = "absolute";
        clone.style.left = "-9999px"; 
        clone.style.top = "0";
    
        await new Promise((resolve) => setTimeout(resolve, 500));
    
        try {
            const canvas = await html2canvas(clone, {
                scale: 3, // Higher resolution
                useCORS: true,
                scrollY: -window.scrollY,
                windowHeight: clone.scrollHeight,
                logging: false,
                backgroundColor: "#ffffff",
            });
    
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
    
            // Calculate image dimensions
            const imgWidth = pageWidth;
            let imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            let heightLeft = imgHeight;
            let position = 0;
    
            // First page
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
    
            // Add new pages
            while (heightLeft > 0) {
                position -= pageHeight; // Move position up by the page height
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
    
            pdf.save("invoice.pdf");
        } finally {
            // Remove cloned element
            document.body.removeChild(clone);
        }
    };
    
    

    console.log("quotationDetailsDealTableInvoice", quotationDetailsDealTableInvoice);
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
                <DialogHeader className="">
                    <DialogTitle className="flex justify-between mr-8">
                        <span>View Invoice</span>
                        <IconTextButtonWithTooltip tooltipContent={"Download Invoice"} onClick={downloadPDF}>
                            <Download/> Invoice
                        </IconTextButtonWithTooltip>
                    </DialogTitle>
                </DialogHeader>
                <div ref={pdfRef} className="container mx-auto p-6 space-y-4 h-[600px] overflow-auto bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Account Information */}
                        <Card>
                            <CardHeader className="pb-3">
                                <h6 className="text-lg ">Account</h6>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {viewInvoiceContent.channelPartnerName && (
                                    <p className="text-sm">{viewInvoiceContent.channelPartnerName}</p>
                                )}
                                <p className="text-sm font-medium">{viewInvoiceContent.accountName}</p>
                                <p className="text-sm">{viewInvoiceContent.addressClient}</p>
                                <p className="text-sm">
                                    {viewInvoiceContent.clientContact.city}
                                    {viewInvoiceContent.clientContact.pinCode && `, ${viewInvoiceContent.clientContact.pinCode}`}
                                </p>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-sm">
                                    <span>Contact Person:</span>
                                    <span>
                                        {viewInvoiceContent.contact_first_name} {viewInvoiceContent.contact_last_name}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Manager */}
                        <Card>
                            <CardHeader className="pb-3">
                                <h6 className="text-lg ">Account Manager</h6>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm font-medium">{viewInvoiceContent.accountManager}</p>
                                <p className="text-sm">{viewInvoiceContent.accountManagerEmail}</p>
                                <Separator className="my-2" />
                                <p className="text-sm">
                                    {viewInvoiceContent.addressInfo.street}, {viewInvoiceContent.addressInfo.landmark}
                                </p>
                                <p className="text-sm">
                                    {viewInvoiceContent.addressInfo.city}, {viewInvoiceContent.addressInfo.postalCode}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Invoice Details */}
                        <Card>
                            <CardHeader className="pb-3">
                                <h6 className="text-lg ">Invoice Details</h6>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Invoice Number:</span>
                                    <span>
                                        {viewInvoiceContent.newNum}-{viewInvoiceContent.accountCode}-{viewInvoiceContent.invoiceDateforInvoiceNo}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Invoice Date:</span>
                                    <span>{getDateFormat(viewInvoiceContent.invoiceGenerated)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Due Date:</span>
                                    <span>{getDateFormat(viewInvoiceContent.licenseEndDate)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Total Amount ({viewInvoiceContent.currencyNotinUSD || 'USD'}):</span>
                                    <span>{getFormattedAmountByUserPreference(viewInvoiceContent.billingAmount)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader className="pb-3">
                            <h6 className="text-lg ">Executive Summary</h6>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{viewInvoiceContent.commentsSection}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <h6 className="text-lg ">Product Details</h6>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {viewInvoiceContent.psInitial && (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">Product Name:</span>
                                        <span>Professional Service</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">Description:</span>
                                        <span>{viewInvoiceContent.PSDescription || 'N/A'}</span>
                                    </div>

                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Staff Name</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead className="text-right">No. of Months</TableHead>
                                                <TableHead className="text-right">
                                                    SCR ({viewInvoiceContent.currencyNotinUSD || 'USD'})
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Billing Amount ({viewInvoiceContent.currencyNotinUSD || 'USD'})
                                                </TableHead>
                                                {viewInvoiceContent.currencyNotinUSD && (
                                                    <TableHead className="text-right">Billing Amount (USD)</TableHead>
                                                )}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.values(viewInvoiceContent.PStableData || {}).map((staff: any, index: number) => (
                                                <TableRow key={index}>
                                                    <TableCell>{staff.EmployeeName}</TableCell>
                                                    <TableCell>{staff.Role}</TableCell>
                                                    <TableCell className="text-right">{getFormattedAmountByUserPreference(staff.FTE)}</TableCell>
                                                    <TableCell className="text-right">{getFormattedAmountByUserPreference(staff.SCR)}</TableCell>
                                                    <TableCell className="text-right">{getFormattedAmountByUserPreference(staff.billingAmount)}</TableCell>
                                                    {viewInvoiceContent.currencyNotinUSD && (
                                                        <TableCell className="text-right">{getFormattedAmountByUserPreference(staff.billingAmountInUSD || 0)}</TableCell>
                                                    )}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={4}>Total</TableCell>
                                                <TableCell className="text-right">{getFormattedAmountByUserPreference(viewInvoiceContent.totalPSBillingAmount || 0)}</TableCell>
                                                {viewInvoiceContent.currencyNotinUSD && (
                                                    <TableCell className="text-right">{getFormattedAmountByUserPreference(viewInvoiceContent.totalPSBillingAmountInUSD || 0)}</TableCell>
                                                )}
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                            )}

                            {viewInvoiceContent.ulInitial && (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">Product Name:</span>
                                        <span>User License</span>
                                    </div>

                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Billing Cycle</TableHead>
                                                <TableHead className="text-right">Cost/License/Month (USD)</TableHead>
                                                <TableHead className="text-right">License Start Date</TableHead>
                                                <TableHead className="text-right">License End Date</TableHead>
                                                <TableHead className="text-right">No. of License</TableHead>
                                                {viewInvoiceContent.currencyNotinUSD && (
                                                    <TableHead className="text-right">
                                                        Billing Amount ({viewInvoiceContent.currencyNotinUSD})
                                                    </TableHead>
                                                )}
                                                <TableHead className="text-right">Billing Amount (USD)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.values(viewInvoiceContent.ULtableData || {}).map((license: any, index: number) => (
                                                <TableRow key={index}>
                                                    <TableCell>{license.billingCycle}</TableCell>
                                                    <TableCell className="text-right">
                                                        {getFormattedAmountByUserPreference(license.costPerLicensePerMonth)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {getFormattedAmountByUserPreference(license.licenseStartDate)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {getFormattedAmountByUserPreference(license.licenseEndDate)}
                                                    </TableCell>
                                                    <TableCell className="text-right">{license.noOfLicense}</TableCell>
                                                    {viewInvoiceContent.currencyNotinUSD && (
                                                        <TableCell className="text-right">
                                                            {getFormattedAmountByUserPreference(license.eachProductRevenue)}
                                                        </TableCell>
                                                    )}
                                                    <TableCell className="text-right">
                                                        {getFormattedAmountByUserPreference(license.eachProductRevenue)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell>Total</TableCell>
                                                <TableCell className="text-right">
                                                    {getFormattedAmountByUserPreference(viewInvoiceContent.totalCostPerLicense || 0)}
                                                </TableCell>
                                                <TableCell colSpan={2}></TableCell>
                                                <TableCell className="text-right">{viewInvoiceContent.totoalNoOfLicense}</TableCell>
                                                <TableCell className="text-right">
                                                    {getFormattedAmountByUserPreference(viewInvoiceContent.totoalULBillingAmount || 0)}
                                                </TableCell>
                                                {viewInvoiceContent.currencyNotinUSD && (
                                                    <TableCell className="text-right">
                                                        {getFormattedAmountByUserPreference(viewInvoiceContent.totoalULBillingAmount || 0)}
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <h6 className="text-lg ">Summary</h6>
                        </CardHeader>
                        <CardContent>
                            <Table className="w-full border">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product Name</TableHead>
                                        <TableHead className="text-right">Start Date</TableHead>
                                        <TableHead className="text-right">End Date</TableHead>
                                        {quotationDetailsDealTableInvoice.isClientCurrencyNotSameAsUSD && (
                                            <TableHead className="text-right">Billing Amount ({quotationDetailsDealTableInvoice.currency})</TableHead>
                                        )}
                                        <TableHead className="text-right">Discounted Amount ({quotationDetailsDealTableInvoice.currency})</TableHead>
                                        <TableHead className="text-right">Discounted Billing Amount ({quotationDetailsDealTableInvoice.currency})</TableHead>
                                        <TableHead className="text-right">Billing Amount (USD)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.values(quotationDetailsDealTableInvoice.productData || {}).map((product: any) => (
                                        <TableRow key={product.productIdentifier}>
                                            <TableCell>{product.productType}</TableCell>
                                            <TableCell className="text-right">{product.contractedStartDate}</TableCell>
                                            <TableCell className="text-right">{product.contractedEndDate}</TableCell>
                                            {quotationDetailsDealTableInvoice.isClientCurrencyNotSameAsUSD && (
                                                <TableCell className="text-right">{product.actualRevenue}</TableCell>
                                            )}
                                            <TableCell className="text-right">
                                                <span id={`eachDiscountedAmountforInvoice`}>{quotationDetailsDealTableInvoice.eachDiscountPercentforInvoice[product.productIdentifier]}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span id={`eachFinalBillingAmountforInvoice`}>{quotationDetailsDealTableInvoice.eachFinalBillingAmountforInvoice[product.productIdentifier]}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span id={`eachFinalBillingAmountforInvoiceClientCurrency`}>{quotationDetailsDealTableInvoice.eachFinalBillingAmountforInvoiceClientCurrency[product.productIdentifier]}</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={4}>Total Billing Amount</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell className="text-right">{quotationDetailsDealTableInvoice.totalDiscountedBillingAmountforInvoice}</TableCell>
                                        {quotationDetailsDealTableInvoice.isClientCurrencyNotSameAsUSD && (
                                            <TableCell className="text-right">{quotationDetailsDealTableInvoice.totalDiscountedBillingAmountforInvoiceinUSD || "0.00"}</TableCell>
                                        )}
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <h6 className="text-lg ">Payment Method</h6>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Bank:</span>
                                    <span>{viewInvoiceContent.bankingInfo.Bank_Name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Branch:</span>
                                    <span>{viewInvoiceContent.bankingInfo.Branch_Name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>IBAN:</span>
                                    <span>{viewInvoiceContent.bankingInfo.IBAN_Code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Account:</span>
                                    <span>{viewInvoiceContent.bankingInfo.Account_Name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount:</span>
                                    <span>{quotationDetailsDealTableInvoice.discountPercentageForDealforInvoice}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Billing amount excluding VAT:</span>
                                    <span id="finalBillingAmountforInvoice">{quotationDetailsDealTableInvoice.finalBillingAmountforInvoice}</span>
                                    {viewInvoiceContent.currencyNotinUSD && (
                                        <>
                                            <span id="finalBillingAmountforInvoiceInUSD">{quotationDetailsDealTableInvoice.finalBillingAmountforInvoiceInUSD}</span>
                                        </>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span>VAT:</span>
                                    <span id="vatAmount">{quotationDetailsDealTableInvoice.vatAmount}</span>
                                    {viewInvoiceContent.currencyNotInUSD && (
                                        <>
                                            <span id="vatAmountInUSD">{quotationDetailsDealTableInvoice.vatAmountInUSD}</span>
                                        </>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <span>Final Billing Amount:</span>
                                    <span id="finalBillingAmountIncludingVATforInvoice">{quotationDetailsDealTableInvoice.finalBillingAmountIncludingVATforInvoice}</span>
                                    {viewInvoiceContent.currencyNotInUSD && (
                                        <>
                                            <span id="finalBillingAmountIncludingVATforInvoiceCurr">{quotationDetailsDealTableInvoice.finalBillingAmountIncludingVATforInvoiceCurr}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 text-right">
                                {viewInvoiceContent.signature && (
                                    <div className="flex flex-col items-end space-y-2">
                                        <div
                                            className="h-16 w-32 bg-contain bg-center bg-no-repeat"
                                            style={{ backgroundImage: `url(${viewInvoiceContent.signature})` }}
                                        />
                                        <div className="w-32 border-t border-black pt-1 text-center">
                                            <span className="text-sm">Signature</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <h6 className="text-lg  mb-2">Terms & Conditions</h6>
                            <p className="text-sm text-destructive">
                                **This proposal along with all the attachments hereto shall be considered keross proprietary/confidential information and may not be distributed to other entities unless specially approved by Keross**
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewInvoiceModal;