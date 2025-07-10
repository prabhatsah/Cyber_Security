import { getLoggedInUserProfile, getLoggedInUserProfileDetails } from "@/ikon/utils/api/loginService";
import { clearAllCookieSession } from "@/ikon/utils/session/cookieSession";
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const data1 = await getLoggedInUserProfile(true);
        const data2 = await getLoggedInUserProfileDetails(true);
        return NextResponse.json({ ...data1, ...data2 })
    } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === "AUTHENTICATIONEXCEPTION") {
            await clearAllCookieSession()
            return NextResponse.redirect("/login");
        }
        return NextResponse.error()
    }
}
