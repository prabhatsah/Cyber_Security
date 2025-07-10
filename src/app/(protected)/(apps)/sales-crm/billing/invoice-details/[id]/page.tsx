
import { redirect } from "next/navigation";

export default async function InvoiceDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const invoiceIdentifier = (await params)?.id || "";
  console.log("identifier ", invoiceIdentifier);
  redirect(`/sales-crm/billing/invoice-details/${invoiceIdentifier}`)
}
