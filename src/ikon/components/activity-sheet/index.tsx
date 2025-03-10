"use client"
import React from "react";
import { AlignJustify } from "lucide-react";
import { TabArray } from "../tabs/type";
import TabContainer from "../tabs";
import NoDataComponent from "../no-data";
import UploadTab from "../upload-tab";
import { SheetComponent } from "../sheet";

export type ActivityLogProps = {
  id: string;
  activity: string;
  updatedBy: string;
  updatedOn: string;
  source: string;
  parentId: string;
};

export function ActivitySheet({ activityLogs = [] }: { activityLogs?: ActivityLogProps[] }) {

  const tabArray: TabArray[] = [
    {
      tabName: "Activity",
      tabId: "tab-activity",
      default: true,
      tabContent: <div className="overflow-auto flex flex-col gap-2 h-full">
        {activityLogs.length > 0 ? (
          activityLogs.map((log: any) => (
            <div key={log.id} className="border-b text-sm pb-2">
              <p className="font-medium pb-1">{log.activity}</p>
              <p className="text-gray-500 pb-1">
                Updated On:{" "}
                <span className="text-gray-700">
                  {new Date(log.updatedOn).toLocaleString()}
                </span>
              </p>
              <p className="text-gray-500 pb-1">
                {/* Updated By: <span className="text-gray-700">{userMap[log.updatedBy]?.userName || "n/a"}</span> */}
                Updated By: <span className="text-gray-700">{log.updatedBy}</span>
              </p>
            </div>
          ))
        ) : (
          <NoDataComponent text="No Activity Logs Available" />
        )}
      </div>
    }, {
      tabName: "File Upload",
      tabId: "tab-upload",
      default: false,
      tabContent: <UploadTab />
    }
  ]
  return (
    <SheetComponent
      buttonText=""
      buttonIcon={<AlignJustify />}
      sheetTitle=""
      sheetContent={<TabContainer tabArray={tabArray} tabListClass='' />}
      closeButton={true}
    />
  );
}