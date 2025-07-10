import Details from "../../../../_components/buyer/my-rfps/rfp-details-page/draft-details";
import DraftView from "../../../../_components/buyer/my-rfps/rfp-details-page/draft-view";
import Workflow from "../../../../_components/buyer/my-rfps/rfp-details-page/draft-workflow";
import BidDetails from "../../../../_components/supplier/bid-details-section";
import BidWorkFlow from "../../../../_components/supplier/bid-workflow";
import getParticularBidData from "../../../../_components/supplier/get-particular-bid-data";
import getSupplierId from "../../../../_utils/supplier/supplier-id";
import GetDraftData from "../../../../my-rfpsold/components/draft-data/get-draft-data";

export default async function TenderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const draftId = (await params)?.id || "";
  const draftDetails = await GetDraftData(draftId);
  const supplierId: any = await getSupplierId();
  const data = await getParticularBidData(draftId);
  console.log(draftDetails);
  return (
    <>
      <div className="grid grid-cols-3 gap-4 h-full">
        <div className="col-span-1">
          <div className="flex justify-between flex-col items-center gap-4 h-full">
            <Details draftDetails={draftDetails} />
            <BidWorkFlow details={draftDetails} />
          </div>
        </div>
        <div className="col-span-2">
          <BidDetails bidDetails={data} />
        </div>
      </div>
    </>
  );
}
