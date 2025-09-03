// "use client";

import * as api from "./api";
import * as ikonGroup from "../ikon/utils/api/groupService";
import * as ikonRole from "../ikon/utils/api/roleService";
import * as ikonSoftware from "../ikon/utils/api/softwareService";
import * as ikonUser from "../ikon/utils/api/userService";
import * as ikonLogin from "../ikon/utils/api/loginService";
import * as ikonAccount from "../ikon/utils/api/accountService";
import { userDetails } from "../utils/userGroupFilter";

const currentUserDetails = new userDetails();

export const secureGaurdService = {
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
  userDetails: {
    getUserId: () => currentUserDetails.getUserId(),
    getAccountId: () => currentUserDetails.getAccountId(),
    getCurrentsoftwareRoles: () => currentUserDetails.getCurrentSoftwareRoles(),
    getUserRolesForthisSoftware: () =>
      currentUserDetails.getUserRolesForthisSoftware(),
    getGroupsFromCurrentUserRoles: () =>
      currentUserDetails.getGroupsFromCurrentUserRoles(),
  },
};

// if (typeof window !== "undefined") {
//   (window as any).secureGaurdService = secureGaurdService;
//   console.log("secureGaurdService exposed on window for debugging.");
// }
