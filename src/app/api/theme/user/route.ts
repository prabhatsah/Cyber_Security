import { getBaseSoftwareId } from "@/ikon/utils/actions/software"
import { UserThemeProps } from "@/ikon/utils/actions/theme/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { clearAllCookieSession } from "@/ikon/utils/session/cookieSession";
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const baseSoftwareId = await getBaseSoftwareId();
        const apearenceInstance = await getMyInstancesV2<UserThemeProps>({
            processName: "Appearance",
            softwareId: baseSoftwareId,
            projections: ["Data.mode", "Data.font", "Data.radius"]
        }, true);
        console.log("User Theme")
        return NextResponse.json(apearenceInstance?.[0]?.data)
    } catch (error) {
        console.error(error);
        if (error instanceof Error && error.message === "AUTHENTICATIONEXCEPTION") {
            await clearAllCookieSession()
            return NextResponse.redirect("/login");
        }
        return NextResponse.error()
    }
}
