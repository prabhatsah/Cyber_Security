import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/Input";
import { Label } from "@/components/ui/label";
import { BiSolidLock } from "react-icons/bi";
import { FiKey } from "react-icons/fi";
import { BiShield } from "react-icons/bi"; // Importing Shield icon
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"; // Adjusted to the correct path
import { useForm } from 'react-hook-form'; // Assuming you're using react-hook-form
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { clearAllCookieSession } from "@/ikon/utils/session/cookieSession";
import { setCurrentUserId, setTicket } from "@/ikon/utils/actions/auth";
import Login from "@/app/login/page";
import { getLoggedInUserProfile, login } from "@/ikon/utils/api/loginService";
import { getAccountTree } from "@/ikon/utils/api/accountService";
import { setActiveAccountId } from "@/ikon/utils/actions/account";
import { toast } from "sonner";
const SigninFormSchema = z.object({
  userName: z.string().min(2, { message: "Please enter username." }).trim(),
  password: z.string().min(8, { message: "Please enter password." }).trim(),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const form = useForm<z.infer<typeof SigninFormSchema>>({
    resolver: zodResolver(SigninFormSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });
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
    <div className="flex justify-center">
      <div className="flex flex-col gap-6  max-w-lg text-left">
        <Card className="tremor-dialog-panel ring-1 shadow-tremor transition-all transform bg-tremor-background text-tremor-content ring-tremor-ring dark:bg-dark-tremor-background dark:text-dark-tremor-content dark:ring-dark-tremor-ring overflow-visible rounded-md p-0">
          <CardHeader className="space-y-6 pb-8">
            <div className="flex justify-center items-center text-tremor-content-strong dark:text-dark-tremor-content-strong">
              <BiShield className="h-8 w-8 text-primary" />
              SecureGuard
            </div>
            <div className="space-y-2 text-center">
              <CardTitle className="text-3xl font-semibold tracking-tight text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base">
                Please enter your credentials to access your account
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(signin)} className="flex flex-col gap-6">
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <Label htmlFor="userName" className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        User ID
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="m@example.com"
                          id="userName"
                          required
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
                    <FormItem className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password" className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          Password
                        </Label>
                        <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                          Forgot your password?
                        </a>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="************"
                          id="password"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Buttons */}
                <div className="flex flex-col-reverse lg:flex-row gap-3 justify-between items-center mb-3">
                  {/* <button
                    onClick={(e) => {
                      e.preventDefault();
                      reset();
                    }}
                    className="reset-btn"
                  >
                    Reset
                  </button> */}
                  <Button type="submit" className="w-full" variant="primary">
                    Login
                  </Button>
                </div>

                {/* Signup Link */}
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <a href="#" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
