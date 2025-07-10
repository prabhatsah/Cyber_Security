import { AspectRatio } from "@/shadcn/ui/aspect-ratio";
import { useAgent } from "./AgentContext";

const VideoSection = () => {
    const { videoRef } = useAgent();

    return (

        <video ref={videoRef} autoPlay playsInline />

    );
};

export default VideoSection;
