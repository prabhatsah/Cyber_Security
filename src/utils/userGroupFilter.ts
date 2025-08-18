import { getCookieSession } from "@/ikon/utils/session/cookieSession";
import { secureGaurdService } from "./secureGaurdService";

export class userDetails {
  private static userGroup: string[] = [];
  private softwareId = "eacf9250-619a-442d-bb28-2c83991185fc";
  public userRoleAndGroupsMapForCurrentSoftware = {};

  public async getUserId() {
    return (await secureGaurdService.IkonService.getLoggedInUserProfile())
      .USER_ID;
  }

  public async getAccountId(): Promise<string> {
    return (await secureGaurdService.IkonService.getAccountTree()).ACCOUNT_ID;
  }

  public async getCurrentSoftwareRoles() {
    return secureGaurdService.IkonService.getAllRoleForSoftwaresV2({
      softwareIds: [this.softwareId],
    });
  }

  async getUserRolesForthisSoftware() {
    const userId = await this.getUserId();
    const accountId = await this.getAccountId();
    const softwareRoles = await this.getCurrentSoftwareRoles();
    let roles =
      await secureGaurdService.IkonService.getAllRoleMembershipForUser({
        userId: userId,
        accountId: accountId,
      });
    let allUserRoles = roles.filter((role: Record<string, string>) => {
      return softwareRoles.some(
        (softwareRole: Record<string, string>) =>
          softwareRole.ROLE_ID === role.ROLE_ID
      );
    });
    return allUserRoles;
  }

  async getGroupsFromCurrentUserRoles() {
    const userRoles = await this.getUserRolesForthisSoftware();
    let userRoleArray = [];
    for (let i = 0; i < userRoles.length; i++) {
      const role = userRoles[i];
      if (role.ROLE_ID) {
        userRoleArray.push(role.ROLE_ID);
      }
    }
    let userGroups = secureGaurdService.IkonService.getAllGroupForRoles({
      roleIds: userRoleArray,
    });
    return userGroups;
  }
}
