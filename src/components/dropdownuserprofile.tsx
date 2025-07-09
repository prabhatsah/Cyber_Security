"use client"


import { ArrowUpRight, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { signOut } from "@/ikon/utils/actions/auth/index"
import Link from "next/link"

export type DropdownUserProfileProps = {
    children: React.ReactNode
    align?: "center" | "start" | "end",
    profileData: any
}

export function DropdownUserProfile({
    children,
    align = "start",
    profileData
}: DropdownUserProfileProps) {
    const [mounted, setMounted] = React.useState(false)
    //const [profile, setProfile] = React.useState(profileData)
    const { theme, setTheme } = useTheme()
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const handelSignout = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
                <DropdownMenuContent
                    align={align}
                    className="sm:!min-w-[calc(var(--radix-dropdown-menu-trigger-width))]"
                >
                    <DropdownMenuLabel>{profileData?.USER_EMAIL}</DropdownMenuLabel>

                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Link href="/profile">
                                Profile
                            </Link>
                            <ArrowUpRight
                                className="mb-1 ml-1 size-3 shrink-0 text-gray-500 dark:text-gray-500"
                                aria-hidden="true"
                            />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/documentation">
                                Documentation
                            </Link>
                            <ArrowUpRight
                                className="mb-1 ml-1 size-3 shrink-0 text-gray-500"
                                aria-hidden="true"
                            />
                        </DropdownMenuItem>

                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <a onClick={handelSignout} className="w-full">
                                Sign out
                            </a>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
