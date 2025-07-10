import { postSignupRequest } from "@/ikon/utils/api/userService";

export const postSignupRequestFunc = async (signUpData: any) => {
  
  try {
    await postSignupRequest({
      userDetails: signUpData
    });

    console.log("Signup request successful");
  } catch (error) {
    console.error("Failed to sign up:", error);
    throw error;
  }
};
