import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";

export type userMapSchema = {value:string,label:string}[];

export async function getUserDetailMap() {
    const allUsers = await getUserIdWiseUserDetailsMap();
    console.log(allUsers);
    return allUsers;
}

export async function CreateUserMap() {
    const allUsers = await getUserDetailMap();
    const userIdNameMap: { value: string; label: string }[] = Object.values(allUsers)
        .map((user) => {
            if (user.userActive) {
                return {
                    value: user.userId,
                    label: user.userName
                };
            }
            return undefined;
        })
        .filter((user): user is { value: string; label: string } => user !== undefined);

    return userIdNameMap;
}