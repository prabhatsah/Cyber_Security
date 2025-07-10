
import Link from 'next/link'
import AppBreadcrumb from '../app-breadcrumb'
import TopMenuUser from '@/ikon/components/top-menu-user'
import { Bot, LayoutGrid, Sidebar } from 'lucide-react'
import { IconButtonWithTooltip } from '../buttons'
import { SidebarTrigger } from '@/shadcn/ui/sidebar'
import { SidebarControlButton } from '../sidebar-control-button'

function Header() {
    return (
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b px-2 lg:px-4 py-2">
            <SidebarTrigger />
            <SidebarControlButton />
            <AppBreadcrumb />
            <div className='ms-auto flex items-center gap-2 lg:gap-3'>
                {/* <Link href={BASE_APP_BASE_PATH + "/examples"}>Examples</Link> */}
                {/* <IconButtonWithTooltip tooltipContent='IKON GPT' variant={"ghost"} asChild>
                    <Link href={"/ikon-gpt"} >
                        <Bot />
                    </Link>
                </IconButtonWithTooltip> */}
                <IconButtonWithTooltip tooltipContent='App Store' variant={"ghost"} asChild>
                    <Link href={"/app-store"}>
                        <LayoutGrid />
                    </Link>
                </IconButtonWithTooltip>
                <TopMenuUser />
            </div>

        </header>
    )
}

export default Header