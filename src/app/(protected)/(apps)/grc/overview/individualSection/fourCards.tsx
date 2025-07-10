import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { ArrowDown, ArrowUp, File, Zap, AlertTriangle, Shield } from "lucide-react"
import ControlStatsCard from "../components/cardWithLogo"
export default function FirstFourCards() {
    return (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <ControlStatsCard
                title="Total Controls"
                value={449}
                icon={<File />}
                changeIcon={<ArrowUp className="h-4 w-4"/>}
                changeValue="12%"
                changeLabel="Increase"
                period="from last month"
            />
            <ControlStatsCard
                title="Active Frameworks"
                value={6}
                icon={<Shield />}
                changeIcon={<ArrowUp className="h-4 w-4"/>}
                changeValue="2"
                changeLabel="new"
                period="this quater"
                iconBgColor = "bg-purple-900/20"
                iconTextColor = "text-purple-700"
            />
            <ControlStatsCard
                title="Risk Items"
                value={24}
                icon={<AlertTriangle />}
                changeIcon={<ArrowDown className="h-4 w-4"/>}
                changeValue="5"
                changeLabel="artificial"
                changeColor = "text-red-500"
                period="need attention"
                iconBgColor = "bg-pink-900/20"
                iconTextColor = "text-pink-700"
            />
            <ControlStatsCard
                title="Overall Score"
                value={'88%'}
                icon={<Zap />}
                changeIcon={<ArrowUp className="h-4 w-4"/>}
                changeValue="5%"
                changeLabel="Increase"
                period="from last month"
                iconBgColor = "bg-yellow-900/20"
                iconTextColor = "text-yellow-700"
            />
        </div>
    )
}