import { getAccount } from "@/ikon/utils/actions/account";
import ResponseDraftReview from "../../../../_components/supplier/response-draft-review";


interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const account = await getAccount();
  const accountId = account.ACCOUNT_ID
  return (
    <ResponseDraftReview draftId={params.id} accountId={accountId} />
  );
}
