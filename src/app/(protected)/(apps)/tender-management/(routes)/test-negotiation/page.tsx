"use client";
import { useState } from "react";
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

export default function Negotiation() {
  const [offers, setOffers] = useState([
    { id: 1, sender: "buyer", amount: 500, remarks: "Initial offer" },
    { id: 2, sender: "seller", amount: 700, remarks: "Counter offer" },
  ]);
  const [newOffer, setNewOffer] = useState("");
  const [newRemarks, setNewRemarks] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleOfferSubmit = () => {
    if (newOffer.trim() === "") return;
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
  };

  const acceptOffer = (offerId) => {
    alert(`Offer #${offerId} accepted!`);
  };

  const rejectOffer = (offerId) => {
    alert(`Offer #${offerId} rejected.`);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Negotiation</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mb-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`flex ${
                offer.sender === "buyer" ? "justify-start" : "justify-end"
              }`}
            >
              <Card className="p-3 rounded-lg w-fit bg-gray-800 text-white">
                <p className="text-sm">
                  {offer.sender === "buyer" ? "Buyer" : "Seller"} offered:
                </p>
                <p className="text-lg font-bold">${offer.amount}</p>
                <p className="text-sm italic text-gray-400">
                  Remarks: {offer.remarks}
                </p>
                {offer.sender === "seller" && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => acceptOffer(offer.id)}
                      variant="success"
                      size="sm"
                    >
                      <CheckCircle size={16} className="mr-1" /> Accept
                    </Button>
                    <Button
                      onClick={() => rejectOffer(offer.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <XCircle size={16} className="mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
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
