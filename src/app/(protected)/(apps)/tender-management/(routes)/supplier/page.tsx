import SupplierHomeComponent from "../../_components/supplier/supplier-home-component";
import getPublishedDraft from "../../_utils/supplier/get-published-draft-data";

export default async function SupplierHomePage() {

    const publishedDraftData = await getPublishedDraft();
  return <SupplierHomeComponent data={publishedDraftData} />;
}