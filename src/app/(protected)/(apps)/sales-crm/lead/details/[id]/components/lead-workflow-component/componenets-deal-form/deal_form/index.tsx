"use client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import { format } from "date-fns";
import { startDealToLeadData } from "../invoke_lead";
import { editLeadStatusForRejection } from "../invoke_lead_rejection";
import { dealSchema } from "../data_for_deal_form";
import FormInput from "@/ikon/components/form-fields/input";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Form } from "@/shadcn/ui/form";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { Checkbox } from "@/shadcn/ui/checkbox";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { Button } from "@/shadcn/ui/button";
import FormDateInput from "@/ikon/components/form-fields/date-input";
import { TextButton } from "@/ikon/components/buttons";
import { useRouter } from "next/navigation";
import { getProjectManagerDetails } from "@/app/(protected)/(apps)/sales-crm/components/project-manager";

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadIdentifier?: any;
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

const CreateLeadToDealModalForm: React.FC<DealModalProps> = ({
  isOpen,
  onClose,
  leadIdentifier,
}) => {
  console.log("enter CreateDealModalForm");
  const [isRevenue, setIsRevenue] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [prjMngrCome, setPrjMngrCome] = useState(false);
  const [dealNo, setDealNo] = useState("");
  const [dealsData, setDealsData] = useState<any[]>([]);
  const [accountData, setAccountData] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [projectManagerMap, setProjectManagerMap] = useState<any[]>([]); 

  useEffect(() => {
      const fetchProjectManagers = async () => {
        let managers:any = await getProjectManagerDetails();
        type ManagerDetails = {
          userId: string;
          userName: string;
          userActive: boolean;
      };
  
      const activeUsersPMGrp = Object.values(managers as Record<string, ManagerDetails>)
          .filter((managerDetails) => managerDetails.userActive)
          .map((activeManagerDetails) => ({
              value: activeManagerDetails.userId,
              label: activeManagerDetails.userName
          }));
        console.log("projectManagerMap ", activeUsersPMGrp);
        setProjectManagerMap(activeUsersPMGrp);
      };
  
      if (isOpen) {
        fetchProjectManagers();
      }
    }, [isOpen]);

  const fetchProfileData = async () => {
    try {
      const profileData = await getProfileData();
      setUserId(profileData.USER_ID);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    if (!leadIdentifier) return;
    const fetchData = async () => {
      try {
        console.log("Fetching deal instances...");
        const dealsInstanceData = await getMyInstancesV2({
          processName: "Deal",
          predefinedFilters: { taskName: "View State" },
        });
        console.log("Deals fetched:", dealsInstanceData);
        setDealsData(dealsInstanceData.map((e: any) => e.data));

        const accountInsData = await getMyInstancesV2({
          processName: "Account",
          predefinedFilters: { taskName: "View State" },
          projections: ["Data"],
        });
        console.log("Accounts fetched:", accountInsData);
        setAccountData(accountInsData.map((e: any) => e.data));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [leadIdentifier]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const productData = [
    { value: "Professional Service", label: "Professional Service" },
    { value: "User License", label: "User License" },
    { value: "Service Level Agreement", label: "Service Level Agreement" },
  ];

  console.log("Deal Data ", dealsData);
  console.log("Account Data ", accountData);

  useEffect(() => {
    const currentTime = new Date().getTime() + "";
    const generatedDealNo =
      "D" + currentTime.substring(currentTime.length - 6, currentTime.length);
    setDealNo(generatedDealNo);
  }, []);

  const handleRevenueChange = () => {
    setIsRevenue(!isRevenue);
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
      dealStartDate: "",
      productDetails: {},
      isDebtRevenue: false,
      dealIdentifier: "",
      leadIdentifier: "",
      createdBy: "",
      updatedOn: "",
      contactDetails: {},
      dealStatus: "",
    },
  });

  const getFormattedDate = (date: Date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX").replace("Z", "+0000");
  };

  const handleOnSubmit = async (data: DealFormValues) => {
    console.log("Form Data Submitted: ", data);

    const formattedData: DealFormValues = {
      ...data,
      dealIdentifier: data.dealIdentifier || v4(),
      isDebtRevenue: isRevenue,
      dealStatus: "Deal Created",
      leadIdentifier: leadIdentifier,
      updatedOn: getFormattedDate(new Date()),
      createdBy: userId,
      dealNo: dealNo,
      dealStartDate: data.dealStartDate
        ? new Date(data.dealStartDate).toISOString().split("T")[0]
        : undefined,
    };

    const productIdentifier = v4();

    const newData = {
      ...formattedData,
      productDetails: data.productDetails
        ? {
            [productIdentifier]: {
              productIdentifier,
              productType: data.productDetails.productType ?? "",
              projectManager: data.productDetails.projectManager ?? "",
              productDescription: data.productDetails.productDescription ?? "",
            },
          }
        : {},
    };

    console.log("Final form data:", newData);

    await startDealToLeadData(newData);

    form.reset({
      dealName: "",
      currency: "",
      expectedRevenue: "",
      dealStartDate: "",
      productDetails: {},
      isDebtRevenue: false,
      dealIdentifier: "",
      leadIdentifier: "",
      updatedOn: "",
      createdBy: "",
      contactDetails: {},
      dealStatus: "",
    });

    onClose();
    startTransition(() => {
      router.refresh();
    });
  };

  const handleReject = async () => {
    console.log("Rejected From Opportunity");

    await editLeadStatusForRejection(leadIdentifier);
    onClose();
  };

  const onError = (errors: any) => {
    console.error("Form Submission Errors: ", errors);
  };

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
                    label="Start Date *"
                    placeholder="Enter Start Date"
                  />
                </div>
                <div className="grid gap-1.5">
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
                <div className="grid gap-1.5 mt-2">
                  <FormComboboxInput
                    items={productData}
                    formControl={form.control}
                    name={"productDetails.productType"}
                    label="Product Name *"
                    placeholder={"Select Product"}
                    onSelect={handleProductChange}
                  />
                </div>

                <div
                  className={`grid gap-1.5 mt-2 ${
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

              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-1.5 mt-2">
                  <FormTextarea
                    name={"productDetails.productDescription"}
                    formControl={form.control}
                    label="Product Description"
                    placeholder="Enter product description here"
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
           <Button variant="destructive" onClick={handleReject} className="ml-2">
            Reject
          </Button> 
          {/* <TextButton variant="destructive" onClick={handleReject}>Reject</TextButton> */}
          <Button type="submit" form="deal-form">
            Create
          </Button>
          {/* <TextButton type="submit">Create</TextButton> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadToDealModalForm;
