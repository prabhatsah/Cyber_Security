// utils/authRedirect.ts
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { redirect } from "next/navigation";

export async function handleAuthRedirect() {
  const user = await getLoggedInUserProfile();
  console.log("this is the user",user)
  if (user?.USER_ID) {
    redirect("/cyber-security/dashboard");
  } else {
    redirect("/login");
  }
}
