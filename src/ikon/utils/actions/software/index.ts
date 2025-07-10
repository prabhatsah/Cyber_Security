"use server";
import { cache } from "react";
import {
  getAccessibleSoftwareForUser,
  getAllSubscribedSoftwaresForClient,
  mapSoftwareName,
} from "@/ikon/utils/api/softwareService";
import {
  getCookieSession,
  setCookieSession,
} from "@/ikon/utils/session/cookieSession";
import { cookies } from "next/headers";
import { SubscribeSoftwareProps } from "../../api/softwareService/type";

export const getBaseSoftwareId = async (): Promise<string | undefined> => {
  return await getCookieSession("baseSoftwareId");
};

export const getOrSetBaseSoftwareId = async (): Promise<string | undefined> => {
  let baseSoftwareId = await getCookieSession("baseSoftwareId");
  if (!baseSoftwareId) {
    try {
      baseSoftwareId = await getSoftwareIdByNameVersion("Base App", "1");
      await setBaseSoftwareId(baseSoftwareId);
    } catch (error) {
      console.error(error);
    }
  }
  return baseSoftwareId;
};

export const setBaseSoftwareId = async (softwareId: string) => {
  await setCookieSession("baseSoftwareId", softwareId);
};

export const getCurrentSoftwareId = async (): Promise<string> => {
  return (await getCookieSession("currentSoftwareId")) || "";
};

export const getCurrentAppName = async (): Promise<string> => {
  return (await getCookieSession("currentAppName")) || "";
};

export const setCurrentSoftwareId = async (softwareId: string) => {
  await setCookieSession("currentSoftwareId", softwareId);
};

export const getSoftwareIdByNameVersion = cache(
  async (softwareName: string, version: string): Promise<string> => {
    return await mapSoftwareName({ softwareName, version });
  }
);

export const setCurrentSoftwareIdByNameVersion = async (
  softwareName: string,
  version: string
) => {
  const softwareId = await getSoftwareIdByNameVersion(softwareName, version);
  await setCurrentSoftwareId(softwareId);
};

export const getAccessibleSoftware = cache(
  async (accountId: string, userId: string) => {
    return await getAccessibleSoftwareForUser({ accountId, userId });
  }
);

// export const getAllSubscribedSoftwares = cache(async (accountId: string) => {
//     return await getAllSubscribedSoftwaresForClient({ accountId });
// });

export const getAllSubscribedSoftwares = async (
  accountId?: string
): Promise<SubscribeSoftwareProps[]> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; "); // Convert to a valid Cookie header string

    // Fetch API with cookies
    const resp = await fetch(
      `${process.env.NEXT_BASE_PATH_URL}/api/software/subscribe`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: cookieHeader, // ✅ Send all cookies
          body: JSON.stringify({
            accountId,
          }),
        },
        cache: "force-cache",
        next: {
          revalidate: 600,
          tags: ["subscribe-softwares"],
        },
      }
    );

    if (!resp.ok) throw new Error("Failed to fetch subscribe softwares");

    return resp.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
