"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Textarea } from "@/shadcn/ui/textarea";
import {
  getAllTemplates,
  saveTemplateSelectionData,
} from "../../../../../_utils/buyer/my-rfps/rfp-details-page/template-selection-functions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getProjectDetailsData } from "@/app/(protected)/(apps)/tender-management/_utils/common/get-particular-project-details-data";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import ReadOnlyEditor from "../../../../read-only-text-editor";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { LayoutTemplate, LucideIcon } from "lucide-react";
import { cn } from "@/shadcn/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftId?: string;
}

const SelectCardModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  draftId,
}) => {
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | undefined>(undefined);
  const [textareaValue, setTextareaValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const editorRef = useRef(null);

  const [department, setDepartment] = useState("")
  const [sector, setSector] = useState("")
  const [product, setProduct] = useState("")

  // Fetch Cards from API
  useEffect(() => {
    if (!isOpen) return;

    const fetchCards = async () => {
      setLoading(true);
      setError("");
      try {
        const draftData: any = await getProjectDetailsData(
          draftId ? draftId : ""
        );
        setDepartment(draftData.tender_department);
        setSector(draftData.sector);
        setProduct(draftData.product_service);
        const data: any[] = await getAllTemplates();
        console.log("Fetched Cards:", data);
        const filtered = data.filter(
          (temp) => temp.templateDepartment === draftData.tender_department
        );
        setCards(filtered);
        if (draftData.selectedTemplate) {
          setSelectedCard(draftData.selectedTemplate);
          setContentHandler(draftData.draftContent);
        }
      } catch (err) {
        setError("Failed to fetch cards. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [isOpen, draftId]);

  useEffect(() => {
    if (selectedCard && cards.length > 0) {
      const selectedTemplate = cards.find(
        (card) => card.templateId === selectedCard
      );
      if (selectedTemplate) {
        setTextareaValue(selectedTemplate.templateText);
        //handleSelect(selectedTemplate)
      }
    }
  }, [cards, selectedCard]);

  // Handle Card Selection
  const handleSelect = (card: any) => {
    setSelectedCard(card.templateId);
    setTextareaValue(card.templateText); // Fill textarea with templateText
    setContentHandler(card.templateText);
  };

  const setContentHandler = (html) => {
    console.log('received html',html)
    editorRef.current?.setHtml(html);
  };

  // Handle Submit
  const handleSubmit = async () => {
    console.log("Selected Card:", selectedCard);
    console.log("Textarea Value:", textareaValue);
    try {
      await saveTemplateSelectionData(selectedCard, textareaValue, draftId);
      toast.success("Template Saved");
      console.log("success");
    } catch (error) {
      console.log("error");
      toast.error("Failed to perform action");
    }
    onClose();
    console.log("refreshing page");
    router.replace('/tender-management/buyer/my-rfps/'+ draftId);
    //router.refresh();
    // startTransition(() => {
    //   router.refresh();
    // });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80dvw] h-[90dvh] p-6">
        <DialogHeader>
          <DialogTitle>Select a Template</DialogTitle>
        </DialogHeader>

        {/* Two-column layout */}
        {loading ? (
          <div className="md:h-[50vh] sm:h-[100vh] overflow-y-auto p-4">
            <LoadingSpinner size={60} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              {/* Left Section - Cards Grid */}
              <div className="col-span-1 overflow-y-auto h-[70dvh] p-2">
                {!loading && !error && (
                  <RadioGroup
                    value={selectedCard}
                    onValueChange={(val) =>
                      handleSelect(cards.find((c) => c.templateId === val))
                    }
                    className="space-y-2"
                  >
                    {cards.map((card) => (
                      <Card
                        key={card.templateId}
                        onClick={() => handleSelect(card)}
                        className={cn(
                          "cursor-pointer p-4 border h-[10dvh] flex items-center space-x-4 rounded-lg transition",
                          selectedCard === card.templateId
                            ? "border-blue-500 shadow-md bg-gray-100"
                            : "border-gray-200"
                        )}
                      >
                        {/* <LucideIcon
                          name="grid"
                          className="w-6 h-6 text-gray-500"
                        /> */}
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
                          <LayoutTemplate
                            name="grid"
                            className="w-6 h-6 text-gray-500"
                          />
                        </div>

                        <CardContent className="flex-1">
                          <h3 className="font-semibold">{card.templateName}</h3>
                          <p className="text-sm text-gray-500">
                            {card.templateSector}, {card.templateProduct}
                          </p>
                        </CardContent>
                        <RadioGroupItem
                          value={card.templateId}
                          className="h-5 w-5 border-gray-400"
                        />
                      </Card>
                    ))}
                  </RadioGroup>
                )}
              </div>

              {/* Right Section - Textarea */}
              <div className="col-span-2 h-[60dvh] p-2">
                {/* <Textarea
              className="h-[50dvh] resize-none"
              placeholder="Enter details here..."
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            /> */}
                {/* <ScrollArea className="h-[70dvh] border rounded-lg p-4">
                  <div
                    dangerouslySetInnerHTML={{ __html: textareaValue }}
                  ></div>
                </ScrollArea> */}
                <ReadOnlyEditor
                  value={textareaValue}
                  height={600}
                  onChange={() => {}}
                  ref={editorRef}
                />
              </div>
            </div>
            <DialogFooter>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSubmit} disabled={!selectedCard}>
                  Confirm Selection
                </Button>
              </div>
            </DialogFooter>
          </>
        )}

        {/* Footer - Confirm Button */}
      </DialogContent>
    </Dialog>
  );
};

export default SelectCardModal;
