"use client";
import { useEffect, useState } from "react";
import { Card } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import { MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { toast } from "sonner";
import { setBuyerOffer } from "../../../_utils/buyer/my-rfps/set-buyer-offer";
import { getAccount } from "@/ikon/utils/actions/account";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { finalizeAcceptOffer } from "../../../_utils/supplier/supplier-negotiation";

export default function BuyerNegotiation({
  isOpen,
  onClose,
  bidId,
}: {
  isOpen: boolean;
  onClose: any;
  bidId: string | null;
}) {
  const [offers, setOffers] = useState<any>([]);
  const [newOffer, setNewOffer] = useState("");
  const [newRemarks, setNewRemarks] = useState("");
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      const account = await getAccount();
      setAccountId(account.ACCOUNT_ID);
    };
    fetchAccount();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMyInstancesV2({
        processName: "Tender Management",
        predefinedFilters: { taskName: "Bid Shortlisting and Negotiations" },
        processVariableFilters: { bidId: bidId },
      });
      if (response.length > 0) {
        const existing: any = response[0].data;
        if (!existing.offers) {
          existing.offers = [];
        }
        setOffers(existing.offers);
      }
    };
    fetchData();
  }, [offers]);

  const handleOfferSubmit = async () => {
    if (newOffer.trim() === "") return;
    try {
      const newOfferObj = {
        id: offers.length + 1,
        //sender: "buyer",
        amount: Number(newOffer),
        remarks: newRemarks,
      };
      await setBuyerOffer(bidId, newOfferObj);
      toast.success("Offer sent to supplier");
    } catch (error) {
      toast.error("Failed to submit offer");
    }
    setOffers([
      ...offers,
      {
        id: offers.length + 1,
        sender: "buyer",
        amount: Number(newOffer),
        remarks: newRemarks,
      },
    ]);
    setNewOffer("");
    setNewRemarks("");
    onClose();
  };

  const acceptOffer = async (offerId) => {
    console.log(`Offer #${offerId} accepted!`);
        try {
            await finalizeAcceptOffer(bidId, offerId);
            toast.success("Offer accepted")
        } catch (error) {
            toast.error("Failed to perform action");
            console.error(error);
        }
  };

  const rejectOffer = (offerId) => {
    alert(`Offer #${offerId} rejected.`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Negotiation</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px]">
          <div className="space-y-3 mb-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`flex ${
                  offer.sender === accountId ? "justify-start" : "justify-end"
                }`}
              >
                <Card className="p-3 rounded-lg w-fit  text-foreground">
                  <p className="text-sm">
                    {offer.sender === accountId ? "Buyer" : "Seller"} offered:
                  </p>
                  <p className="text-lg font-bold">${offer.amount}</p>
                  <p className="text-sm italic text-gray-400">
                    Remarks: {offer.remarks}
                  </p>
                  {offer.sender !== accountId && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        onClick={() => acceptOffer(offer.id)}
                        variant="success"
                        size="sm"
                      >
                        <CheckCircle size={16} className="mr-1" /> Accept
                      </Button>
                      {/* <Button
                        onClick={() => rejectOffer(offer.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <XCircle size={16} className="mr-1" /> Reject
                      </Button> */}
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex flex-col gap-3">
          <Input
            type="number"
            className="bg-gray-800 text-white border-gray-600"
            placeholder="Enter your offer..."
            value={newOffer}
            onChange={(e) => setNewOffer(e.target.value)}
          />
          <Input
            type="text"
            className="bg-gray-800 text-white border-gray-600"
            placeholder="Enter remarks..."
            value={newRemarks}
            onChange={(e) => setNewRemarks(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleOfferSubmit}>Submit Offer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
