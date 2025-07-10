import React, { useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import ChatMessageResponse from "../response-template-modal-components/chat-message";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  loading?: boolean;
};

export function ChatSectionFinalizeTemplate({
  onCopy,
}: {
  onCopy: (text: string) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    // Add user message to the chat
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input

    // Show AI typing animation
    const typingIndicator: Message = {
      id: "typing",
      role: "bot",
      content: "",
      loading: true,
    };
    setMessages((prev) => [...prev, typingIndicator]);

    setLoading(true);

    try {
      // Send user message to the API
      const response = await fetch(
        "https://ikoncloud-dev.keross.com/aiagent/webhook/11066cf6-68e3-41fe-8624-066a8ed3018d",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatinput: input }),
        }
      );

      const data = await response.json();
      console.log("chat response", data);

      // Remove the typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));

      // Add bot response to the chat
      const botMessage: Message = {
        id: Date.now().toString(),
        role: "bot",
        content: data[0].output, // Use the API response
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-full">
      {/* Chat Messages */}
      <ScrollArea className="h-[600px] border rounded-lg p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessageResponse
              key={msg.id}
              message={msg.content}
              isBot={msg.role === "bot"}
              loading={msg.loading}
              onCopy={onCopy}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button onClick={handleSendMessage} disabled={loading || !input.trim()}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
