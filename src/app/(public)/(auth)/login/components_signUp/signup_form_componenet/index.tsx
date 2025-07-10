"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "../schema_signUp";
import FormInput from "@/ikon/components/form-fields/input";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { countryMap } from "@/app/(protected)/(apps)/sales-crm/lead/country_details";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Form } from "@/shadcn/ui/form";
import { Button } from "@/shadcn/ui/button";
import { postSignupRequestFunc } from "../invoke_signUp";

export default function SignUp({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userLogin: "",
      firstName: "",
      lastName: "",
      phoneNo: "",
      email: "",
      companyName: "",
      address: "",
      state: "",
      city: "",
      zip: "",
      country: "",
    },
  });

  const formHandleSubmit: SubmitHandler<z.infer<typeof signUpSchema>> = async (
    data
  ) => {

    await signUpSchema.parseAsync(data); 
    const formattedData: Record<string, string>[] = [
      { "User Login": data.userLogin.replace(/@.*/, "").replace(/\s+/g, "_") },
      { "First Name": data.firstName },
      { "Last Name": data.lastName },
      { "Email Address": data.email },
      { "Phone Number": data.phoneNo },
      { "Company Name": data.companyName },
      { Address: data.address },
      { City: data.city },
      { State: data.state },
      { "Postal Code": data.zip },
      { Country: data.country },
    ];

    console.log(formattedData);

    await postSignupRequestFunc(formattedData);
    form.reset();
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="md:max-w-[920px] sm:max-w-[445px] sm: max-h-[100vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="mb-2">Sign Up</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(formHandleSubmit)}
              className="space-y-8"
            >
              <div className="grid sm:grid-rows-1 md:grid-cols-2 gap-2 my-0">
                <h1 className="text-lg font-bold">Contact Information</h1>
                <div className="sm:col-span-1 md:col-span-2">
                  <FormInput
                    name={"userLogin"}
                    formControl={form.control}
                    placeholder="User Login"
                    label="User Login"
                  />
                </div>

                <FormInput
                  name={"firstName"}
                  formControl={form.control}
                  placeholder="First Name"
                  label="First Name"
                />

                <FormInput
                  name={"lastName"}
                  formControl={form.control}
                  placeholder="Last Name"
                  label="Last Name"
                />

                <FormInput
                  name={"phoneNo"}
                  formControl={form.control}
                  placeholder="Phone Number"
                  label="Phone Number"
                />

                <FormInput
                  name={"email"}
                  formControl={form.control}
                  placeholder="Email"
                  label="Email"
                />
              </div>

              <div className="grid sm:grid-rows-1 md:grid-cols-2 gap-2 my-0">
                <h1 className="text-lg font-bold">Company Information</h1>
                <div className="sm:col-span-1 md:col-span-2">
                  <FormInput
                    name={"companyName"}
                    formControl={form.control}
                    placeholder="Company Name"
                    label="Company Name"
                  />
                </div>

                <div className="sm:col-span-1 md:col-span-2">
                  <FormInput
                    name={"address"}
                    formControl={form.control}
                    placeholder="Address"
                    label="Address"
                  />
                </div>

                <FormInput
                  name={"state"}
                  formControl={form.control}
                  placeholder="State"
                  label="State"
                />

                <FormInput
                  name={"city"}
                  formControl={form.control}
                  placeholder="City"
                  label="City"
                />

                <FormInput
                  name={"zip"}
                  formControl={form.control}
                  placeholder="Zip/Postal Code"
                  label="Zip/Postal Code"
                />

                <FormComboboxInput
                  items={countryMap}
                  formControl={form.control}
                  name={"country"}
                  placeholder={"Select Country"}
                  label="Select Country"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="default">
                  Sign Up
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
