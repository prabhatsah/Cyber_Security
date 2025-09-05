
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"


import { Badge } from "@/components/ui/badge"
import { SeverityBadge } from "./severity-badge"
import { scanSample } from "../data/scan-sample"
import { SeverityDonut } from "./severity-chart"
import { StatCard } from "./stat-chart"
import { VulnTable } from "./vuln-table"

export default function ScanDashboard({ scanResult }: { scanResult: any }) {
    const scan = scanResult

    // Convert Results object → flat array of vulnerabilities
    const vulns = Object.values(scan.Results || {}).flatMap((res: any) =>
        res.Vulnerabilities ? Object.values(res.Vulnerabilities) : []
    )

    const severityCounts = groupBySeverity(vulns)

    const donutData = ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((k) => ({
        name: k,
        value: severityCounts[k] || 0,
    }))

    const affectedPackages = Array.from(new Set(vulns.map((v: any) => v.PkgName))).length
    const criticals = severityCounts.CRITICAL || 0
    const fixable = vulns.filter((v: any) => (v.FixedVersion || "").trim().length > 0).length

    return (
        <main className="space-y-3 py-4 border-t mt-5">
            {/* Title row */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-balance text-md font-semibold">Artifact</p>
                    <p className="text-sm">
                        {scan.ArtifactName} • {new Date(scan.CreatedAt).toLocaleString()}
                    </p>
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
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="col-span-1 flex items-center justify-between gap-4 rounded-xl border-border/50 bg-card/60 p-4">
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Severity Distribution</div>
                        <div>
                            {donutData.map((d) => (
                                <div key={d.name} className="flex items-center gap-2 mb-2">
                                    <SeverityBadge severity={d.name as any} value={d.value} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <SeverityDonut data={donutData} />
                </Card>

                <div className="col-span-2 grid gap-4 sm:grid-cols-3">
                    <StatCard label="Total Vulnerabilities" value={vulns.length} hint="Detected in dependency graph" />
                    <StatCard label="Critical Findings" value={criticals} hint="Immediate attention recommended" />
                    <StatCard label="Affected Packages" value={affectedPackages} hint="Unique packages" />
                    <StatCard
                        label="Fixes Available"
                        value={fixable}
                        hint="Provide upgrade paths"
                        className="sm:col-span-2"
                    />
                    <StatCard
                        label="Scan Source"
                        value={Object.values(scan.Results || {})[0]?.Target || "—"}
                        hint={Object.values(scan.Results || {})[0]?.Type?.toUpperCase()}
                    />
                </div>
            </div>

            {/* Table */}
            <section className="space-y-3">
                <h2 className="text-lg font-semibold">Vulnerabilities</h2>
                <VulnTable items={vulns as any} />
            </section>

            {/* Guidance */}
            <Card className="rounded-xl border-border/50 bg-card/60 p-4">
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Remediation Guidance</h2>
                    <Badge variant="outline" className="rounded-full">
                        Automated
                    </Badge>
                </div>
                <Separator className="mb-3" />
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                    <li>Upgrade Next.js to patched versions (15.2.3+, 15.4.5+).</li>
                    <li>Update axios to 1.8.2+ and avoid absolute URLs in requests.</li>
                    <li>Upgrade @babel/runtime to 7.26.10+.</li>
                    <li>Patch transitive packages (form-data, brace-expansion).</li>
                    <li>Review middleware and header forwarding to prevent SSRF in self-hosted environments.</li>
                </ul>
            </Card>
        </main>
    )
}


function MetaKV({ k, v, hint }: { k: string; v: string; hint?: string }) {
    return (
        <div className="rounded-lg border border-border/50 bg-muted/10 p-3">
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
