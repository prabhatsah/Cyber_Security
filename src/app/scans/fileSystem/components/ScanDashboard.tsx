import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SeverityBadge } from "./severity-badge"
import { scanSample } from "../data/scan-sample"
import { SeverityDonut } from "./severity-chart"
import { StatCard } from "./stat-chart"
import { VulnTable } from "./vuln-table"
import { Package, Calendar, FileText, Clock } from "lucide-react"

export default function ScanDashboard() {
    interface ScanCardProps {
        scan: {
            ArtifactName: string;
            CreatedAt: string;
        };
    }
    const scan = scanSample
    const vulns = scan.Results[0]?.Vulnerabilities ?? []

    const severityCounts = groupBySeverity(vulns)
    const donutData = ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((k) => ({
        name: k,
        value: severityCounts[k as keyof typeof severityCounts] || 0,
    }))

    const affectedPackages = Array.from(new Set(vulns.map((v) => v.PkgName))).length
    const criticals = severityCounts.CRITICAL || 0
    const fixable = vulns.filter((v) => (v.FixedVersion || "").trim().length > 0).length

    return (
        <main className="  space-y-3 py-4 border-t mt-5">
            {/* Title row */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-balance text-md font-semibold">Artifact</p>

                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <a href="/api/scan/export" aria-label="Export JSON">
                            Export JSON
                        </a>
                    </Button>
                </div>
            </div>

            {/* Top grid */}
            <div className="md:grid-cols-[40%_60%] grid gap-4">
                <Card className="col-span-1 flex items-center justify-between gap-4 rounded-xl border-border/50  p-4">
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Severity Distribution</div>
                        <div className="">
                            {donutData.map((d) => (
                                <div key={d.name} className="flex items-center gap-2 mb-2">
                                    <SeverityBadge severity={d.name as any} value={d.value} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <SeverityDonut data={donutData} />
                </Card>

                <div className="space-y-4 ">
                    {/* First Row - 70% Scanned Artifact, 30% Start Date */}
                    <div className="grid grid-cols-10 gap-4">
                        {/* Scanned Artifact Card - 70% */}
                        <Card className="col-span-7 p-4 transition-all duration-200 hover:shadow-md">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="text-sm font-medium ">Scanned Artifact</div>
                                </div>

                                <div className="space-y-1">
                                    <div className="font-semibold  truncate" title={scan.ArtifactName}>
                                        {scan.ArtifactName}
                                    </div>
                                    {/* <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(scan.CreatedAt).toLocaleDateString()} at {new Date(scan.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div> */}
                                </div>
                            </div>
                        </Card>

                        {/* Start Date Card - 30% */}
                        <Card className="col-span-3 p-4 transition-all duration-200 hover:shadow-md">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
                                        <Clock className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="text-sm font-medium ">Scan Started</div>
                                </div>

                                <div className="space-y-1">
                                    <div className="font-semibold ">
                                        {new Date(scan.CreatedAt).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs ">
                                        {new Date(scan.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Second Row - StatCards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Total Vulnerabilities"
                            value={vulns.length}
                            hint="Detected in dependency graph"
                        />
                        <StatCard
                            label="Critical Findings"
                            value={criticals}
                            hint="Immediate attention recommended"
                        />
                        <StatCard
                            label="Affected Packages"
                            value={affectedPackages}
                            hint="Unique npm packages"
                        />
                        <StatCard
                            label="Fixes Available"
                            value={fixable}
                            hint="Provide upgrade paths"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <section className="space-y-3">
                <h2 className="text-lg font-semibold">Vulnerabilities</h2>
                <VulnTable items={vulns as any} />
            </section>

            {/* Guidance */}
            <Card className="rounded-xl border-border/50  p-4">
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Remediation Guidance</h2>
                    <Badge variant="outline" className="rounded-full">
                        Automated
                    </Badge>
                </div>
                <Separator className="mb-3" />
                <ul className="list-inside list-disc space-y-2 text-sm">
                    <li>
                        Upgrade Next.js to patched versions (15.2.3+, 15.4.5+, or listed LTS) to address middleware, cache, and
                        image issues.
                    </li>
                    <li>Update axios to 1.8.2+ and avoid absolute URLs in requests.</li>
                    <li>Upgrade @babel/runtime to 7.26.10+ and recompile the app.</li>
                    <li>Patch transitive packages (form-data, brace-expansion) to their fixed versions.</li>
                    <li>Review middleware and header forwarding to prevent SSRF in self-hosted environments.</li>
                </ul>
            </Card>
        </main>
    )
}

function MetaKV({ k, v, hint }: { k: string; v: string; hint?: string }) {
    return (
        <div className="rounded-lg border border-border/50 p-3">
            <div className="text-xs text-muted-foreground">{k}</div>
            <div className="truncate text-sm">{v}</div>
            {hint ? <div className="truncate text-xs text-muted-foreground">{hint}</div> : null}
        </div>
    )
}

function shortCommit(c?: string) {
    return c ? `${c.slice(0, 7)}…` : "—"
}

function groupBySeverity(items: any[]) {
    return items.reduce(
        (acc: Record<string, number>, v) => {
            acc[v.Severity] = (acc[v.Severity] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )
}