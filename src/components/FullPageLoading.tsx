import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@tremor/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function FullPageLoading() {

    return (
        <div className="absolute inset-0 backdrop-blur-md flex justify-center items-center z-10">
            <AiOutlineLoading3Quarters className="animate-spin size-8" />
        </div>
    );
}
