import {
  SheetDescriptor,
  Spreadsheet,
} from "@progress/kendo-react-spreadsheet";
import * as React from "react";
import { toolbar } from "./toolbar";

const LicenseKendoSummary = ({ sheets }: { sheets: SheetDescriptor[] }) => {
  const [newSheets, setNewSheets] = React.useState(sheets ?? []);
  React.useEffect(() => {
    setNewSheets(sheets);
  }, [sheets]);
  return (
    <Spreadsheet
      style={{
        width: "100%",
        height: 680,
      }}
      defaultProps={{ sheets: newSheets ?? [] }}
      toolbar={toolbar}
    />
  );
};

export default LicenseKendoSummary;
