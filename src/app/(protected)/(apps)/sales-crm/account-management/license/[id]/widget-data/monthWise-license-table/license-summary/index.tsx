"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { Eye, Upload, UserSquare } from "lucide-react";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import LicenseSummaryModal from "../license-summary-modal";
import BillingFileUpload from "../../../upload-billing/uploadBillModal";
import MarkAdminUser from "../../../mark-admin-user/MarkAdminUserModal";
import ExcludeUser from "../../../excluded-user/ExcludedUserModal";

interface UserData {
  billableUsersData: any;
  unbilledUsersData: any;
  deactivatedUsersData: any;
  date: string;
  newUsersData: Array<{
    isAdmin: boolean;
    userName: string;
    isActive: boolean;
    userId: string;
    events?: Array<{
      actor: string;
      event: string;
      timestamp: string;
    }>;
  }>;
}

interface User {
  isAdmin: boolean;
  userId: string;
  userName: string;
}

interface MonthWiseUserStatus {
  newUsersData: User[];
  date: string;
}

interface TableCell {
  value: string | number;
  textAlign: "left" | "center" | "right";
  bold?: boolean;
  background?: string;
}

interface SheetDescriptor {
  name: string;
  mergedCells: string[];
  columns: { width: number }[];
  rows: { cells: TableCell[] }[];
}

interface LicenseSummaryProps {
  data?: {
    converterConfigDataServerMap?: {
      [key: string]: {
        "User List"?: {
          monthWiseUserStatus?: MonthWiseUserStatus[];
        };
      };
    };
  };
  id: string | undefined;
  //accountId: string | undefined;
}

const LicenseSummaryComponent: React.FC<LicenseSummaryProps> = ({
  data,
  id,
}) => {
  // export default function LicenseSummaryComponent({  ,id}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen((prev) => !prev);

  const [monthsArray, setMonthsArray] = useState<
    { value: string; label: string }[]
  >([]);
  const [originalDateObjects, setOriginalDateObjects] = useState<
    MonthWiseUserStatus[]
  >([]);

  const [originalDateObjectsDev, setOriginalDateObjectsDev] = useState<
    MonthWiseUserStatus[]
  >([]);
  const [selMonth, setSelMonth] = useState<string>("");

  const [markAdminUserData, setMarkAdminUserData] = useState<
    Record<string, UserData>
  >({});

  useEffect(() => {
    const monthWiseUserStatus =
      data?.converterConfigDataServerMap?.Production?.["User List"]
        ?.monthWiseUserStatus;

    if (!monthWiseUserStatus) {
      setMonthsArray([]);
      setOriginalDateObjects([]);
      setSelMonth("");
      return;
    }

    setOriginalDateObjects(monthWiseUserStatus);

    const mappedMonths = monthWiseUserStatus.map((entry) => ({
      value: entry.date,
      label: format(new Date(entry.date), "MMM-yyyy"),
    }));

    setMonthsArray(mappedMonths);

    if (mappedMonths.length > 0) {
      setSelMonth(mappedMonths[mappedMonths.length - 1].value);
    }
  }, [data]);


  const rows = useMemo(() => {
    if (!selMonth) return [];

    const selectedMonthData = originalDateObjects.find(
      (item) => item.date === selMonth
    );
    if (!selectedMonthData) return [];

    const dataForRow = selectedMonthData.newUsersData || [];
    console.log("Data for selected month:", dataForRow);

    let adminCount = 0;
    let nonAdminCount = 0;

    const mappedRows = dataForRow.map((user) => {
      if (user.isAdmin) {
        adminCount++;
      } else {
        nonAdminCount++;
      }

      return {
        cells: [
          { value: user.userName, textAlign: "left" },
          { value: user.isAdmin ? 1 : 0, textAlign: "center" },
          { value: user.isAdmin ? 0 : 1, textAlign: "center" },
          { value: user.isAdmin ? 1 : 0, textAlign: "center" },
          { value: user.isAdmin ? 0 : 1, textAlign: "center" },
        ] as TableCell[],
      };
    });

    mappedRows.unshift(
      {
        cells: [
          {
            value: "Name",
            bold: true,
            background: "rgb(236,239,241)",
            textAlign: "center",
          },
          {
            value: "Production",
            bold: true,
            background: "rgb(236,239,241)",
            textAlign: "center",
          },
          {},
          {
            value: "Total Users",
            bold: true,
            background: "rgb(236,239,241)",
            textAlign: "center",
          },
          {},
        ] as TableCell[],
      },
      {
        cells: [
          {
            value: "Total",
            bold: true,
            background: "rgb(198,224,180)",
            textAlign: "center",
          },
          {
            value: "Admin",
            bold: true,
            background: "rgb(236,239,241)",
            textAlign: "center",
          },
          {
            value: "Non Admin",
            bold: true,
            background: "rgb(236,239,241)",
            textAlign: "center",
          },
          {
            value: "Admin",
            bold: true,
            background: "rgb(236,239,241)",
            textAlign: "center",
          },
          {
            value: "Non Admin",
            bold: true,
            background: "rgb(236,239,241)",
            textAlign: "center",
          },
        ] as TableCell[],
      },
      {
        cells: [
          {
            value: "Total",
            bold: true,
            background: "rgb(198,224,180)",
            textAlign: "center",
          },
          {
            value: adminCount,
            background: "rgb(198,224,180)",
            textAlign: "center",
          },
          {
            value: nonAdminCount,
            background: "rgb(198,224,180)",
            textAlign: "center",
          },
          {
            value: adminCount,
            background: "rgb(198,224,180)",
            textAlign: "center",
          },
          {
            value: nonAdminCount,
            background: "rgb(198,224,180)",
            textAlign: "center",
          },
        ] as TableCell[],
      }
    );

    return mappedRows;
  }, [selMonth, originalDateObjects]);

  const userSummary: SheetDescriptor[] = useMemo(() => {
    return [
      {
        name: "UserSummary",
        mergedCells: ["A1:A2", "B1:C1", "D1:E1"],
        columns: [
          { width: 150 },
          { width: 100 },
          { width: 100 },
          { width: 100 },
          { width: 100 },
        ],
        rows: rows,
      },
    ];
  }, [rows]);

  console.log("Generated User Summary:", userSummary);

  const [isModalOpenFile, setModalOpenFile] = useState(false);
  const toggleModalFile = () => {
    setModalOpenFile((prev) => !prev);
  };

  const [isModalOpenMarkAdmin, setModalOpenMarkAdmin] = useState(false);
  const toggleModalMarkAdmin = () => {
    setModalOpenMarkAdmin((prev) => !prev);
  };

  const [isModalOpenExcludedUser, setModalOpenExcludedUser] = useState(false);
  const toggleModalExcludedUser = () => {
    setModalOpenExcludedUser((prev) => !prev);
  };

  return (
    <>
      <IconTextButtonWithTooltip
        tooltipContent="View License Summary"
        variant="outline"
        onClick={toggleModal}
      >
        <Eye /> License Summary
      </IconTextButtonWithTooltip>

      <LicenseSummaryModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        rows={userSummary}
        monthArray={monthsArray}
        selectedMonth={selMonth}
      />

      <IconTextButtonWithTooltip
        tooltipContent="Upload License File"
        variant="outline"
        onClick={toggleModalFile}
      >
        <Upload />
      </IconTextButtonWithTooltip>

      <BillingFileUpload
        isOpen={isModalOpenFile}
        onClose={toggleModalFile}
        id={id}
      />

      <IconTextButtonWithTooltip
        tooltipContent="Mark Admin Users"
        variant="outline"
        onClick={toggleModalMarkAdmin}
      >
        <UserSquare />
      </IconTextButtonWithTooltip>

      <MarkAdminUser
        isOpen={isModalOpenMarkAdmin}
        onClose={toggleModalMarkAdmin}
        accountId={id}
      />

      <IconTextButtonWithTooltip
        tooltipContent="Excluded Users"
        variant="outline"
        onClick={toggleModalExcludedUser}
      >
        <UserSquare />
      </IconTextButtonWithTooltip>

      <ExcludeUser
        isOpen={isModalOpenExcludedUser}
        onClose={toggleModalExcludedUser}
        accountId={id}
      />
    </>
  );
};

export default LicenseSummaryComponent;
