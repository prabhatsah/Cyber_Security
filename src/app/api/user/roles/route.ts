import { getCurrentSoftwareId } from "@/ikon/utils/actions/software"
import { getUserDashboardPlatformUtilData } from "@/ikon/utils/actions/users"
import { clearAllCookieSession } from "@/ikon/utils/session/cookieSession";
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const roleNames = await request.json()

        const softwareId = await getCurrentSoftwareId();
        const userDetailsMap = await getUserDashboardPlatformUtilData({ softwareId, isRoleNameWiseUserDetailsMap: true, roleNames }, true);
        return NextResponse.json(userDetailsMap)
    } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === "AUTHENTICATIONEXCEPTION") {
            await clearAllCookieSession()
            return NextResponse.redirect("/login");
        }
        return NextResponse.error()
    }
}
