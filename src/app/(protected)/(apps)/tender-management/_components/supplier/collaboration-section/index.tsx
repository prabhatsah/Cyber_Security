import { useEffect, useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";

import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
//import moment from "moment";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { saveCommentData } from "./save-comment-data";

interface ChatMessage {
  dateTime: string;
  message: string;
  userName: string;
}

export default function CollaborationSection({ draftId , supplierId }: { draftId: string , supplierId : string }) {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMyInstancesV2({
        processName: "Tender Response",
        predefinedFilters: { taskName: "View" },
        processVariableFilters: { id: draftId },
      });

      if (response.length > 0) {
        const data: any = response[0].data;
        setChatMessages(
          data.responseChatMessages ? data.responseChatMessages : []
        );
      }
    };

    fetchData();
  }, []);

  const handleSend = async () => {
    if (chatInput.trim() === "") return;

    const userId = await getProfileData();
    console.log("User ID:", userId);

    const newMessage: ChatMessage = {
      dateTime: new Date().toISOString(),
      message: chatInput,
      userName: userId.USER_NAME,
    };

    setChatMessages([...chatMessages, newMessage]);

    setChatInput("");

    saveCommentData(draftId,supplierId,newMessage);
  };

  return (
    <>
      <div className="flex flex-col gap-4 h-full justify-between">
        <div className="h-[88vh] overflow-auto">
          {chatMessages.map((chat, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between gap-2 max-w-lg mb-1">
                <p className="text-xs text-gray-500 pt-1 italic">
                  {chat.userName}
                </p>
                <p className="text-xs text-gray-500 pt-1 italic">
                  {/* {moment(chat.dateTime).format("DD-MMM-YYYY hh:mm A")} */}
                </p>
              </div>
              <div className="relative bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-lg text-sm shadow-md bg-secondary text-black">
                {chat.message}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your message..."
            className="flex-1"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </>
  );
}
