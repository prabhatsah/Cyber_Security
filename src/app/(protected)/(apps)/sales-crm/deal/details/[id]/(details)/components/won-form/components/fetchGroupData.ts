"use server"

import { getUsersByGroupName } from "@/ikon/utils/actions/users"

export async function getProjectManagerDetails(){
    const projectManagerDetails = await getUsersByGroupName("Project Manager");
    return projectManagerDetails;
}

export async function getAccountManagerDetails(){
    const accountManagerDetails = await getUsersByGroupName("Account Manager");
    return accountManagerDetails;
}

