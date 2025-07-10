import { getAccount } from "@/ikon/utils/actions/account";
import TenderProfilePage from "../../_components/profile/profile-page";

export default async function ProfilePage() {
  const account = await getAccount();
  const accountId = account.ACCOUNT_ID;
  return (
    <>
      <TenderProfilePage currAccountId={accountId} />
    </>
  );
}
