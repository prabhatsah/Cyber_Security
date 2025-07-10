"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { getLoggedInUserProfile, login } from "@/ikon/utils/api/loginService/index";
import { toast } from "sonner";
import { setCurrentUserId, setTicket } from "@/ikon/utils/actions/auth/index";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { getAccountTree } from "@/ikon/utils/api/accountService";
import { setActiveAccountId } from "@/ikon/utils/actions/account";
import { useRouter } from "next/navigation";
import SignUp from "./components_signUp/signup_form_componenet";
import { clearAllCookieSession } from "@/ikon/utils/session/cookieSession";

const SigninFormSchema = z.object({
  userName: z
    .string()
    .min(2, { message: 'Please enter username.' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Please enter password.' })
    .trim(),
})

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
      await clearAllCookieSession()
    } catch (error) {
      console.error(error)
    }
    try {
      const result = await login(data);

      if (result?.error) {
        toast.error(result.error.message)
      }

      if (result?.message) {
        toast.info(result.message)
      }

      if (result?.ticket) {
        await setTicket(result.ticket)

        try {
          const profile = await getLoggedInUserProfile();
          await setCurrentUserId(profile.USER_ID);
        } catch (error) {
          toast.warning("Error while feaching profile data.")
        }

        try {
          const account = await getAccountTree();
          await setActiveAccountId(account.ACCOUNT_ID);
        } catch (error) {
          toast.warning("Error while feaching account data.")
        }

        router.push("/")
      }

    } catch (error) {
      toast.error("Error while login.")
    }
  }
  return (
    <>
      {/* Login Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(signin)}
          className="flex flex-col justify-between"
        >
          {/* Main Form Section */}
          <div className="main-form-section flex flex-col gap-3">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Username"
                      id="userName"
                      className="form-input-bg "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="************"
                      id="password"
                      className="form-input-bg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-right mb-3 forgot-password-text">
              <a href="/forgot-password" className="hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse lg:flex-row gap-3 justify-between items-center mb-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  form.reset();
                }}
                className='reset-btn'>
                Reset
              </button>
              <button
                className="login-btn">
                Login
              </button>
            </div>
            <div className="text-center text-white flex flex-row gap-2">
              <span className='dont-have-acct-text'>Don’t have any account?</span>
              <span className="signup-text" onClick={() => setOpen(true)}>Sign Up</span>
            </div>
            <div className='flex flex-col mt-5'>
              <span className='support-text'>Looking for Support?</span>
              <span className='version-text'>Version 8.0.0</span>
            </div>
          </div>
        </form>
      </Form>
      <SignUp open={open} setOpen={setOpen} />
    </>
  );
}

export default Login;
