import React, { useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import { motion } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

export function ChatSection({
  messages,
  setMessages,
  onCopy,
  template,
  openFrom,
  sessionId,
}: {
  messages: any;
  setMessages: any;
  onCopy: (text: string) => void;
  template: any;
  openFrom?: any;
  sessionId?: any;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    function htmlToText(html: any) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText;
    }

    try {
      let link = undefined
      // openFrom === "response"
      //   ? "https://ikoncloud-dev.keross.com/aiagent/webhook/11066cf6-68e3-41fe-8624-066a8ed3018d"
      //   : "https://ikoncloud-dev.keross.com/aiagent/webhook/8c90dc69-2e60-4022-95dd-9bb8ecb72645";

      if (openFrom === "response") {
        link =
          "https://ikoncloud-dev.keross.com/aiagent/webhook/11066cf6-68e3-41fe-8624-066a8ed3018d";
      } else if (openFrom === "analyzer") {
        link =
          "https://ikoncloud-dev.keross.com/aiagent/webhook/d572c096-56fa-4fa6-9597-4b8641dba326";
      } else {
        link =
          "https://ikoncloud-dev.keross.com/aiagent/webhook/8c90dc69-2e60-4022-95dd-9bb8ecb72645";
      }
      // console.log(
      //   "body----------------------------",
      //   JSON.stringify({
      //     chatinput: input,
      //     reference: htmlToText(template),
      //     sessionId: sessionId,
      //   })
      // );
      // console.log("link", link);
      

      const payload = {
        chatinput: input || "",
        reference: htmlToText(template || ""),
        sessionId: sessionId || "default-session",
      };

      console.log("🔍 Payload to n8n:", payload);

      const response = await fetch(link, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });


      const data = await response.json();
      console.log("chat response", data);

      const botMessage: Message = {
        id: Date.now().toString(),
        role: "bot",
        content: data[0]?.output || "I couldn't process that request.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-full">
      {/* Chat Messages */}
      <ScrollArea className="h-[750px] border rounded-lg p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.content}
              isBot={msg.role === "bot"}
              onCopy={onCopy}
            />
          ))}

          {/* Loading Animation */}
          {loading && (
            <motion.div
              className="flex space-x-1 items-center"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          onKeyDown={(e) => {
            console.log("key pressed", e);
            //e.preventDefault();
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button onClick={handleSendMessage} disabled={loading || !input.trim()}>
          {loading ? "Generating..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
