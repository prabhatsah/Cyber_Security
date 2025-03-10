import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { getSrcFromBase64String } from "@/ikon/utils/actions/common/utils";


export default async function MenuUser() {

    const user = await getProfileData();

    return (
        <>
            <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={getSrcFromBase64String(user?.USER_THUMBNAIL)} alt={user.USER_NAME} />
                <AvatarFallback className="rounded-lg">{user?.USER_NAME?.match(/\b([A-Z])/g)?.join('')}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.USER_NAME}</span>
                <span className="truncate text-xs">{user.USER_EMAIL}</span>
            </div>
        </>
    )
}
