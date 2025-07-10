"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Card } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Check, CheckCircle, XCircle } from "lucide-react";
import { getAccount } from "@/ikon/utils/actions/account";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { toast } from "sonner";
import {
  finalizeAcceptOffer,
  setSupplierOffer,
} from "../../../_utils/supplier/supplier-negotiation";
import clsx from "clsx";
import {
  IconButtonWithTooltip,
  IconTextButtonWithTooltip,
} from "@/ikon/components/buttons";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";

export default function SupplierNegotiation({
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
  const [isNegotiateComplete, setisNegotiateComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      const account = await getAccount();
      setAccountId(account.ACCOUNT_ID);
    };
    fetchAccount();
  }, [isOpen]);

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
        console.log(existing.offers, "offers");
        setOffers(existing.offers);
        setisNegotiateComplete(existing.negotiationComplete ? true : false);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isOpen]);

  const handleOfferSubmit = async () => {
    if (newOffer.trim() === "") return;
    try {
      const newOfferObj = {
        id: offers.length + 1,
        amount: Number(newOffer),
        remarks: newRemarks,
        sender: accountId,
      };
      await setSupplierOffer(bidId, newOfferObj);
      toast.success("Offer sent to buyer");
    } catch (error) {
      toast.error("Failed to submit offer");
    }
    setOffers([
      ...offers,
      {
        id: offers.length + 1,
        sender: accountId,
        amount: Number(newOffer),
        remarks: newRemarks,
      },
    ]);
    setNewOffer("");
    setNewRemarks("");
  };

  const acceptOffer = async (offerId: string) => {
    console.log(`Offer #${offerId} accepted!`);
    try {
      await finalizeAcceptOffer(bidId, offerId);
      toast.success("Offer accepted");
    } catch (error) {
      toast.error("Failed to perform action");
      console.error(error);
    }
  };

  const rejectOffer = (offerId: string) => {
    alert(`Offer #${offerId} rejected.`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background text-foreground border-gray-700">
        <DialogHeader>
          <DialogTitle>Negotiation</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px] p-2">
          {isLoading ? (
            <LoadingSpinner size={60} />
          ) : (
            <div className="space-y-3 mb-4 w-full">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className={`flex ${
                    offer.sender === accountId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={clsx("p-2 rounded-lg flex w-3/4 ", {
                      "border border-gray-400 text-foreground":
                        offer.sender === accountId,
                      "bg-accent text-foreground": offer.sender !== accountId,
                    })}
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <div>
                        <p className="text-sm">
                          Offer{" "}
                          {offer.sender === accountId ? "sent" : "received"}{" "}
                        </p>
                        <p className="text-lg font-bold">${offer.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground">
                          Remarks: {offer.remarks}
                        </p>
                      </div>
                    </div>

                    {offer.sender !== accountId && (
                      <IconTextButtonWithTooltip
                        onClick={() => acceptOffer(offer.id)}
                        tooltipContent="Accept Offer"
                      >
                        <Check size={16} /> Accept
                      </IconTextButtonWithTooltip>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="flex flex-col gap-3">
          <Input
            type="number"
            className="text-foreground border-gray-600"
            placeholder="Enter your offer..."
            value={newOffer}
            onChange={(e) => setNewOffer(e.target.value)}
          />
          <Input
            type="text"
            className="text-foreground border-gray-600"
            placeholder="Enter remarks..."
            value={newRemarks}
            onChange={(e) => setNewRemarks(e.target.value)}
          />
        </div>
        <DialogFooter>
          {/* {isNegotiateComplete && (
            <Button onClick={handleOfferSubmit}>Submit Offer</Button>
          )} */}
          <Button onClick={handleOfferSubmit}>Submit Offer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
