import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getAllSubscribedSoftwaresForClient } from "@/ikon/utils/api/softwareService";
import { clearAllCookieSession } from "@/ikon/utils/session/cookieSession";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accountId = await getActiveAccountId();
    const softwares = await getAllSubscribedSoftwaresForClient(
      {
        accountId,
      },
      true
    );
    return NextResponse.json(softwares);
  } catch (error) {
    if (error instanceof Error && error.message === "AUTHENTICATIONEXCEPTION") {
      await clearAllCookieSession();
      return NextResponse.redirect("/login");
    }
    console.error(error);
    return NextResponse.error();
  }
}
