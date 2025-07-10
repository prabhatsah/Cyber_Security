"use client";
import { useThemeOptions } from "@/ikon/components/theme-provider";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getProfileData } from "@/ikon/utils/actions/auth";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { Button } from "@/shadcn/ui/button";
import React from "react";
import { toast } from "sonner";

function SaveThemeButton({ userGroups }: { userGroups: string[] }) {
  const { state } = useThemeOptions();
  async function saveTheme() {
    if (userGroups?.includes("CLIENTADMIN")) {
      const accountThemeData = {
        dark: state.dark,
        light: state.light,
        accountId: await getActiveAccountId(),
      };
      const accountApearenceInstance = await getMyInstancesV2({
        processName: "Account Appearance",
        predefinedFilters: { taskName: "Edit" },
        projections: null,
      });
      if (accountApearenceInstance.length == 0) {
        const processId = await mapProcessName({
          processName: "Account Appearance",
        });
        await startProcessV2({
          processId: processId,
          data: accountThemeData,
          processIdentifierFields: "accountId",
        });
      } else {
        await invokeAction(
          {
            data: accountThemeData,
            taskId: accountApearenceInstance[0].taskId,
            transitionName: "update edit",
            processInstanceIdentifierField: "accountId",
          },
          ["accountTheme"]
        );
      }
    }

    let profile = await getProfileData();

    const appearanceData = {
      font: state.font,
      mode: state.mode,
      radius: state.radius,
      userLogin: profile.USER_LOGIN,
      userId: profile.USER_ID,
    };

    const apearenceInstance = await getMyInstancesV2({
      processName: "Appearance",
      predefinedFilters: { taskName: "Edit" },
      projections: null,
    });
    if (apearenceInstance.length == 0) {
      const processId = await mapProcessName({ processName: "Appearance" });
      await startProcessV2({
        processId: processId,
        data: appearanceData,
        processIdentifierFields: "userId",
      });
    } else {
      await invokeAction(
        {
          data: appearanceData,
          taskId: apearenceInstance[0].taskId,
          transitionName: "update edit",
          processInstanceIdentifierField: "userId",
        },
        ["userTheme"]
      );
    }
    toast.success("Theme saved successfully");
  }
  return <Button onClick={saveTheme}>Save</Button>;
}

export default SaveThemeButton;
