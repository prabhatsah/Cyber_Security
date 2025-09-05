"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Package, Shield, ExternalLink, AlertTriangle, Clock, Tag } from "lucide-react"
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

    const getSeverityColor = (severity: Severity) => {
        switch (severity) {
            case "CRITICAL": return "text-red-500 dark:text-red-400"
            case "HIGH": return "text-orange-500 dark:text-orange-400"
            case "MEDIUM": return "text-yellow-600 dark:text-yellow-400"
            case "LOW": return "text-blue-500 dark:text-blue-400"
            default: return "text-gray-500 dark:text-gray-400"
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="space-y-4 pb-6 px-6 pt-6 flex-shrink-0">
                    <div className="flex  justify-between">
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                                <SeverityBadge severity={(vuln.Severity as Severity) ?? "UNKNOWN"} />
                                <span className="text-2xl font-bold tracking-tight">{vuln.VulnerabilityID}</span>
                            </div>
                            {vuln.Title && (
                                <DialogTitle className="text-xl font-semibold text-foreground/90 leading-7">
                                    {vuln.Title}
                                </DialogTitle>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className={`h-5 w-5 ${getSeverityColor(vuln.Severity as Severity)}`} />
                            <Badge variant="outline" className="text-xs">
                                {vuln.Status || "Unknown"}
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                <div className="overflow-y-auto space-y-4 px-6 pb-6 flex-1">
                    {/* Package Information Section */}
                    <div className="rounded-lg border border-border bg-card/30 p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground">Package Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InfoCard
                                icon={<Package className="h-4 w-4" />}
                                label="Package"
                                value={vuln.PkgName}
                                accent
                            />
                            <InfoCard
                                icon={<Tag className="h-4 w-4" />}
                                label="Installed Version"
                                value={vuln.InstalledVersion || "—"}
                            />
                            <InfoCard
                                icon={<Shield className="h-4 w-4" />}
                                label="Fixed Version"
                                value={vuln.FixedVersion || "—"}
                                highlight={!!vuln.FixedVersion}
                            />
                        </div>
                    </div>

                    {/* Vulnerability Details Section */}
                    {vuln.Description && (
                        <div className="rounded-lg border border-border bg-card/30 p-4">
                            <h3 className="font-semibold text-foreground mb-3">Description</h3>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {vuln.Description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Timeline Section */}
                    <div className="rounded-lg border border-border bg-card/30 p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground">Timeline & Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoCard
                                icon={<Calendar className="h-4 w-4" />}
                                label="Published Date"
                                value={dateFmt(vuln.PublishedDate)}
                            />
                            <InfoCard
                                icon={<Calendar className="h-4 w-4" />}
                                label="Last Modified"
                                value={dateFmt(vuln.LastModifiedDate)}
                            />
                            {vuln.CweIDs && vuln.CweIDs.length > 0 && (
                                <div className="md:col-span-2">
                                    <InfoCard
                                        icon={<AlertTriangle className="h-4 w-4" />}
                                        label="CWE IDs"
                                        value={vuln.CweIDs.join(", ")}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* References Section */}
                    {vuln.References && vuln.References.length > 0 && (
                        <div className="rounded-lg border border-border bg-card/30 p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-semibold text-foreground">External References</h3>
                                <Badge variant="secondary" className="text-xs">
                                    {vuln.References.length} {vuln.References.length === 1 ? 'reference' : 'references'}
                                </Badge>
                            </div>
                            <div className="grid gap-2 max-h-40 overflow-y-auto">
                                {vuln.References.slice(0, 8).map((reference, index) => (
                                    <a
                                        key={index}
                                        href={reference}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group flex items-center gap-3 rounded-md border border-border/50 bg-background/50 px-4 py-3 text-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
                                    >
                                        <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="truncate text-muted-foreground group-hover:text-foreground transition-colors">
                                            {reference}
                                        </span>
                                    </a>
                                ))}
                                {vuln.References.length > 8 && (
                                    <div className="text-center text-xs text-muted-foreground py-2">
                                        ... and {vuln.References.length - 8} more references
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

function InfoCard({
    icon,
    label,
    value,
    accent = false,
    highlight = false
}: {
    icon: React.ReactNode
    label: string
    value: string
    accent?: boolean
    highlight?: boolean
}) {
    return (
        <div className={`
            rounded-lg border transition-all duration-200 p-4
            ${accent
                ? 'border-primary/20 bg-primary/5 hover:border-primary/30'
                : highlight
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50'
                    : 'border-border/50 bg-background/50 hover:border-border'
            }
        `}>
            <div className="flex items-center gap-2 mb-2">
                <div className={`
                    ${accent
                        ? 'text-primary'
                        : highlight
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-muted-foreground'
                    }
                `}>
                    {icon}
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {label}
                </span>
            </div>
            <div className={`
                font-medium text-sm truncate
                ${accent
                    ? 'text-primary'
                    : highlight
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-foreground'
                }
            `}>
                {value}
            </div>
        </div>
    )
}

function dateFmt(dateString?: string): string {
    if (!dateString) return "—"
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    } catch {
        return dateString
    }
}