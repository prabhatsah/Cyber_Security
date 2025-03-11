"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/shadcn/ui/sidebar";
import { getAccount, setActiveAccountId } from "@/ikon/utils/actions/account";
import { AccountTreeProps } from "@/ikon/utils/actions/account/type";
import { ChevronsUpDown } from "lucide-react"
import { useEffect, useState } from "react";

export default function AccountSwitcher({ accounts }: { accounts: AccountTreeProps[] }) {
    const { isMobile } = useSidebar()
    //const [accounts, setAccounts] = useState<AccountTreeProps[]>([]);
    const [activeAccount, setActiveAccount] = useState<AccountTreeProps>(accounts[0])

    const getAccountDetails = async () => {
        const account = await getAccount();
        console.log(account)
        // await setActiveAccountId(account.ACCOUNT_ID)
        //setAccounts((pre) => [...pre, account])
        setActiveAccount(account)
    }

    // useEffect(() => {
    //     getAccountDetails();
    // }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src="/assets/images/dark/symble-keross.png" alt={activeAccount?.ACCOUNT_NAME} />
                            <AvatarFallback className="rounded-lg">{activeAccount?.ACCOUNT_NAME?.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                            {activeAccount?.ACCOUNT_NAME}
                        </span>
                        <span className="truncate text-xs">{activeAccount?.ACCOUNT_NAME}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side={isMobile ? "bottom" : "right"}
                sideOffset={4}
            >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Accounts
                </DropdownMenuLabel>
                {accounts.map((account, index) => (
                    <DropdownMenuItem
                        key={account.ACCOUNT_ID}
                        // onClick={() => setActiveAccount(account)}
                        className="gap-2 p-2"
                    >
                        <div className="flex size-6 items-center justify-center rounded-sm border">
                            <Avatar className="h-6 w-6 rounded-lg">
                                <AvatarImage src="/assets/images/dark/symble-keross.png" alt={activeAccount?.ACCOUNT_NAME} />
                                <AvatarFallback className="rounded-lg">{activeAccount?.ACCOUNT_NAME?.substring(0, 1)}</AvatarFallback>
                            </Avatar>
                        </div>
                        {account.ACCOUNT_NAME}
                        {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
