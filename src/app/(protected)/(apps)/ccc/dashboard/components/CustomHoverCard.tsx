import { CalendarDays } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shadcn/ui/hover-card" 

interface hovercardProps {
    children: React.ReactNode;
    content: string[];
}

export default function HoverCardDemo({
    children,
    content
}:hovercardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <ul>
            {content.map(e=>{
                return <li>{e}</li>
            })}
        </ul>
      </HoverCardContent>
    </HoverCard>
  )
}
