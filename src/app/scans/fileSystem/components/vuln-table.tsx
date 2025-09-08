"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import { type Severity, SeverityBadge } from "./severity-badge"
import { VulnDetailsDialog } from "./vuln-details-dialog"
import { cn } from "@/lib/utils"

type Vuln = {
    VulnerabilityID: string
    PkgName: string
    InstalledVersion?: string
    FixedVersion?: string
    Severity: Severity
    Title?: string
    Description?: string
    CweIDs?: string[]
    PrimaryURL?: string
    References?: string[]
    Status?: string
}

export function VulnTable({ items }: { items: Vuln[] }) {
    const [q, setQ] = React.useState("")
    const [sev, setSev] = React.useState<Severity | "ALL">("ALL")
    const [selected, setSelected] = React.useState<Vuln | null>(null)
    const [open, setOpen] = React.useState(false)

    const filtered = React.useMemo(() => {
        return items
            .filter((v) => (sev === "ALL" ? true : v.Severity === sev))
            .filter((v) => {
                const t = `${v.VulnerabilityID} ${v.PkgName} ${v.Title ?? ""}`.toLowerCase()
                return t.includes(q.toLowerCase())
            })
            .sort((a, b) => severityRank(b.Severity) - severityRank(a.Severity))
    }, [items, q, sev])

    function onRowClick(v: Vuln) {
        setSelected(v)
        setOpen(true)
    }

    const counts = countBySeverity(items)

    return (
        <Card className="rounded-xl border-border/50  p-4">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map((s) => (
                        <Button
                            key={s}
                            size="sm"
                            variant={sev === s ? "default" : "outline"}
                            onClick={() => setSev(s as any)}
                            className={cn(
                                "rounded-full",
                                s === "ALL" ? "" : severityButtonTone(s as any),
                                sev === s ? "" : "",
                            )}
                        >
                            <span className="mr-1">{s}</span>
                            <Badge variant="secondary" className="ml-1">
                                {counts[s as keyof typeof counts] ?? items.length}
                            </Badge>
                        </Button>
                    ))}
                </div>
                <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search CVE, package, or title..."
                    className="h-9 w-full max-w-sm"
                />
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className="w-[160px]">CVE</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="w-[240px]">Package</TableHead>
                            <TableHead className="w-[120px]">Severity</TableHead>
                            <TableHead className="w-[220px]">Fixed in</TableHead>
                            <TableHead className="w-[80px] text-right">Open</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((v, index) => (
                            <TableRow
                                key={`${v.VulnerabilityID}-${v.PkgName}-${index}`}
                                className="cursor-pointer "
                                onClick={() => onRowClick(v)}
                            >
                                <TableCell className="font-mono text-xs">{v.VulnerabilityID}</TableCell>
                                <TableCell className="max-w-[520px] truncate">{v.Title}</TableCell>
                                <TableCell className="font-mono text-xs">
                                    {v.PkgName}
                                    {v.InstalledVersion ? (
                                        <Badge className="ml-2" variant="outline">
                                            @{v.InstalledVersion}
                                        </Badge>
                                    ) : null}
                                </TableCell>
                                <TableCell>
                                    <SeverityBadge severity={v.Severity} />
                                </TableCell>
                                <TableCell className="text-xs">{v.FixedVersion || "—"}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onRowClick(v)}>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center ">
                                    No vulnerabilities match your filters.
                                </TableCell>
                            </TableRow>
                        ) : null}
                    </TableBody>
                </Table>
            </div>

            <VulnDetailsDialog open={open} onOpenChange={setOpen} vuln={selected} />
        </Card>
    )
}

function severityRank(s: Severity) {
    return { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, UNKNOWN: 0 }[s] ?? 0
}

function countBySeverity(items: Vuln[]) {
    const base = { ALL: items.length, CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
    for (const v of items) {
        if (v.Severity in base) (base as any)[v.Severity] += 1
    }
    return base
}

function severityButtonTone(s: Severity | "ALL") {
    switch (s) {
        case "CRITICAL":
            return "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/10"
        case "HIGH":
            return "border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/10"
        case "MEDIUM":
            return "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 bg-yellow-500/10"
        case "LOW":
            return "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-emerald-500/10"
        default:
            return ""
    }
}
