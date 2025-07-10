import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { toast } from "sonner";

export default function BidReviewModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}) {
  async function bidShortList() {
    console.log("Shortlist");

    const softwareId = await getSoftwareIdByNameVersion(
      "Tender Management",
      "1"
    );
    const response = await getMyInstancesV2({
      processName: "Tender Management",
      predefinedFilters: { taskName: "Bidding Started" },
      processVariableFilters: { bidId: data.bidId },
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const taskData: any = response[0].data;
      const tenderFlow = {
        "Awarded Tender": "PENDING",
        "Contract Finalisation": "PENDING",
        "Supplier Negotiation": "IN PROGRESS",
        "Supplier Shortlisted": "COMPLETED",
      };

      await invokeAction({
        taskId: taskId,
        transitionName: "Go to Bid Shortlisting & Negotiations",
        data: {
          ...taskData,
          ...data,
          bidStatus: "shortlisted",
          tenderFlow: tenderFlow,
        },
        processInstanceIdentifierField: "bidId,tenderId",
        softwareId: softwareId,
      });
      toast.success("Shortlisted");
    }
  }
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-6">
          <DialogHeader>
            <DialogTitle>Bid Review</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tender">Tender Response</TabsTrigger>
              <TabsTrigger value="supplier">Supplier Details</TabsTrigger>
            </TabsList>
            <TabsContent value="tender">
              {data?.responseDraftContent}
            </TabsContent>
            <TabsContent value="supplier">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Supplier Name</h3>
                  <p>{data?.bidderName}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Bid Time</h3>
                  <p>{data?.bidCompletionTime}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button
              type="submit"
              onClick={async () => {
                await bidShortList();
              }}
            >
              Shortlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
