import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { getProfileData } from "@/ikon/utils/actions/auth";
import UserDropdownMenu from "@/ikon/components/user-dropdown-menu";
import { getSrcFromBase64String } from "@/ikon/utils/actions/common/utils";

export default async function TopMenuUser() {
  const user = await getProfileData();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Avatar className="rounded-full">
            <AvatarImage
              src={getSrcFromBase64String(user?.USER_THUMBNAIL)}
              alt={user.USER_NAME}
            />
            <AvatarFallback className="rounded-lg">
              {user?.USER_NAME?.match(/\b([A-Z])/g)?.join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        sideOffset={4}
      >
        <UserDropdownMenu />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
