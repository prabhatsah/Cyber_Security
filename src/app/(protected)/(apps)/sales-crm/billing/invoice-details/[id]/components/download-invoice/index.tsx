"use client";
import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { useState } from "react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function DownloadInvoice({ viewInvoiceContent, quotationDetailsDealTableInvoice }: { viewInvoiceContent: any, quotationDetailsDealTableInvoice: any }) {
    const { openDialog } = useDialog();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const downloadPDF = () => {
        // Generate HTML string for the content
        const contentHTML = generateInvoiceHTML(viewInvoiceContent, quotationDetailsDealTableInvoice);
        
        const div = document.createElement('div');
        div.innerHTML = contentHTML;
        html2canvas(div, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save("download.pdf");
        });
    };

    // Function to generate HTML content for the invoice PDF
    const generateInvoiceHTML = (viewInvoiceContent: any, quotationDetailsDealTableInvoice: any) => {
        return `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1>Invoice</h1>
                <p><strong>Account:</strong> ${viewInvoiceContent.accountName}</p>
                <p><strong>Invoice Number:</strong> ${viewInvoiceContent.newNum}-${viewInvoiceContent.accountCode}-${viewInvoiceContent.invoiceDateforInvoiceNo}</p>
                <p><strong>Invoice Date:</strong> ${viewInvoiceContent.invoiceGenerated}</p>
                <p><strong>Due Date:</strong> ${viewInvoiceContent.licenseEndDate}</p>
                <p><strong>Total Amount:</strong> ${viewInvoiceContent.billingAmount}</p>
                <h2>Product Details</h2>
                ${generateProductDetailsHTML(viewInvoiceContent.PStableData, quotationDetailsDealTableInvoice)}
            </div>
        `;
    };

    // Function to generate product details HTML table
    const generateProductDetailsHTML = (PStableData: any, quotationDetailsDealTableInvoice: any) => {
        let rows = "";
        Object.values(PStableData || {}).forEach((staff: any) => {
            rows += `
                <tr>
                    <td>${staff.EmployeeName}</td>
                    <td>${staff.Role}</td>
                    <td>${staff.FTE}</td>
                    <td>${staff.SCR}</td>
                    <td>${staff.billingAmount}</td>
                </tr>
            `;
        });
        return `
            <table border="1" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Staff Name</th>
                        <th>Role</th>
                        <th>No. of Months</th>
                        <th>SCR</th>
                        <th>Billing Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    };

    return (
        <>
            <IconTextButtonWithTooltip tooltipContent={"Download Invoice"} onClick={downloadPDF}>
                <Download /> Download
            </IconTextButtonWithTooltip>
        </>
    );
}
