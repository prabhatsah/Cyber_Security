import { getCurrentUserId } from "@/ikon/utils/actions/auth";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";
import { getUserDashboardPlatformUtilData } from "@/ikon/utils/actions/users";
import { UserIdWiseUserDetailsMapProps } from "@/ikon/utils/actions/users/type";

export async function createUserMap() {
  const softwareId = await getCurrentSoftwareId();
  const allUsers: UserIdWiseUserDetailsMapProps =
    await getUserDashboardPlatformUtilData({ softwareId });
  const userIdNameMap: { value: string; label: string }[] = Object.values(
    allUsers
  )
    .map((user) => {
      if (user.userActive) {
        return {
          value: user.userId,
          label: user.userName,
        };
      }
      return undefined;
    })
    .filter(
      (user): user is { value: string; label: string } => user !== undefined
    );

  return userIdNameMap;
}

const userIdNameMap: { value: string; label: string }[] = await createUserMap();

export function getUserNameById(id: string | undefined) {
  return userIdNameMap.find((user) => user.value === id)?.label || "N/A";
}
