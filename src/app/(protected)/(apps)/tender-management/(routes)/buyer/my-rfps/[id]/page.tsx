import Details from "../../../../_components/buyer/my-rfps/rfp-details-page/draft-details";
import DraftView from "../../../../_components/buyer/my-rfps/rfp-details-page/draft-view";
import Workflow from "../../../../_components/buyer/my-rfps/rfp-details-page/draft-workflow";
import { RfpDraft } from "../../../../_utils/common/types";
import GetDraftData from "../../../../my-rfpsold/components/draft-data/get-draft-data";
import TenderPage from "../../../../_components/buyer/my-rfps/rfp-details-page/tender-details-view";
import getBidList from "../../../../_utils/buyer/my-rfps/rfp-details-page/get-bid-list";
import { getCurrentUserId } from "@/ikon/utils/actions/auth";
import { getUserGroups } from "@/ikon/utils/actions/users";
import { getAccount } from "@/ikon/utils/actions/account";

import {
  getAccountTree,
  getFullAccountTree,
} from "@/ikon/utils/api/accountService";

export default async function DraftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const draftId = (await params)?.id || "";
  const draftDetails = await GetDraftData(draftId);
  const bidList = await getBidList(draftId);
  const currUserId = await getCurrentUserId();
  const userGroupDetails = await getUserGroups(currUserId);
  const accountList = await getFullAccountTree();
  console.log("---------------------------------->", accountList);
  //console.log(userGroupDetails);

  for (let i = 0; i < bidList.length; i++) {
    if (bidList[i].accountId) {
      const data = accountList.children.filter(
        (account: any) => account.ACCOUNT_ID === bidList[i].accountId
      );
      bidList[i].accountName = data[0].ACCOUNT_NAME;
    }
  }

  console.log("bidList", bidList);

  const stepTracker: any = draftDetails?.stepTracker;

  let contentVisible = false;

  if (stepTracker["Publish"] != "COMPLETED") {
    return (
      <>
        <div className="grid grid-cols-3 gap-4 h-full">
          <div className="col-span-1">
            <div className="flex justify-between flex-col items-center gap-4">
              <Details draftDetails={draftDetails} />
              <Workflow
                draftDetails={
                  draftDetails
                } /*stepTracker={stepTracker} draftId={draftId}*/
                currentUserGroups={userGroupDetails}
              />
            </div>
          </div>
          <div className="col-span-2">
            <DraftView draftDetails={draftDetails} />
          </div>
          {/* <div className="grid-col-span-2">
          <CollaborationSection />
        </div> */}
        </div>
      </>
    );
    // redirect(`/sales-crm/lead/details/${leadIdentifier}/event-tab`)
  } else {
    return (
      <>
        <div className="h-full w-full overflow-y-auto">
          <TenderPage details={draftDetails} bidList={bidList} />
        </div>
      </>
    );
  }
}
