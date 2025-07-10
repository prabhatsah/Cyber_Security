import { invokeAction } from "@/ikon/utils/api/processRuntimeService";

interface BankDetailsInstanceData {
    bankDetails: Record<
      string,
      {
        Bank_Name: string;
        Branch_Name: string;
        Account_Name: string;
        AED_Number: string;
        IBAN_Code: string;
        Account_Nickname: string;
        //Default_Bank: boolean;
      }
    >;
  }

export async function invokeBankDetails(data: BankDetailsInstanceData, taskId: any) {     
  try {
    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Update in Edit Bank Details",
      data: data,
      processInstanceIdentifierField: "",
    });
    console.log(result)
} catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
