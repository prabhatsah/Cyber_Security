import "./deal-details.css";
import { redirect } from "next/navigation";

export default async function DealDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const dealIdentifier = (await params)?.id || "";
  console.log("identifier ", dealIdentifier);
  redirect(`/sales-crm/deal/details/${dealIdentifier}/products`)
}
