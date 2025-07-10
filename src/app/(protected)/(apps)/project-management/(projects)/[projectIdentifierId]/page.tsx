import { redirect } from "next/navigation";

export default async function ProjectDetails({
  params,
}: {
  params: Promise<{ projectIdentifierId: string }>;
}) {
  const productIdentifier = (await params)?.projectIdentifierId || "";
  console.log("identifier ", productIdentifier);
  redirect(`./${productIdentifier}/summary`)
}
