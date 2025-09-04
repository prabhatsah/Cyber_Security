"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { type Severity, SeverityBadge } from "./severity-badge"

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
    CVSS?: any
    PublishedDate?: string
    LastModifiedDate?: string
    Status?: string
}

export function VulnDetailsDialog({
    open,
    onOpenChange,
    vuln,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    vuln: Vuln | null
}) {
    if (!vuln) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <SeverityBadge severity={(vuln.Severity as Severity) ?? "UNKNOWN"} />
                        {vuln.VulnerabilityID}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <div className="text-sm text-muted-foreground">Title</div>
                        <div className="text-pretty">{vuln.Title || "—"}</div>
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground">Description</div>
                        <p className="text-pretty leading-relaxed">{vuln.Description || "—"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        <KV k="Package" v={`${vuln.PkgName} ${vuln.InstalledVersion ? `@ ${vuln.InstalledVersion}` : ""}`} />
                        <KV k="Fixed in" v={vuln.FixedVersion || "—"} />
                        <KV k="Status" v={vuln.Status || "—"} />
                        <KV k="Published" v={dateFmt(vuln.PublishedDate)} />
                        <KV k="Modified" v={dateFmt(vuln.LastModifiedDate)} />
                        <KV k="CWE" v={(vuln.CweIDs || []).join(", ") || "—"} />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">References</div>
                        <div className="flex flex-wrap gap-2">
                            {(vuln.References || []).slice(0, 12).map((r, i) => (
                                <a
                                    key={i}
                                    href={r}
                                    target="_blank"
                                    className="truncate rounded-md border border-border/50 bg-muted/20 px-2 py-1 text-xs text-blue-400 hover:underline"
                                    rel="noreferrer"
                                >
                                    {r}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function KV({ k, v }: { k: string; v: string }) {
    return (
        <div className="rounded-lg border border-border/50 bg-card/60 p-2">
            <div className="text-xs text-muted-foreground">{k}</div>
            <div className="truncate text-sm">{v}</div>
        </div>
    )
}

function dateFmt(x?: string) {
    if (!x) return "—"
    try {
        return new Date(x).toLocaleDateString()
    } catch {
        return x
    }
}
