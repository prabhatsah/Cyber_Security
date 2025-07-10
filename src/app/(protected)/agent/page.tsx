"use client"
import { AspectRatio } from "@/shadcn/ui/aspect-ratio";
import { AgentProvider } from "./components/AgentContext";
import dynamic from "next/dynamic";

const VideoSection = dynamic(() => import("./components/VideoSection"), { ssr: false });
const ChatSection = dynamic(() => import("./components/ChatSection"), { ssr: false });

export default function HomePage() {
    return (
        <AgentProvider>
            <div className="flex items-center justify-center gap-4 h-full">
                <div className="w-[400px] border rounded-lg">
                    <AspectRatio ratio={9 / 16}>
                        <VideoSection />
                    </AspectRatio>
                </div>
                <ChatSection />
            </div>
        </AgentProvider>
    );
}
