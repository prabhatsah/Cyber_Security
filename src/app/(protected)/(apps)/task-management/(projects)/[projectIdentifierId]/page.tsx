import { redirect } from "next/navigation";

export default async function IssueDetails({
  params,
}: {
  params: Promise<{ projectIdentifierId: string }>;
}) {
  const projectIdentifierId = (await params)?.projectIdentifierId || "";
  console.log("identifier ", projectIdentifierId);
 redirect(`./${projectIdentifierId}`)
}
