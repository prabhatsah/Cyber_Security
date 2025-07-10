"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserGroups } from "@/ikon/utils/actions/users";
import { getCurrentUserId, getProfileData } from "@/ikon/utils/actions/auth";

// const user = {
//   role: "suppliernone ",
// };

export default function TenderManagement() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserRole() {
      // Simulated API call (Replace with real authentication logic)
      const currUserId = await getCurrentUserId();
      const userGroupDetails = await getUserGroups(currUserId);
      console.log(userGroupDetails, "curr user groups");
      const userGroupArray = userGroupDetails.map(
        (group: any) => group.groupName
      );
      console.log('group arr' , userGroupArray)

      let role = null;
      if (userGroupArray.includes("Buyer")) {
        role = 'buyer'
        // setUserRole("buyer");
      } else if (userGroupArray.includes("Supplier")) {
        role = 'supplier'
        //setUserRole("supplier");
      } else {
        role = null;
      }

      if (role === "buyer") {
        router.replace("/tender-management/buyer");
      } else if (role === "supplier") {
        router.replace("/tender-management/supplier");
      } else {
        router.replace("/tender-management/register");
      }

      //setUserRole(user.role);
    }
    fetchUserRole();
  }, [router]); // Run when router is available


  return <p className="text-center text-lg">Redirecting...</p>;
}
