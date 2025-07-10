import { useState, useEffect, memo, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { format, parse, subMonths } from "date-fns";

import ComboboxInput from "@/ikon/components/combobox-input";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";

interface TotalUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mappedUserDetail: any;
  selDate: string;
}

interface UserData {
  date: string;
  newUsersData: Array<{
    isAdmin: boolean;
  }>;
}

const TotalUserModal: React.FC<TotalUserModalProps> = ({
  isOpen,
  onClose,
  mappedUserDetail,
  selDate,
}) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [month, setMonth] = useState<{ value: string; label: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState(selDate);
  const [userDetails, setUserDetails] = useState<Record<string, UserData>>({});

  useEffect(() => {
    if (mappedUserDetail) {
      const converterData = mappedUserDetail;
      let userDetailsMonthMap =
        converterData.converterConfigDataServerMap.Production["User List"]
          .monthWiseUserStatus;

      const mappedUserDetails = userDetailsMonthMap.reduce(
        (acc: Record<string, UserData>, entry: UserData) => {
          acc[entry.date] = entry;
          return acc;
        },
        {}
      );

      const monthsArray = Object.keys(mappedUserDetails).map((date) => ({
        value: date,
        label: format(date, "MMM-yyyy"),
      }));

      setMonth(monthsArray);
      setSelectedDate(selDate);
      setUserDetails(mappedUserDetails);
    }
  }, [mappedUserDetail]);

  const getFilteredUsers = useMemo(() => {
    if (!selectedDate || Object.keys(userDetails).length === 0) return [];

    const parsedDate = parse(selectedDate, "yyyy-MM", new Date());
    const pastMonth = format(subMonths(parsedDate, 1), "yyyy-MM");

    const calculateUserCounts = (date: string) => {
      let adminCount = 0;
      let nonAdminCount = 0;

      if (userDetails[date]) {
        userDetails[date].newUsersData.forEach((user) => {
          user.isAdmin ? adminCount++ : nonAdminCount++;
        });
      }

      return { adminCount, nonAdminCount, totalCount: adminCount + nonAdminCount };
    };

    const selectedMonthUsers = calculateUserCounts(selectedDate);
    const pastMonthUsers = calculateUserCounts(pastMonth);

    setTotalUsers(selectedMonthUsers.totalCount);

    return [
      {
        server: "Production",
        adminUsers: selectedMonthUsers.adminCount + pastMonthUsers.adminCount,
        nonAdminUsers: selectedMonthUsers.nonAdminCount + pastMonthUsers.nonAdminCount,
        totalUsers: selectedMonthUsers.totalCount + pastMonthUsers.totalCount,
      },
    ];
  }, [selectedDate, userDetails]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "server",
      header: () => <div style={{ textAlign: "center" }}>Server</div>,
      cell: ({ row }) => <span>{row.original?.server}</span>,
    },
    {
      accessorKey: "adminUsers",
      header: () => <div style={{ textAlign: "center" }}>Admin Users</div>,
      cell: ({ row }) => <span>{row.original?.adminUsers}</span>,
    },
    {
      accessorKey: "nonAdminUsers",
      header: () => <div style={{ textAlign: "center" }}>Non-Admin Users</div>,
      cell: ({ row }) => <span>{row.original?.nonAdminUsers}</span>,
    },
    {
      accessorKey: "totalUsers",
      header: () => <div style={{ textAlign: "center" }}>Total Users</div>,
      cell: ({ row }) => <span>{row.original?.totalUsers}</span>,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal>
      <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Total Active Users</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <div className="w-1/2">
            <ComboboxInput
              items={month}
              placeholder="Please Select the month"
              onSelect={(selectedMonth: string) => setSelectedDate(selectedMonth)}
              defaultValue={selectedDate}
            />
          </div>
          <div className="w-1/2">
            <Input value={totalUsers} readOnly />
          </div>
        </div>
        <DataTable columns={columns} data={getFilteredUsers} />
      </DialogContent>
    </Dialog>
  );
};

export default memo(TotalUserModal);
