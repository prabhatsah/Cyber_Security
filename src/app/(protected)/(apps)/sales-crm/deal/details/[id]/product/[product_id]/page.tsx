import { redirect } from "next/navigation";

export default async function DealDetails({
  params,
}: {
  params: Promise<{ product_id: string }>;
}) {
  const productIdentifier = (await params)?.product_id || "";
  console.log("identifier ", productIdentifier);
 redirect(`./${productIdentifier}/schedule`)
}
