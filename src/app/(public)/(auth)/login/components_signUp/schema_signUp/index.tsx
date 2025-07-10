// import { checkExistingAccount } from "@/ikon/utils/api/accountService";
// import { z } from "zod";

// export const signUpSchema = z.object({
//     userLogin: z.string().min(1, "Please Enter a Valid UserLogin"),
//     firstName: z.string().min(1, "Please Enter Your First Name"),
//     lastName: z.string().min(1, "Please Enter Your Last Name"),
//     phoneNo: z.string().min(1, "Please Enter a Valid Phone Number").min(10,"Please Enter a Valid Phone Number"),
//     email: z.string().min(1, "Please Enter Your Email").email("Please Enter a Valid Email"),
//     companyName: z.string().min(1, "Please Enter Your Company Name"),
//     address: z.string().min(1, "Please Enter a Valid Address"),
//     state: z.string().min(1, "Please Enter your State Name"),
//     city: z.string().min(1, "Please Enter your City Name"),
//     zip: z.string().min(1, "Please Enter a Zip"),
//     country: z.string().min(1, "Please Enter your country Name")
//   }).;

//   export const validateCompanyName = async (companyName: string) => {
//     const exists = await checkExistingAccount({
//       accountName : companyName
//     })
//     if (exists) {
//       throw new Error("Company Name already exists. Please choose a different name.");
//     }
//   };

import { checkExistingAccount } from "@/ikon/utils/api/accountService";
import { checkExistingUser } from "@/ikon/utils/api/userService";
import { z } from "zod";

export const signUpSchema = z
  .object({
    userLogin: z.string().min(1, "Please Enter a Valid UserLogin"),
    firstName: z.string().min(1, "Please Enter Your First Name"),
    lastName: z.string().min(1, "Please Enter Your Last Name"),
    phoneNo: z
      .string()
      .min(1, "Please Enter a Valid Phone Number")
      .min(10, "Please Enter a Valid Phone Number"),
    email: z
      .string()
      .min(1, "Please Enter Your Email")
      .email("Please Enter a Valid Email"),
    companyName: z.string().min(1, "Please Enter Your Company Name"),
    address: z.string().min(1, "Please Enter a Valid Address"),
    state: z.string().min(1, "Please Enter your State Name"),
    city: z.string().min(1, "Please Enter your City Name"),
    zip: z.string().min(1, "Please Enter a Zip"),
    country: z.string().min(1, "Please Enter your Country Name"),
  })
  .superRefine(async (data, ctx) => {
    const accountExists = await checkExistingAccount({
      accountName: data.companyName,
    });
    if (accountExists) {
      ctx.addIssue({
        code: "custom",
        message: "Company Name already exists. Please choose a different name.",
        path: ["companyName"],
      });
    }

    const userExists = await checkExistingUser({
      userLogin: data.userLogin,
    });
    if (userExists) {
      ctx.addIssue({
        code: "custom",
        message: "User Login already exists. Please choose a different username.",
        path: ["userLogin"],
      });
    }
  });

