"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";

interface ChatMessage {
  sender: "User" | "Bot";
  text: string;
}

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!message) return;
  
    setLoading(true);
    setChatHistory((prev) => [...prev, { sender: "User", text: message }]);
  
    try {
      // Step 1: Request video generation
      const response = await axios.post("/api/generate-video", { text: message });
  
      const videoId = response.data.id;
      let videoUrl = "";
  
      // Step 2: Poll for video status until it's ready
      while (!videoUrl) {
        await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds
  
        const videoResponse = await axios.get(`/api/video-status?id=${videoId}`);
        if (videoResponse.data.status === "done") {
          videoUrl = videoResponse.data.result_url;
        }
      }
  
      setVideoUrl(videoUrl);
      setChatHistory((prev) => [...prev, { sender: "Bot", text: message }]);
    } catch (error) {
      console.error("Error:", error);
    }
  
    setMessage("");
    setLoading(false);
  };
  
  

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold mb-4">D-ID AI Chat with Video</h1>
      <div className="flex gap-10">
        {/* Video Section */}
        <div className="w-1/2 h-80">
          {videoUrl ? (
            <video
              key={videoUrl}
              controls
              autoPlay
              className="w-full rounded-md h-full"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="border p-10 h-80 rounded-md text-center">
              AI Video Will Appear Here
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="w-1/2 border p-4 rounded-md">
          <div className="h-80 overflow-auto mb-4 border p-2">
            {chatHistory.map((msg, index) => (
              <p
                key={index}
                className={msg.sender === "User" ? "text-right" : "text-left"}
              >
                <strong>{msg.sender}:</strong> {msg.text}
              </p>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border p-2 flex-grow rounded-md"
              placeholder="Type a message..."
            />
            <Button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              {loading ? "Loading..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
