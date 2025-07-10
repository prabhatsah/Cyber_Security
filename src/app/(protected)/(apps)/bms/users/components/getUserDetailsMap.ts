'use server'
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";

export async function getUserDetailsMap(){
    const userDetailsMap = await getUserIdWiseUserDetailsMap();
    return userDetailsMap;
}