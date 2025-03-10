"use server"

import { revalidatePath, revalidateTag } from "next/cache";
import { RevalidateProps } from "./type";

export async function revalidateData({ paths, tags }: RevalidateProps) {
    if (tags) {
        for (const tag of tags) {
            revalidateTag(tag)
        }
    }

    if (paths) {
        for (const path of paths) {
            revalidatePath(path)
        }
    }
}