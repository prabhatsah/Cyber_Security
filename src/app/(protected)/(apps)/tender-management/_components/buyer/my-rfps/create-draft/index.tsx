"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { IconButtonWithTooltip, IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import Link from "next/link";
import { getCurrentUserId } from "@/ikon/utils/actions/auth";
import { getUserGroups } from "@/ikon/utils/actions/users";

function CreateDraftButtonWithModal({
  currUserId,
  userGroupDetails,
}: {
  currUserId: string;
  userGroupDetails: any;
}) {
  const [isTenderCreator, setTenderCreator] = useState(false);

  useEffect(() => {
    const fetchUserGroupDetails = async () => {
      try {
        //const currUserId = await getCurrentUserId();
        if (!currUserId) return;

        //const userGroupDetails = await getUserGroups(currUserId);
        if (userGroupDetails) {
          const isResponseCreator = userGroupDetails.some(
            (group: any) => group.groupName === "Tender Creator"
          );
          setTenderCreator(isResponseCreator);
        }
      } catch (error) {
        console.error("Error fetching user groups:", error);
      }
    };

    fetchUserGroupDetails();
  }, []);

  if (!isTenderCreator) return null;

  return (
    <Link href="./Tender" passHref>
      <IconTextButtonWithTooltip tooltipContent="Create Draft">
        <Plus />
        Create Tender
      </IconTextButtonWithTooltip>
    </Link>
  );
}

export default CreateDraftButtonWithModal;
