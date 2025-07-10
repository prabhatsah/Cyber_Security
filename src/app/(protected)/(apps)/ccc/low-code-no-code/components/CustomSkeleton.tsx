import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { Skeleton } from "@/shadcn/ui/skeleton";

export default function CustomSkeleton() {
    return (<>
        <div className="flex items-center space-x-4">
        <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-slate-300" />
                <Skeleton className="h-4 w-[200px] bg-slate-300" />
            </div>
        </div>
    </>)
}
