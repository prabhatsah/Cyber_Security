"use client";

import { useState } from "react";
import { useAgent } from "./AgentContext";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";

const ChatSection = () => {
    const { messages, sendMessage } = useAgent();
    const [input, setInput] = useState("");

    const handleSendMessage = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput("");
        }
    };

    return (
        <div >
            <h2 className="text-xl font-bold">Chat</h2>
            <div className="h-64 overflow-y-auto border p-2 rounded-lg mb-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg ${msg.from === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200"} max-w-xs`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>Send</Button>
            </div>
        </div>
    );
};

export default ChatSection;
