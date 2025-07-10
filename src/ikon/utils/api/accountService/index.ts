"use server";
import ikonBaseApi from "@/ikon/utils/api/ikonBaseApi";
import { GetAccountTreeProps } from "./type";

export const getAccountTree = async (): Promise<GetAccountTreeProps> => {
  const result = await ikonBaseApi({
    service: "accountService",
    operation: "getAccountTree",
  });
  return result.data;
};

export const checkExistingAccount = async ({
  accountName,
}: {
  accountName: string;
}): Promise<boolean> => {
  const result = await ikonBaseApi({
    service: "accountService",
    operation: "checkExistingAccount",
    arguments_: [accountName],
  });
  return result.data;
};

export const getFullAccountTree = async (): Promise<any> => {
  const result = await ikonBaseApi({
    service: "accountService",
    operation: "getFullAccountTree",
  });
  return result.data;
};

export const getAllInvitedAccountsForUser = async (
  userId: string
): Promise<any> => {
  const result = await ikonBaseApi({
    service: "userInvitationService",
    operation: "getAllInvitedAccountsForUser",
    arguments_: [userId],
  });
  return result.data;
};
