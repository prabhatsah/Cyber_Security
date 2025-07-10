"use client";

import LicenseTableData from "../table-data";
import WidgetData from "./widget-data";

export default function LicenseWidget() {
  return (
    <>
      <WidgetData />
      <div className="flex-grow overflow-hidden mt-2">
        <LicenseTableData />
      </div>
    </>
  );
}
