import React, { useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import ChatMessageResponse from "./chat-message";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

export function ChatSectionResponse({
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

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Show AI loading message
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { id: "loading", role: "bot", content: "Loading..." },
    ]);

    try {
      const response = await fetch(
        "https://ikoncloud-dev.keross.com/aiagent/webhook/a148d766-3040-4294-a55d-0bb6bf914dda",
        
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatinput: input }),
        }
      );

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now().toString(),
        role: "bot",
        content: data[0].output,
      };

      // Remove loading message and add actual response
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== "loading"),
        botMessage,
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev.filter((msg) => msg.id !== "loading")]);
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
              onCopy={onCopy}
              loading={msg.id === "loading"} // Ensure only the "loading" message shows loading effect
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
