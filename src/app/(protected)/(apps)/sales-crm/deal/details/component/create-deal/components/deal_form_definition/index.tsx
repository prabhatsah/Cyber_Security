"use client";
import { Checkbox } from "@/shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Form } from "@/shadcn/ui/form";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import CreateDealDataTable from "./CreateDealDataTable";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import { startDealData } from "../invoke_deal";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { format } from "date-fns";
import { dealSchema } from "../deal_form_schema";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormInput from "@/ikon/components/form-fields/input";
import FormDateInput from "@/ikon/components/form-fields/date-input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { TextButton } from "@/ikon/components/buttons";
import { getAccountManagerDetails } from "@/app/(protected)/(apps)/sales-crm/components/account-manager";
import { getProjectManagerDetails } from "@/app/(protected)/(apps)/sales-crm/components/project-manager";
import { useRouter } from "next/navigation";

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealsData?: any | undefined;
  accountData?: any | undefined;
  productData?: any | undefined;
}
interface Account {
  accountIdentifier: string;
  accountName: string;
  accountManager: string;
  accountCode: string;
}

interface NewProductDetails {
  [key: string]: {
    productIdentifier: string;
    productType: string;
    projectManager: string;
    productDescription: string;
  };
}
type DealFormValues = z.infer<typeof dealSchema>;

const CreateDealModalForm: React.FC<DealModalProps> = ({
  isOpen,
  onClose,
  dealsData,
  accountData,
  productData,
}) => {
  const removeDuplicates = (data: any[], key: string) => {
    const seen = new Set();
    return data.filter((item) => {
      const uniqueValue = item[key];
      if (seen.has(uniqueValue)) {
        return false;
      }
      seen.add(uniqueValue);
      return true;
    });
  };

  const [isNewDeal, setIsNewDeal] = useState(true);
  const [isCopyDeal, setIsCopyDeal] = useState(false);
  const [isRevenue, setIsRevenue] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [prjMngrCome, setPrjMngrCome] = useState(false);
  const [dealNo, setDealNo] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<any>([]);
  const [selectedDealDT, setSelectedDealDT] = useState(false);
  const [selectedAccMngr, setSelectedAccMngr] = useState("");
  const [userId, setUserId] = useState("");
  const [accountManagerMap, setAccountManagerMap] = useState<
    Record<string, string>
  >({});
  const [projectManagerMap, setProjectManagerMap] = useState<any[]>([]);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchAccountManagers = async () => {
      let managers: any = await getAccountManagerDetails();
      type ManagerDetails = {
        userId: string;
        userName: string;
        userActive: boolean;
      };

      const accountManagerMap: Record<string, string> = {};

      Object.values(managers as Record<string, ManagerDetails>)
        .filter((managerDetails) => managerDetails.userActive)
        .forEach((activeManagerDetails) => {
          accountManagerMap[activeManagerDetails.userId] =
            activeManagerDetails.userName;
        });
      console.log("accountManagerMap ", accountManagerMap);
      setAccountManagerMap(accountManagerMap);

      let prjManagers: any = await getProjectManagerDetails();

      const activeUsersPMGrp = Object.values(
        prjManagers as Record<string, ManagerDetails>
      )
        .filter((managerDetails) => managerDetails.userActive)
        .map((activeManagerDetails) => ({
          value: activeManagerDetails.userId,
          label: activeManagerDetails.userName,
        }));
      console.log("projectManagerMap ", activeUsersPMGrp);
      setProjectManagerMap(activeUsersPMGrp);
    };

    if (accountData) {
      fetchAccountManagers();
    }
  }, [accountData]);

  useEffect(() => {
    if (selectedDeal) {
      form.reset({
        dealName: selectedDeal.dealName || "",
        currency: selectedDeal.currency || "",
        expectedRevenue: selectedDeal.expectedRevenue || 0,
        dealStartDate: selectedDeal.dealStartDate || "",
        accountDetails: {
          accountIdentifier:
            selectedDeal?.accountDetails?.accountIdentifier || "",
          accountName: selectedDeal.accountDetails?.accountName || "",
          accountManager:
            accountManagerMap[selectedDeal.accountDetails?.accountManager] ||
            "",
          accountCode: selectedDeal.accountDetails?.accountCode || "",
        },
        productDetails: selectedDeal.productDetails || {},
        isDebtRevenue: selectedDeal.isDebtRevenue || false,
        copyDealCheck: selectedDeal.copyDealCheck || false,
        dealIdentifier: selectedDeal.dealIdentifier || "",
        olddealIdentifier: selectedDeal.olddealIdentifier || "",
        contactDetails: selectedDeal.contactDetails || {},
        dealStatus: "",
      });
    }
  }, [selectedDeal]);

  dealsData = removeDuplicates(dealsData, "dealIdentifier");

  console.log("Deal Data ", dealsData);
  const formattedDeals = dealsData.map(
    (deal: { dealIdentifier: any; dealName: any }) => ({
      value: deal.dealIdentifier,
      label: deal.dealName,
    })
  );

  console.log(formattedDeals);

  console.log("Account Data ", accountData);

  const removeDuplicateAccounts = (accounts: any[]) => {
    const uniqueAccountsMap = new Map<string, any>();

    accounts.forEach((account) => {
      const existingAccount = uniqueAccountsMap.get(account.accountIdentifier);

      if (
        !existingAccount ||
        new Date(account.updatedOn) > new Date(existingAccount.updatedOn)
      ) {
        uniqueAccountsMap.set(account.accountIdentifier, account);
      }
    });

    return Array.from(uniqueAccountsMap.values());
  };

  const uniqueAccountData = removeDuplicateAccounts(accountData);

  const formattedAccount = uniqueAccountData.map(
    (account: { accountIdentifier: string; accountName: string }) => ({
      value: account.accountIdentifier,
      label: account.accountName,
    })
  );

  const valueToLabelMapAccountData: Record<string, string> = {};

  uniqueAccountData.forEach(
    (account: { accountIdentifier: string; accountName: string }) => {
      valueToLabelMapAccountData[account.accountIdentifier] = account.accountName;
    }
  );

 
  console.log("Product Data ", productData);
  const formattedProduct = productData.map(
    (product: {
      productName: any;
      productIdentifier: any;
      accountIdentifier: any;
      accountName: any;
    }) => ({
      value: product?.productIdentifier,
      label: product?.productName,
    })
  );

  productData = [
    { value: "Professional Service", label: "Professional Service" },
    { value: "User License", label: "User License" },
    { value: "Service Level Agreement", label: "Service Level Agreement" },
    ...formattedProduct,
  ];

  useEffect(() => {
    const currentTime = new Date().getTime() + "";
    const generatedDealNo =
      "D" + currentTime.substring(currentTime.length - 6, currentTime.length);
    setDealNo(generatedDealNo);
  }, []);

  const handleNewDealChange = () => {
    setIsNewDeal(!isNewDeal);
    setSelectedDealDT(false);

    if (!isNewDeal) {
      setIsCopyDeal(false);

      setSelectedAccount(null);
      setSelectedProduct("");
      setPrjMngrCome(false);
      setSelectedDeal({});
      setIsRevenue(false);
    }
  };

  const handleCopyDealChange = () => {
    setIsCopyDeal(!isCopyDeal);
    if (selectedDeal.length > 0) {
      setSelectedDealDT(true);
    }
    if (!isCopyDeal) {
      setIsNewDeal(false);

      setSelectedAccount(null);
      setSelectedProduct("");
      setPrjMngrCome(false);
      setSelectedDeal({});
      setIsRevenue(false);
    }
  };

  const handleRevenueChange = () => {
    setIsRevenue(!isRevenue);
  };

  const handleDealSelection = (selectedIdentifier: string) => {
    setSelectedDealDT(true);
    const selectedDeal = dealsData.find(
      (deal: { dealIdentifier: string }) =>
        deal.dealIdentifier === selectedIdentifier
    );
    setSelectedDeal(selectedDeal || null);
  };

  const handleAccountChange = (accountIdentifier: string | string[]) => {
    const account = accountData.find(
      (acc: { accountIdentifier: string }) =>
        acc.accountIdentifier === accountIdentifier
    );
    setSelectedAccount(account || null);
  };

  const handleProductChange = (value: any) => {
    setSelectedProduct(value);
    if (value == "Professional Service") {
      setPrjMngrCome(true);
    } else {
      setPrjMngrCome(false);
    }
  };

  const form = useForm<z.infer<typeof dealSchema>>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      dealName: "",
      currency: "",
      expectedRevenue: "",
      dealStartDate: new Date(),
      accountDetails: {
        accountName: "",
        accountManager: "",
        accountCode: "",
        accountIdentifier: "",
      },
      productDetails: {},
      isDebtRevenue: false,
      copyDealCheck: false,
      dealIdentifier: "",
      olddealIdentifier: "",
      contactDetails: {},
      dealStatus: "",
    },
  });

  const fetchProfileData = async () => {
    try {
      const profileData = await getProfileData();
      setUserId(profileData.USER_ID);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleOnSubmit = async (data: z.infer<typeof dealSchema>) => {
    console.log("Form Data Submitted: ", data);

    console.log("Account Data of map ", valueToLabelMapAccountData);

    if (data.dealIdentifier == "") {
      data.dealIdentifier = v4();
    }
    data.isDebtRevenue = isRevenue;
    data.dealStatus = "Deal Created";

    interface NewData extends Omit<DealFormValues, "productDetails"> {
      productDetails: NewProductDetails;
    }
    if (isNewDeal) {
      data.accountDetails = {
        ...data.accountDetails,
        accountCode:
          selectedAccount?.accountCode ||
          selectedDeal?.accountDetails?.accountCode,
        accountIdentifier:
          selectedAccount?.accountIdentifier ||
          selectedDeal?.accountDetails?.accountIdentifier,
        accountName:
        valueToLabelMapAccountData[data?.accountDetails?.accountName] ||
        valueToLabelMapAccountData[selectedDeal?.accountDetails?.accountName],
        accountManager:
          selectedAccount?.accountManager ||
          selectedDeal?.accountDetails?.accountManager,
      };

      data.dealNo = dealNo;

      const formattedDate = format(data.dealStartDate, "yyyy-MM-dd");
      console.log(formattedDate);

      data.updatedOn = new Date().toISOString();
      data.createdBy = userId;

      const productIdentifier = v4();

      const newData = {
        ...data,
        dealStartDate: formattedDate,
        productDetails: {
          [productIdentifier]: {
            productIdentifier: productIdentifier,
            productType: data.productDetails?.productType,
            projectManager: data.productDetails?.projectManager,
            productDescription: data.productDetails?.productDescription,
          },
        },
      };
      console.log("Final form data:", newData);

      await startDealData(newData);
    }

    if (isCopyDeal) {
      data.productDetails = selectedDeal?.productDetails || {};
      data.dealNo = selectedDeal.dealNo;

      const formattedDate = format(data.dealStartDate, "yyyy-MM-dd");
      console.log(formattedDate);

      const newData = {
        ...data,
        dealStartDate: formattedDate,
        productDetails: selectedDeal?.productDetails,
      };
      console.log("Final form data:", newData);

      await startDealData(newData);
    }

    form.reset({
      dealName: selectedDeal?.dealName || "",
      currency: selectedDeal?.currency || "",
      expectedRevenue: selectedDeal?.expectedRevenue || 0,
      dealStartDate:
        (selectedDeal?.dealStartDate && new Date(selectedDeal.dealStartDate)) ||
        new Date(),
      accountDetails: {
        accountIdentifier:
          selectedDeal?.accountDetails?.accountIdentifier || "",
        accountName: selectedDeal?.accountDetails?.accountName || "",
        accountManager: selectedDeal?.accountDetails?.accountManager || "",
        accountCode: selectedDeal?.accountDetails?.accountCode || "",
      },
      productDetails: selectedDeal?.productDetails || {},
      isDebtRevenue: selectedDeal?.isDebtRevenue || false,
      copyDealCheck: selectedDeal?.copyDealCheck || false,
      dealIdentifier: selectedDeal?.dealIdentifier || "",
      olddealIdentifier: selectedDeal?.olddealIdentifier || "",
      contactDetails: selectedDeal?.contactDetails || {},
      dealStatus: "",
    });

    onClose();
    startTransition(() => {
      router.refresh();
    });
  };

  const onError = (errors: any) => {
    console.error("Form Submission Errors: ", errors);
  };

  // console.log("Selected Deal ", selectedDeal);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Add Deal</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit, onError)}
              id="deal-form"
            >
              <div className="grid grid-cols-3 gap-4" id="deal_checkbox">
                <div className="grid gap-1.5">
                  <div className="flex items-center">
                    <Checkbox
                      id="newDeal"
                      checked={isNewDeal}
                      onCheckedChange={handleNewDealChange}
                    />
                    <label
                      htmlFor="newDeal"
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      New Deal
                    </label>
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <div className="flex items-center">
                    <Checkbox
                      id="copyDeal"
                      checked={isCopyDeal}
                      onCheckedChange={handleCopyDealChange}
                    />
                    <label
                      htmlFor="copyDeal"
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Copy From Previous Deal
                    </label>
                  </div>
                </div>

                <div
                  className={`grid gap-1.5 ${isCopyDeal ? "block" : "hidden"}`}
                  id="copyDealId"
                >
                  <div className="grid gap-1.5">
                    <div className="mt-4">
                      <FormComboboxInput
                        items={formattedDeals}
                        formControl={form.control}
                        name={"dealName"}
                        placeholder={"Copy from Deal"}
                        onSelect={handleDealSelection}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 ">
                <div className="grid gap-1.5 mt-2">
                  <FormInput
                    formControl={form.control}
                    name={"dealNo"}
                    label="Deal No *"
                    value={dealNo}
                    readOnly
                  />
                </div>

                <div className="grid gap-1.5 mt-2">
                  <FormInput
                    formControl={form.control}
                    name={"dealName"}
                    label="Deal Name *"
                    placeholder="Enter Deal Name"
                  />
                </div>

                <div className="grid gap-1.5 mt-2">
                  <FormComboboxInput
                    items={[
                      {
                        value: "USD",
                        label: "USD",
                      },
                      {
                        value: "GBP",
                        label: "GBP",
                      },
                      {
                        value: "INR",
                        label: "INR",
                      },
                      {
                        value: "QAR",
                        label: "QAR",
                      },
                      {
                        value: "SAR",
                        label: "SAR",
                      },
                      {
                        value: "AED",
                        label: "AED",
                      },
                    ]}
                    formControl={form.control}
                    name={"currency"}
                    label="Currency *"
                    placeholder={"Choose Currency"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 ">
                <div className="grid gap-1.5 mt-2">
                  <FormInput
                    formControl={form.control}
                    name={"expectedRevenue"}
                    label="Expected Revenue *"
                    placeholder="Enter Expected Revenue"
                  />
                </div>

                <div className="grid gap-1.5 mt-2">
                  <FormDateInput
                    formControl={form.control}
                    name={"dealStartDate"}
                    label="Expected Closing Date *"
                    placeholder="Please Enter Date"
                  />
                </div>

                <div className="grid gap-1.5 mt-4">
                  <div className="flex items-center">
                    <Checkbox
                      id="revenue"
                      checked={isRevenue}
                      onCheckedChange={handleRevenueChange}
                    />
                    <label
                      htmlFor="revenue"
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Revenue in Debt
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5 mt-4">
                  <FormComboboxInput
                    items={formattedAccount}
                    formControl={form.control}
                    name={"accountDetails.accountName"}
                    placeholder={"Select Account"}
                    label="Account Name *"
                    onSelect={(value) => handleAccountChange(value)}
                  />
                </div>

                <div className="grid gap-1.5 mt-4">
                  <FormComboboxInput
                    items={[
                      {
                        value: selectedAccount?.accountManager,
                        label:
                          accountManagerMap[selectedAccount?.accountManager],
                      },
                    ]}
                    formControl={form.control}
                    name={"accountDetails.accountManager"}
                    placeholder={"Select Account"}
                    label="Account Manager *"
                    value={"selectedAccount?.accountManager"}
                  />
                </div>
              </div>

              <div
                className={`grid grid-cols-2 gap-4 ${
                  selectedDealDT ? "hidden" : "block"
                }`}
              >
                <div className="grid gap-1.5 mt-4">
                  <FormComboboxInput
                    items={productData}
                    formControl={form.control}
                    name={"productDetails.productType"}
                    label="Product Name *"
                    placeholder={"Select Product"}
                    onSelect={(value) => handleProductChange(value)}
                  />
                </div>

                <div
                  className={`grid gap-1.5 mt-4 ${
                    prjMngrCome ? "block" : "hidden"
                  }`}
                >
                  <FormComboboxInput
                    items={projectManagerMap}
                    formControl={form.control}
                    name={"productDetails.projectManager"}
                    label="Project Manager *"
                    placeholder={"Select Project Manager"}
                  />
                </div>
              </div>

              <div
                className={`grid grid-cols-1 gap-4 ${
                  selectedDealDT ? "hidden" : "block"
                }`}
              >
                <div className="grid gap-1.5 mt-2">
                  <FormTextarea
                    name={"productDetails.productDescription"}
                    formControl={form.control}
                    placeholder="Enter product description here"
                    label="Product Description"
                  />
                </div>
              </div>

              <div
                className={`grid grid-cols-1 gap-4 mt-4  ${
                  selectedDealDT ? "block" : "hidden"
                }`}
              >
                <CreateDealDataTable selectedDeal={[selectedDeal]} />
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          {/* <Button type="submit" form="deal-form">
            Submit
          </Button> */}
          <TextButton type="submit" form="deal-form">
            Submit
          </TextButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDealModalForm;
