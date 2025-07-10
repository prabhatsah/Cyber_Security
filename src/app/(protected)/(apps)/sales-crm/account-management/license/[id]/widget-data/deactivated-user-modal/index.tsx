import { useState, useEffect, memo, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { format } from "date-fns";

import ComboboxInput from "@/ikon/components/combobox-input";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";

interface DeactivatedUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mappedUserDetail: any;
  selDate: string;
}

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

const DeactivatedUserModal: React.FC<DeactivatedUserModalProps> = ({
  isOpen,
  onClose,
  mappedUserDetail,
  selDate,
}) => {
  const [totalUsers, setTotalUsers] = useState(0);

  const [month, setMonth] = useState([]);
  const [newUser, setNewUser] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [userDetails, setUserDetails] = useState<Record<string, UserData>>({});

  useEffect(() => {
    if (mappedUserDetail) {
      console.log("selDate", selDate);

      console.log(mappedUserDetail);
      const converterData = mappedUserDetail;

      let userDetailsMonthMap =
        converterData.converterConfigDataServerMap.Production["User List"]
          .monthWiseUserStatus;

      const mappedUserDetails = mapUserDetailsByDate(userDetailsMonthMap);
      console.log("mappedUserDetails ", mappedUserDetails);

      const monthsArray = Object.keys(mappedUserDetails).map((date) => ({
        value: date,
        label: format(date, "MMM-yyyy"),
      }));
      setMonth(monthsArray);
      setSelectedDate(selDate);
      setUserDetails(userDetailsMonthMap);
    }
  }, [mappedUserDetail]);

  const mapUserDetailsByDate = (
    userDetails: UserData[]
  ): Record<string, UserData[]> => {
    return userDetails.reduce((acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = [];
      }
      acc[entry.date].push(entry);
      return acc;
    }, {} as Record<string, UserData[]>);
  };


  const getFilteredUsers = useMemo(() => {
    console.log("Mapped User Detail:", userDetails);

    let filteredUsers: {
      server: string;
      adminUsers: number;
      nonAdminUsers: number;
      totalUsers: number;
    }[] = [];

    let userDetail =
      mappedUserDetail.converterConfigDataServerMap["Production"]["User List"]
        .monthWiseUserStatus;

    let adminCount = 0;
    let nonAdminCount = 0;
    let totalCount = 0;

    for (let i in userDetail) {
      if (userDetail[i].date == selectedDate) {
        console.log(userDetail[i].deactivatedUsersData);

        let decativeUsersCreated = userDetail[i].deactivatedUsersData.length;
        console.log("decativeUsersCreated ", decativeUsersCreated);

        setNewUser(decativeUsersCreated);

        userDetail[i]?.deactivatedUsersData?.forEach((user: { isAdmin: any }) => {
          if (user.isAdmin) {
            adminCount++;
          } else {
            nonAdminCount++;
          }
        });

        totalCount = adminCount + nonAdminCount;
        break;
      }
    }

    console.log({ adminCount, nonAdminCount, totalCount });
    filteredUsers = [
      {
        server: "Production",
        adminUsers: adminCount,
        nonAdminUsers: nonAdminCount,
        totalUsers: totalCount,
      },
    ];
    return filteredUsers;
  }, [selectedDate, userDetails]);

  const column: ColumnDef<any>[] = [
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
          <DialogTitle>Deactivate Users</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <div className="w-1/2">
            <ComboboxInput
              items={month}
              placeholder="Please Select the month"
              onSelect={(selectedMonth: any) => setSelectedDate(selectedMonth)}
              defaultValue={selectedDate}
            />
          </div>
          <div className="w-1/2">
            <Input value={newUser} readOnly />
          </div>
        </div>
        <div>
          <DataTable columns={column} data={getFilteredUsers} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(DeactivatedUserModal);
