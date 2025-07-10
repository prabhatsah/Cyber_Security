import { getCurrentUserId } from "@/ikon/utils/actions/auth";

import BidDetails from "../../_components/supplier/bid-details-section";
import BidWorkFlow from "../../_components/supplier/bid-workflow";
import getParticularBidData from "../../_components/supplier/get-particular-bid-data";
import { getPublishedDraftById } from "../../_utils/supplier/get-published-draft-data";
import getSupplierId from "../../_utils/supplier/supplier-id";
import GetDraftData from "../../my-rfpsold/components/draft-data/get-draft-data";
import { getUserGroups } from "@/ikon/utils/actions/users";
import Details from "../../_components/buyer/my-rfps/rfp-details-page/draft-details";
import moment from "moment";
import { Badge } from "@/shadcn/ui/badge";

export default async function TenderDetailsPage({
  params,
}: {
  params: Promise<{ tenderId: string }>;
}) {
  const draftId = (await params)?.tenderId || "";
  const draftDetails = await getPublishedDraftById(draftId);
  //const supplierId: any = await getSupplierId();
  const data = await getParticularBidData(draftId, "");
  const currUserId = await getCurrentUserId();
  const userGroupDetails = await getUserGroups(currUserId);
  console.log("data", draftDetails);
  console.log("userGroupDetails", userGroupDetails);

  const momentObj = moment(draftDetails?.submissionDeadline);
  const isAfter = momentObj.isAfter(moment(), "day");
  console.log("isAfter", isAfter);
  return (
    <>
      
      <div className="grid grid-cols-3 gap-2 h-full">
        <div className="col-span-1">
          <div className="flex justify-between flex-col items-center gap-4 h-full">
            <Details draftDetails={draftDetails} />
            <BidWorkFlow
              details={draftDetails}
              currentUserGroupDetails={userGroupDetails}
              // currentUserGroupDetails={{}}
            />
          </div>
        </div>
        <div className="col-span-2">
          <BidDetails bidDetails={data} draftDetails={draftDetails} />
        </div>
      </div>
    </>
  );
}
