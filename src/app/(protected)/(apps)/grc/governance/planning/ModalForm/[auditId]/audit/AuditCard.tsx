import { Badge } from "@/shadcn/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/shadcn/ui/card";
import { LucideIcon, Copy } from "lucide-react";

interface Person {
    name: string;
    initials: string;
}

interface PeopleGroup {
    title: string; // e.g., "Auditor Team" or "Auditee Team"
    members: Person[];
}

interface CookieCardProps {
    title: string;
    label: string;
    description: string;
    startDate?: string;
    endDate?: string;
    frequency?: string;
    dateLabel?: string;
    dateDescription?: string;
    icon?: LucideIcon;
    badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success";
    badgeLabel?: string;
    footerVisible?: boolean;
    people?: Person[];
    peopleGroups?: PeopleGroup[];
    showBorder?: boolean;
}

export default function CookieCard({
    title,
    label,
    description,
    startDate,
    endDate,
    frequency,
    dateLabel,
    dateDescription,
    icon: Icon = Copy,
    badgeVariant,
    badgeLabel,
    footerVisible = true,
    peopleGroups = [],
    showBorder = true,
}: CookieCardProps) {
    const borderClass = showBorder ? "border-b" : "";
    return (
        <Card className="flex flex-col">
            <CardHeader className="border-b flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-3">
                    <Icon className="text-white" />
                    <div className="text-white font-poppins text-lg font-medium leading-none">{title}</div>
                </div>
                {
                    badgeVariant && (
                        <Badge variant={badgeVariant}>{ badgeLabel || ""}</Badge>
                    )
                }
            </CardHeader>

            {peopleGroups.length > 0 ? (
                <CardContent className={borderClass + " flex-1"}>
                    <div className="gap-2 grid grid-cols-2 h-full pb-0 py-3">
                        {/* {peopleGroups.map((group, groupIdx) => (
                            <div key={groupIdx} className="flex flex-col gap-2 py-3">
                                <div className="text-white/60 font-poppins text-xs font-normal leading-none">
                                    {group.title}
                                </div>
                                {group.members.map((person, personIdx) => (
                                    <div key={personIdx} className="flex items-center gap-2">
                                        <div className="w-7 h-7 p-4 rounded-full bg-white/10 flex items-center justify-center text-xs text-white font-poppins">
                                            {person.initials}
                                        </div>
                                        <div className="text-white font-poppins text-sm font-medium leading-none">
                                            {person.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))} */}
                        {peopleGroups.map((group, idx) => {
                            const visible = group.members.slice(0, 3);
                            const remaining = group.members.slice(3);
                            return (
                                <div key={idx} className="flex flex-col gap-2">
                                    <div className="text-white/60 font-poppins text-xs font-normal leading-none">
                                        {group.title}
                                    </div>
                                    {visible.map((person, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white font-poppins">
                                                {person.initials}
                                            </div>
                                            <div className="text-white font-poppins text-sm font-medium leading-none">
                                                {person.name}
                                            </div>
                                        </div>
                                    ))}
                                    {remaining.length > 0 && (
                                        <div className="relative group">
                                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white font-poppins cursor-pointer">
                                                +{remaining.length}
                                            </div>
                                            <div className="hidden group-hover:flex flex-col absolute left-10 top-0 bg-white/10 p-2 rounded backdrop-blur-2xl z-[11] max-h-[17rem] overflow-auto">
                                                {remaining.map((person, j) => (
                                                    <div key={j} className="flex items-center gap-2 py-1">
                                                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs text-white font-poppins">
                                                            {person.initials}
                                                        </div>
                                                        <div className="text-white font-poppins text-sm font-medium leading-none">
                                                            {person.name}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            ) : description ? (
                <CardContent className={borderClass}>
                    <div className="flex flex-col space-y-1.5 py-3 pb-0">
                        <div className="text-white/60 font-poppins text-xs font-normal leading-none">{label}</div>
                        <div className="text-white/80 font-poppins text-sm font-medium leading-none">{description}</div>
                    </div>
                </CardContent>
            ) : null
            }

            {
                footerVisible && (
                    <CardFooter className="flex justify-between pb-0">
                        <div className="flex flex-col space-y-1.5">
                            <div className="flex flex-row gap-2">
                                {(startDate || endDate) ? (
                                    <div className="border-r flex flex-col pr-4 py-4 space-y-1.5">
                                        <div className="text-white/60 font-poppins text-xs font-normal leading-none">Audit Period</div>
                                        <div className="flex flex-row gap-3 border-r items-center">
                                            <div className="text-white/80 font-poppins text-sm font-medium leading-none">{startDate ?? "--"}</div>
                                            <div className="bg-white/10 flex justify-center rounded-lg w-9">To</div>
                                            <div className="text-white/80 font-poppins text-sm font-medium leading-none">{endDate ?? "--"}</div>
                                        </div>
                                    </div>
                                ) : dateLabel && dateDescription ? (
                                    <div className="flex flex-col pr-4 py-4 space-y-1.5">
                                        <div className="text-white/60 font-poppins text-xs font-normal leading-none">{dateLabel}</div>
                                        <div className="text-white/80 font-poppins text-sm font-medium leading-none">{dateDescription}</div>
                                    </div>
                                ) : null}

                                {frequency && (
                                    <div className="flex flex-col pl-3 py-4 space-y-1.5">
                                        <div className="text-white/60 font-poppins text-xs font-normal leading-none">Audit Type</div>
                                        <div className="text-white/80 font-poppins text-sm font-medium leading-none">{frequency}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardFooter>
                )
            }
        </Card >
    );
}
