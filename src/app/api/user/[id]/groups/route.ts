import {
  getBaseSoftwareId,
  getCurrentSoftwareId,
} from "@/ikon/utils/actions/software";
import { getUserDashboardPlatformUtilData } from "@/ikon/utils/actions/users";
import { clearAllCookieSession } from "@/ikon/utils/session/cookieSession";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    let softwareId = await getCurrentSoftwareId();
    const baseSoftwareId = await getBaseSoftwareId();
    const userDetailsMap = await getUserDashboardPlatformUtilData({
      softwareId: baseSoftwareId == softwareId ? undefined : softwareId,
      isUserGroups: true,
      userId: id,
    }, true);
    return NextResponse.json(userDetailsMap.groups);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "AUTHENTICATIONEXCEPTION") {
      await clearAllCookieSession()
      return NextResponse.redirect("/login");
    }
    return NextResponse.error();
  }
}
