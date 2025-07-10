import { ReactNode } from "react";

interface CardProps {
  title: ReactNode;
  tools?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, tools, children }: CardProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b shadow pb-2">
        <h5 className="">{title}</h5>
        <div className="text-gray-400">{tools}</div>
      </div>

      {/* Make content scrollable within the card */}
      <div className="mt-4 w-full flex-1 overflow-auto">{children}</div>
    </div>
  );
}

