import React from "react";
import type { Agent } from "../../types/agent";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";

interface AgentListProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onAgentSelect: (agent: Agent) => void;
}

export function AgentList({
  agents,
  selectedAgent,
  onAgentSelect,
}: AgentListProps) {
  return (
    <div className="space-y-4">
      {agents.map((agent) => (
        <div
          key={agent.id}
          onClick={() => onAgentSelect(agent)}
          className={`flex items-center p-3 rounded-2xl cursor-pointer transition-all ${selectedAgent?.id === agent.id
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
            }`}
        >
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={agent.avatar} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 ${agent.status === "active"
                  ? "bg-green-400"
                  : agent.status === "idle"
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
            />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="font-medium ">{agent.name}</h3>
            <p className="text-sm ">{agent.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
