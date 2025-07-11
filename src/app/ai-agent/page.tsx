"use client";


import Ai_agent from "@/components/ai-agent";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";

export default function aiAgentPage() {
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 0,
                    title: "Ai Agent",
                    href: "/ai-agent",
                }}
            />
            <Ai_agent params={undefined} />
        </>
    );
}
