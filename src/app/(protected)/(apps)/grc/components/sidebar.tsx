"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/shadcn/ui/button"
import { ThemeCustomizer } from "../components/theme/theme-customizer"
import {
  ClipboardList,
  Shield,
  AlertTriangle,
  BookOpen,
  Settings,
  Menu,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  FileCheck,
  Users,
  Bell,
  BookOpenCheck,
  HardDrive,
  Building2,
  Brain,
  ChevronDown,
  ChevronRight,
  X,
  Scale,
  Gavel,
  FileBox,
  FileStack,
  FileCheck2,
  Laptop,
  MonitorCheck,
  UserCheck,
  UserX,
  Activity,
  CalendarCheck,
  ClipboardCheck,
  FileWarning,
  BookmarkCheck,
  ShieldAlert,
  Gauge,
  ScrollText,
  FileText
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface SidebarGroup {
  name: string
  items: {
    title: string
    icon: any
    href: string
  }[]
}

const sidebarGroups: SidebarGroup[] = [
  {
    name: "Overview",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      }
    ]
  },
  {
    name: "Management Systems",
    items: [
      {
        title: "Audit Management",
        icon: ClipboardList,
        href: "/audits",
      },
      {
        title: "Risk Management",
        icon: AlertTriangle,
        href: "/risks/management",
      },
      {
        title: "Compliance Management",
        icon: BookOpen,
        href: "/compliance/management",
      },
      {
        title: "Policy Management",
        icon: ScrollText,
        href: "/policies/management",
      },
      {
        title: "Reports",
        icon: FileText,
        href: "/reports",
      }
    ]
  },
  {
    name: "Governance",
    items: [
      {
        title: "Board Oversight",
        icon: Gavel,
        href: "/governance/board",
      },
      {
        title: "Corporate Policies",
        icon: FileBox,
        href: "/governance/policies",
      },
      {
        title: "Regulatory Affairs",
        icon: Scale,
        href: "/governance/regulatory",
      },
      {
        title: "Documentation",
        icon: FileStack,
        href: "/governance/documentation",
      },
      {
        title: "Attestations",
        icon: FileCheck2,
        href: "/governance/attestations",
      }
    ]
  },
  {
    name: "Compliance",
    items: [
      {
        title: "Regulatory Changes",
        icon: FileWarning,
        href: "/regulatory",
      },
      {
        title: "Policy Library",
        icon: BookmarkCheck,
        href: "/policies",
      },
      {
        title: "Controls",
        icon: Shield,
        href: "/controls",
      },
      {
        title: "Frameworks",
        icon: BookOpenCheck,
        href: "/compliance/frameworks",
      },
      {
        title: "Monitoring",
        icon: MonitorCheck,
        href: "/compliance/monitoring",
      }
    ]
  },
  {
    name: "Risk",
    items: [
      {
        title: "Enterprise Risk",
        icon: Gauge,
        href: "/risks/enterprise",
      },
      {
        title: "IT & Cyber Risk",
        icon: ShieldAlert,
        href: "/risks/cyber",
      },
      {
        title: "Vendor Risk",
        icon: Building2,
        href: "/vendors",
      },
      {
        title: "Risk Monitoring",
        icon: Bell,
        href: "/monitoring",
      }
    ]
  },
  {
    name: "Business Continuity",
    items: [
      {
        title: "BCP Planning",
        icon: CalendarCheck,
        href: "/continuity/planning",
      },
      {
        title: "Disaster Recovery",
        icon: Laptop,
        href: "/continuity/recovery",
      },
      {
        title: "Incident Response",
        icon: AlertTriangle,
        href: "/continuity/incidents",
      },
      {
        title: "Testing & Exercises",
        icon: ClipboardCheck,
        href: "/continuity/testing",
      }
    ]
  },
  {
    name: "Employee Compliance",
    items: [
      {
        title: "Onboarding",
        icon: UserCheck,
        href: "/compliance/onboarding",
      },
      {
        title: "Offboarding",
        icon: UserX,
        href: "/compliance/offboarding",
      },
      {
        title: "Training",
        icon: GraduationCap,
        href: "/compliance/training",
      },
      {
        title: "Activity Monitoring",
        icon: Activity,
        href: "/compliance/activity",
      }
    ]
  },
  {
    name: "Tools",
    items: [
      {
        title: "AI Analysis",
        icon: Brain,
        href: "/ai",
      },
      {
        title: "Knowledge Base",
        icon: GraduationCap,
        href: "/knowledge",
      },
      {
        title: "Users",
        icon: Users,
        href: "/users",
      },
      {
        title: "Settings",
        icon: Settings,
        href: "/settings",
      },
    ]
  }
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(sidebarGroups.map(g => g.name))
  const pathname = usePathname()

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(current =>
      current.includes(groupName)
        ? current.filter(name => name !== groupName)
        : [...current, groupName]
    )
  }

  const SidebarContent = () => (
    <>
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">IKON-GRC</span>
            <ThemeCustomizer />
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {sidebarGroups.map((group) => (
          <div key={group.name} className="space-y-1">
            {!collapsed && (
              <div
                className="flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => toggleGroup(group.name)}
              >
                {group.name}
                {expandedGroups.includes(group.name) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            )}
            {(collapsed || expandedGroups.includes(group.name)) && (
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
                      collapsed && "justify-center",
                      pathname === item.href && "bg-accent"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-40 lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background/80 backdrop-blur-sm transform transition-transform duration-200 ease-in-out lg:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col border-r bg-background/80 backdrop-blur-sm",
        collapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent />
      </div>
    </>
  )
}