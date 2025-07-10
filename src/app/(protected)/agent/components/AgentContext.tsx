"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import * as sdk from "@d-id/client-sdk";

interface Message {
    from: "user" | "agent";
    text: string;
}

interface AgentContextType {
    messages: Message[];
    sendMessage: (message: string) => void;
    videoRef: React.RefObject<HTMLVideoElement>;
}

const AgentContext = createContext<AgentContextType | null>(null);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const agentManagerRef = useRef<sdk.AgentManager | null>(null);

    useEffect(() => {
        const initializeAgent = async () => {
            if (!videoRef.current) {
                console.error("Video element not found");
                return;
            }

            try {
                const agentId = "agt_FVMuVM3M" // Replace with your actual agent ID
                const auth: sdk.Auth = { type: "key", clientKey: "Z29vZ2xlLW9hdXRoMnwxMDMzMzI2MjQyNTU0MTc4MDI0NTc6TzI3bUY3NC0zSTZwTzdiQnRRRE5Z" };

                const callbacks = {
                    onSrcObjectReady: (stream: MediaStream) => {
                        console.log("Stream received:", stream);
                        if (videoRef.current) {
                            videoRef.current.srcObject = stream;
                            videoRef.current.play().catch((error) => console.error("Video play error:", error));
                        }
                    },
                    onMessage: (message: any) => {
                        console.log("Agent response:", message.text);
                        setMessages((prev) => [...prev, { from: "agent", text: message.text }]);
                    },
                    onError: (error: any) => {
                        console.error("D-ID SDK Error:", error);
                    },
                };

                // Create the agent manager
                agentManagerRef.current = await sdk.createAgentManager(agentId, {
                    auth, callbacks, streamOptions:
                        { compatibilityMode: "auto", streamWarmup: true, streamGreeting: true }
                });
                console.log("AgentManager initialized successfully");

                // 🔹 **Force start streaming**
                const stream = await agentManagerRef.current.connect();
                console.log("Stream manually started:", stream);

            } catch (error) {
                console.error("Error initializing agent:", error);
            }
        };

        initializeAgent();

        return () => {
            agentManagerRef.current?.disconnect();
        };
    }, []);


    const sendMessage = async (message: string) => {
        if (!message.trim()) return;
        if (!agentManagerRef.current) {
            console.error("AgentManager is not initialized");
            return;
        }

        setMessages((prev) => [...prev, { from: "user", text: message }]);

        try {
            // Get AI response
            const response = await agentManagerRef.current.chat(message);
            console.log("Chat response:", response);

            setMessages((prev) => [...prev, { from: "agent", text: response.text }]);

            // Make AI speak the response
            await agentManagerRef.current.speak({ type: "text", input: response.text });

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <AgentContext.Provider value={{ messages, sendMessage, videoRef }}>
            {children}
        </AgentContext.Provider>
    );
};

export const useAgent = () => {
    const context = useContext(AgentContext);
    if (!context) throw new Error("useAgent must be used within an AgentProvider");
    return context;
};
