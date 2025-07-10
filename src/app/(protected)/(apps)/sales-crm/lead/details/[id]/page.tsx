import "./lead-details.css";
import { redirect } from "next/navigation";

export default async function LeadDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const leadIdentifier = (await params)?.id || "";
  console.log("identifier ", leadIdentifier);
  redirect(`/sales-crm/lead/details/${leadIdentifier}/event`)
}
