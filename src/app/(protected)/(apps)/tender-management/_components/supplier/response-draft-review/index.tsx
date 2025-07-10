"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Editor, EditorTools } from "@progress/kendo-react-editor";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shadcn/ui/sheet";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { getProjectDetailsData } from "@/app/(protected)/(apps)/tender-management/_utils/common/get-particular-project-details-data";
import getParticularBidData from "../get-particular-bid-data";
import KendoEditor from "../../text-editor-component";
import { ChatSection } from "../../buyer/my-templates/template-form/ChatSection";
import { saveDraftFinalizeData } from "../../../_utils/supplier/bid-workflow-functions";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";
import { Expand, Minimize } from "lucide-react";

const {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignJustify,
  Undo,
  Redo,
} = EditorTools;

// Mock API function to fetch existing data
const fetchTemplateById = async (id: string) => {
  return {
    templateName: "Sample Template",
    sector: "IT",
    content: "<p>Sample content in Kendo Editor</p>",
  };
};

interface TemplateEditorProps {
  draftId: string;
  accountId: string;
}

export default function ResponseDraftReview({
  draftId,
  accountId,
}: TemplateEditorProps) {
  console.log("id received", draftId);
  const router = useRouter();
  const [editorValue, setEditorValue] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const editorRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState([]);
  const [tempalteMsg, setTemplateMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);

  const isEditing = draftId !== "new"; // If id is "new", it's create mode

  const getContent = () => {
    return editorRef.current?.getHtml();
  };

  const setContentHandler = (html) => {
    editorRef.current?.setHtml(html);
  };

  useEffect(() => {
    const fetchDraftData = async () => {
      try {
        const bidData: any = await getParticularBidData(draftId, accountId);
        if (bidData[0].selectedResponseTemplate) {
          //setContentHandler(bidData[0].responseDraftContent);
          const link =
            "https://ikoncloud-dev.keross.com/aiagent/webhook/11066cf6-68e3-41fe-8624-066a8ed3018d";
          setGenerateLoading(true);

          console.log("Loading");
          if (!bidData[0].responseDraftFinalized) {
            const response = await fetch(link, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                chatinput: `give me a proposal template for tender id AU-62592`,
                reference: bidData[0].responseDraftContent,
                //reference: htmlToText(template),
              }),
            });

            const data = await response.json();
            setGenerateLoading(false);
            console.log("chat response", data);
            setLoading(false);
            console.log(
              "bidData[0].responseDraftFinalized",
              bidData[0].responseDraftFinalized
            );

            setTemplateMsg(
              data[0]?.output || "I couldn't process that request."
            );
          } else setTemplateMsg(bidData[0].responseDraftContent);
          // setContentHandler(
          //   data[0]?.output || "I couldn't process that request."
          // );
        }
      } catch (err) {
        toast.error("Failed to fetch data. Please try again later.");
      } finally {
      }
    };

    fetchDraftData();
  }, [draftId, isEditing]);

  useEffect(() => {
    console.log("tempalteMsg------", tempalteMsg);
    setContentHandler(tempalteMsg);
  }, [tempalteMsg]);

  const handleGenerateUUID = () => {
    const newUUID = uuidv4();
    console.log("Generated UUID:", newUUID);
    return newUUID;
  };

  const handleSave = async () => {
    console.log("Textarea Value:", editorValue);
    //console.log("File:", file);
    //   if (!editorValue) {
    //     toast.error("Please enter text");
    //     return;
    //   }
    try {
      const html = getContent();
      await saveDraftFinalizeData(html, draftId, accountId, null);
      toast.success("Draft Saved");
      console.log("success");
      router.replace("/tender-management/" + draftId);
    } catch (error) {
      console.log("error");
      toast.error("Failed to perform action");
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard!");
    }
  };
  //console.log("tempalteMsg", tempalteMsg);

  return (
    <div className="max-w-full mx-auto p-3 space-y-2">
      <h2 className="text-lg font-bold">
        Review Draft
        {generateLoading && <LoadingSpinner className="ms-2" size={16} />}
      </h2>

      {/* Kendo Editor for rich text editing */}
      <div>
        <KendoEditor
          initialContent=""
          onChange={() => {}}
          height={640}
          ref={editorRef}
        />
        {/* {
          loading ? (
            <LoadingSpinner />
          ) : (

          )
        } */}
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={handleSave}>{isEditing ? "Save" : "Create"}</Button>
        <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">Chat with AI</Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="p-4"
            style={{ maxWidth: isFullWidth ? "200vw" : "30vw" }}
          >
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center justify-between mt-8">
                  <span>Chat AI</span>
                  <span
                    className="ms-2"
                    onClick={() => setIsFullWidth(!isFullWidth)}
                  >
                    {isFullWidth ? (
                      <Minimize size={16} />
                    ) : (
                      <Expand size={16} />
                    )}
                  </span>
                </div>
              </SheetTitle>
              <SheetDescription>
                Chat with AI to get suggestions for your template
              </SheetDescription>
            </SheetHeader>
            <ChatSection
              messages={messages}
              setMessages={setMessages}
              onCopy={(text) => setContentHandler(text)}
              template={tempalteMsg}
              openFrom="response"
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
