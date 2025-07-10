import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import {
  getUserIdWiseUserDetailsMap,
  getUserDashboardPlatformUtilData,
} from "@/ikon/utils/actions/users";

import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import Loading from "../../../../loading";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Button } from "@/shadcn/ui/button";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";

export default function ShareAccessModal({
  componentType,
  isOpen,
  onClose,
  onSubmit,
  viewGroupName,
  editGroupName,
}: {
  isOpen: boolean;
  onClose?: () => void;
  onSubmit?: (viewArray?: string[], editArray?: string[]) => void;
  componentType?: string;
  viewGroupName?: string;
  editGroupName?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [userMap, setUserMap] = useState<
    {
      userId: string;
      userName: string | null;
    }[]
  >([]);
  let viewAccessUserArray = useRef<string[]>([]);

  let editAccessUserArray = useRef<string[]>([]);

  const fetchRequiredUserDetails = async () => {
    setIsLoading(true);
    const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
    const userMap = Object.values(userIdWiseUserDetailsMap)
      .filter((user) => user.userActive)
      .map((user) => ({
        userId: user.userId,
        userName: user.userName,
      }));
    setUserMap(userMap);
    if (viewGroupName && editGroupName) {
      const softwareId = await getCurrentSoftwareId();
      const userDetailsMap = await getUserDashboardPlatformUtilData({
        softwareId,
        isGroupNameWiseUserDetailsMap: true,
      });
      console.log(userDetailsMap);

      editAccessUserArray.current = Object.keys(
        userDetailsMap[editGroupName].users
      );
      viewAccessUserArray.current = Object.keys(
        userDetailsMap[viewGroupName].users
      );
      console.log(editAccessUserArray.current);
      console.log(viewAccessUserArray.current);
      setIsLoading(false);
    }
  };

  const handleViewAccessChange = (prevState: string, userId: string) => {
    console.log("userId" + userId);
    if (prevState == "unchecked") {
      viewAccessUserArray.current.push(userId);
    } else {
      const index = viewAccessUserArray.current.indexOf(userId);
      if (index !== -1) {
        viewAccessUserArray.current.splice(index, 1);
      }
    }
  };

  const handleEditAccessChange = (prevState: string, userId: string) => {
    console.log("userId" + userId);
    if (prevState == "unchecked") {
      editAccessUserArray.current.push(userId);
    } else {
      const index = editAccessUserArray.current.indexOf(userId);
      if (index !== -1) {
        editAccessUserArray.current.splice(index, 1);
      }
    }
  };

  const handleAccessUpdateDialogSave = () => {
    if (onSubmit && viewAccessUserArray && editAccessUserArray) {
      onSubmit(viewAccessUserArray?.current, editAccessUserArray?.current);
    }
    if (onClose) {
      onClose();
    }
  };

  const columns: DTColumnsProps<{
    userId: string;
    userName: string | null;
  }>[] = [
    {
      accessorKey: "User",
      header: () => (
        <div style={{ textAlign: "center", width: "w-full" }}>Dataset name</div>
      ),
      cell: ({ row }) => <span>{row.original?.userName || "n/a"}</span>,
    },
    {
      accessorKey: "userName",
      header: () => <div style={{ textAlign: "center" }}>Edit </div>,
      cell: ({ row }) => (
        <Checkbox
          defaultChecked={editAccessUserArray.current?.includes(
            row.original.userId
          )}
          onClick={(e) => {
            console.log("inside on click");
            handleEditAccessChange(
              e.currentTarget.getAttribute("data-state") ?? "",
              row.original.userId
            );
          }}
        />
      ),
    },
    {
      accessorKey: "userId",
      header: () => <div style={{ textAlign: "center" }}>View</div>,
      cell: ({ row }) => (
        <Checkbox
          defaultChecked={viewAccessUserArray.current?.includes(
            row.original.userId
          )}
          onClick={(e) => {
            console.log("inside on click");
            handleViewAccessChange(
              e.currentTarget.getAttribute("data-state") ?? "",
              row.original.userId
            );
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchRequiredUserDetails();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle> Share {componentType ?? componentType}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Loading />
        ) : (
          <DataTable columns={columns} data={userMap} />
        )}
        <DialogFooter>
          <Button type="submit" onClick={handleAccessUpdateDialogSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
