import SupplierHomeComponent from "./_components/supplier/supplier-home-component";
import TenderHomePageWithTabs from "./_components/supplier/tender-homepage-tabs";
import { startRegisterInstanceIfNotPresent } from "./_utils/profile/start-profile-instance";
import { getCurrentAccountBids } from "./_utils/supplier/get-current-account-bids";
import getPublishedDraft from "./_utils/supplier/get-published-draft-data";

export default async function SupplierHomePage() {
  await startRegisterInstanceIfNotPresent();

  const publishedDraftData = await getPublishedDraft();
  const currentAccountBids = await getCurrentAccountBids();

  console.log('publishedDraftData', publishedDraftData);
  console.log('currentAccountBids', currentAccountBids);

  return (
    <TenderHomePageWithTabs
      publishedDraftData={publishedDraftData}
      currentAccountBids={currentAccountBids}
    />
  );
  //return <SupplierHomeComponent data={publishedDraftData} />;
}
