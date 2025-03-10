import { BadgeCheck, CreditCard, LogOut } from 'lucide-react'
import Link from 'next/link'
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/shadcn/ui/dropdown-menu';
import MenuUser from '@/ikon/components/menu-user';
import { signOut } from '@/ikon/utils/actions/auth';

function UserDropdownMenu() {
    async function logOut() {
        "use server"
        await signOut();
    }
    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <MenuUser />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link href={"/setting/profile"}>
                        <BadgeCheck />
                        Profile
                    </Link>

                </DropdownMenuItem>
                <DropdownMenuItem>
                    <CreditCard />
                    Billing
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={"/setting/profile"}>
                        <BadgeCheck />
                        Setting
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logOut}>
                <LogOut />
                Log out
            </DropdownMenuItem>
        </>
    )
}

export default UserDropdownMenu