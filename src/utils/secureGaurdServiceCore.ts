// secureGaurdServiceCore.ts
export class UserDetails {
  private roles: string[] = [];
  private userId: string | null = null;
  private accountId: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const savedRoles = localStorage.getItem("user_roles");
      this.roles = savedRoles ? JSON.parse(savedRoles) : [];
      this.userId = localStorage.getItem("user_id");
      this.accountId = localStorage.getItem("account_id");
    }
  }

  getUserId() {
    return this.userId;
  }

  getAccountId() {
    return this.accountId;
  }

  getCurrentSoftwareRoles() {
    return this.roles;
  }

  setCurrentSoftwareRoles(roles: string[]) {
    this.roles = roles;
    if (typeof window !== "undefined") {
      localStorage.setItem("user_roles", JSON.stringify(roles));
    }
  }
}

import * as api from "./api";
import * as ikonGroup from "../ikon/utils/api/groupService";
import * as ikonRole from "../ikon/utils/api/roleService";
import * as ikonSoftware from "../ikon/utils/api/softwareService";
import * as ikonUser from "../ikon/utils/api/userService";
import * as ikonLogin from "../ikon/utils/api/loginService";
import * as ikonAccount from "../ikon/utils/api/accountService";

const currentUserDetails = new UserDetails();

export const secureGaurdServiceCore = {
  db: {
    ...api,
  },
  IkonService: {
    ...ikonGroup,
    ...ikonRole,
    ...ikonSoftware,
    ...ikonUser,
    ...ikonLogin,
    ...ikonAccount,
  },
  userDetails: currentUserDetails,
};
