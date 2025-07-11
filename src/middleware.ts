import { getAccountTree } from "@/ikon/utils/api/accountService";
import { mapSoftwareName } from "@/ikon/utils/api/softwareService";
import { NextRequest, NextResponse } from "next/server";
import {
  cookiePrefix,
  currentSoftwareIdSessionKey,
} from "@/ikon/utils/config/const";
import { appWiseSoftwareNameVersionMap } from "./ikon/utils/config/app-wise-software-name-version-map";
import { getLoggedInUserProfile } from "./ikon/utils/api/loginService";

const loginUrl = "/cyber-security/login";

// 1. Specify public routes
const publicRoutes = ["/login", "/signup", "/forgot-password", "/otp"];

export default async function middleware(req: NextRequest) {
  const nextResponse = NextResponse.next();

  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  // 2. Check authentication status via cookies
  const ticket = req.cookies.get(cookiePrefix + "ticket");

  console.log("req - ", req);
  console.log("isPublicRoute - ", isPublicRoute);
  console.log("ticket - ", ticket);

  if (!isPublicRoute && !ticket) {
    return NextResponse.redirect(new URL(loginUrl, req.url));
  }

  if (!isPublicRoute && ticket) {
    const currentUserId = req.cookies.get(cookiePrefix + "currentUserId");
    // if (!currentUserId) {
    try {
      const profile = await getLoggedInUserProfile();
      nextResponse.cookies.set(cookiePrefix + "currentUserId", profile.USER_ID);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return NextResponse.redirect(new URL(loginUrl, req.url));
    }
    // }

    const activeAccountId = req.cookies.get(cookiePrefix + "activeAccountId");
    if (!activeAccountId) {
      try {
        const account = await getAccountTree();
        nextResponse.cookies.set(
          cookiePrefix + "activeAccountId",
          account.ACCOUNT_ID
        );
      } catch (error) {
        console.error("Error fetching account tree:", error);
        return NextResponse.redirect(new URL(loginUrl, req.url));
      }
    }

    let baseSoftwareId =
      req.cookies?.get(cookiePrefix + "baseSoftwareId")?.value || "";
    if (!baseSoftwareId) {
      try {
        baseSoftwareId = await mapSoftwareName({
          softwareName: "Base App",
          version: "1",
        });
        nextResponse.cookies.set(
          cookiePrefix + "baseSoftwareId",
          baseSoftwareId
        );
      } catch (error) {
        console.error("Error fetching baseSoftwareId:", error);
      }
    }
    let cyberSecuritySoftwareId = "";

    try {
      cyberSecuritySoftwareId = await mapSoftwareName({
        softwareName: "Test S2 Cyber Security",
        version: "1",
      });
      console.log("this is the software id--> " + cyberSecuritySoftwareId);
    } catch (error) {
      console.error("Error fetching cyberSecuritySoftwareId:", error);
    }

    //console.log("Cyber Security Software Id: ", cyberSecuritySoftwareId);

    const pathParts = path.split("/");
    if (pathParts.length > 1 && pathParts[1] !== "") {
      const currentAppName = req.cookies?.get(
        cookiePrefix + "currentAppName"
      )?.value;
      if (currentAppName != pathParts[1]) {
        const software = appWiseSoftwareNameVersionMap[pathParts[1]];
        if (software) {
          try {
            const softwareId = await mapSoftwareName(software);
            nextResponse.cookies.set(currentSoftwareIdSessionKey, softwareId);
            nextResponse.cookies.set(
              cookiePrefix + "currentAppName",
              pathParts[1]
            );
          } catch (error) {
            console.error("Error fetching currentSoftwareId:", error);
          }
        } else {
          try {
            //const appName = "base-app";
            const appName = "cyber-security";
            nextResponse.cookies.set(
              currentSoftwareIdSessionKey,
              //baseSoftwareId
              cyberSecuritySoftwareId
            );
            nextResponse.cookies.set(cookiePrefix + "currentAppName", appName);
          } catch (error) {
            console.error("Error fetching currentSoftwareId:", error);
          }
        }
      }
    }
  }

  return nextResponse;
}

export const config = {
  matcher: ["/((?!_next|assets|api).*)"], // Exclude static and API routes
};
