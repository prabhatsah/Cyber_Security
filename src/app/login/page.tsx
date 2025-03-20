"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getLoggedInUserProfile,
  login,
} from "@/ikon/utils/api/loginService/index";
import { toast } from "sonner";
import { setCurrentUserId, setTicket } from "@/ikon/utils/actions/auth/index";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getAccountTree } from "@/ikon/utils/api/accountService";
import { setActiveAccountId } from "@/ikon/utils/actions/account";
import { redirect, useRouter } from "next/navigation";
import SignUp from "./components_signUp/signup_form_component";
import { clearAllCookieSession } from "@/ikon/utils/session/cookieSession";
import { LoginForm } from "@/components/ui/login-form";

const SigninFormSchema = z.object({
  userName: z.string().min(2, { message: "Please enter username." }).trim(),
  password: z.string().min(8, { message: "Please enter password." }).trim(),
});

function Login() {
  const router = useRouter();
  const form = useForm<z.infer<typeof SigninFormSchema>>({
    resolver: zodResolver(SigninFormSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const [open, setOpen] = useState(false);

  async function signin(data: z.infer<typeof SigninFormSchema>) {
    try {
      await clearAllCookieSession();
    } catch (error) {
      console.error(error);
    }
    try {
      const result = await login(data);

      if (result?.error) {
        toast.error(result.error.message);
      }

      if (result?.message) {
        toast.info(result.message);
      }

      if (result?.ticket) {
        await setTicket(result.ticket);

        try {
          const profile = await getLoggedInUserProfile();
          await setCurrentUserId(profile.USER_ID);
        } catch (error) {
          toast.warning("Error while feaching profile data.");
        }

        try {
          const account = await getAccountTree();
          await setActiveAccountId(account.ACCOUNT_ID);
        } catch (error) {
          toast.warning("Error while feaching account data.");
        }

        router.push("/");

      }
    } catch (error) {
      toast.error("Error while login.");
    }
  }
  return (
    <div className="flex h-full w-full items-center justify-center  ">
      <div className=" ">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
