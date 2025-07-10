"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getMyProfileData } from "../../../_utils/profile/get-profile-data";
import { TextButton } from "@/ikon/components/buttons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shadcn/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/shadcn/ui/sidebar";

import BuyerProfile from "./BuyerProfile";
import SupplierProfile from "./SupplierProfile";
import SupplierRegistrationModal from "./supplier-register-modal";
import BuyerRegistrationModal from "./buyer-register-modal";
import { Package, User, UserRoundPen, UserRoundPlus } from "lucide-react";

const TenderProfilePage = ({ currAccountId }: { currAccountId: string }) => {
  const [accountId, setaccountId] = useState(currAccountId);
  const [profileData, setProfileData] = useState<any>(null);
  const [buyerModal, setbuyerModal] = useState(false);
  const [supplierModal, setsupplierModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await getMyProfileData(accountId);
        setProfileData(data);
      } catch (error) {
        toast.error("Error in fetching data");
      }
    };
    fetchData();
  }, []);
  const buyerData = {
    category: "Buyer Details",
    items: [
      { name: "Basic Information" },
      { name: "Contact Details" },
      { name: "Procurement Information" },
      { name: "Documents" },
    ],
  };

  const supplierData = {
    category: "Supplier Details",
    items: [
      { name: "Supplier Info and Contacts" },
      { name: "Capabilities and Experience" },
      { name: "Finance and Legal" },
      { name: "QA and Bid Submission" },
      { name: "Additional Information" },
      { name: "Declaration" },
    ],
  };

  return (
    <>
      <Tabs defaultValue="buyer">
        <TabsList variant="solid">
          <TabsTrigger value="buyer">
            {" "}
            <User className="pe-2" />
            Buyer Details
          </TabsTrigger>
          <TabsTrigger value="supplier">
            <Package className="pe-2" />
            Supplier Details
          </TabsTrigger>
        </TabsList>
        <TextButton
          className="float-end"
          onClick={() => setsupplierModal((prev) => !prev)}
        >
          {profileData?.supplierDetails ? (
            <span className="flex items-center">
              <UserRoundPen className="me-2" />
              Edit supplier Profile
            </span>
          ) : (
            <span>
              <UserRoundPlus className="me-2" /> Set supplier Profile
            </span>
          )}{" "}
        </TextButton>
        <TextButton
          className="float-end  mx-2"
          onClick={() => setbuyerModal((prev) => !prev)}
        >
          {profileData?.buyerDetails ? (
            <span className="flex items-center">
              <UserRoundPen className="me-2" />
              Edit Buyer Profile
            </span>
          ) : (
            <span>
              <UserRoundPlus className="me-2" /> Set Buyer Profile
            </span>
          )}{" "}
        </TextButton>

        <div className="mt-4">
          <TabsContent
            value="buyer"
            className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
          >
            <BuyerProfile
              buyerDetails={
                profileData && profileData.buyerDetails
                  ? profileData.buyerDetails
                  : null
              }
            />
          </TabsContent>
          <TabsContent
            value="supplier"
            className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
          >
            <SupplierProfile
              supplierDetails={
                profileData && profileData.supplierDetails
                  ? profileData.supplierDetails
                  : null
              }
            />
          </TabsContent>
        </div>
      </Tabs>
      {supplierModal && (
        <SupplierRegistrationModal
          isOpen={supplierModal}
          onClose={() => setsupplierModal(false)}
          accountId={accountId}
        />
      )}
      {buyerModal && (
        <BuyerRegistrationModal
          isOpen={buyerModal}
          onClose={() => setbuyerModal(false)}
          accountId={accountId}
        />
      )}
    </>
    // <>
    //   <Accordion type="single" collapsible>
    //     <AccordionItem value="buyer-details">
    //       <AccordionTrigger className="flex justify-between items-center w-full">
    //         <span>Buyer Details</span>
    //         <TextButton onClick={() => setbuyerModal((prev) => !prev)}>
    //           {profileData?.buyerDetails ? "Edit" : "Create"}
    //         </TextButton>
    //       </AccordionTrigger>
    //       <AccordionContent>
    //         <BuyerProfile
    //           buyerDetails={
    //             profileData && profileData.buyerDetails
    //               ? profileData.buyerDetails
    //               : null
    //           }
    //         />
    //       </AccordionContent>
    //     </AccordionItem>
    //     <AccordionItem value="supplier-details">
    //       <AccordionTrigger>
    //         Supplier Details
    //         <TextButton onClick={() => setsupplierModal((prev) => !prev)}>
    //           {profileData?.supplierDetails ? "Edit" : "Create"}
    //         </TextButton>
    //       </AccordionTrigger>
    //       <AccordionContent>
    //         <SupplierProfile
    //           supplierDetails={
    //             profileData && profileData.supplierDetails
    //               ? profileData.supplierDetails
    //               : null
    //           }
    //         />
    //       </AccordionContent>
    //     </AccordionItem>
    //   </Accordion>

    //   {supplierModal && (
    //     <SupplierRegistrationModal
    //       isOpen={supplierModal}
    //       onClose={() => setsupplierModal(false)}
    //       accountId={accountId}
    //     />
    //   )}

    //   {buyerModal && (
    //     <BuyerRegistrationModal
    //       isOpen={buyerModal}
    //       onClose={() => setbuyerModal(false)}
    //       accountId={accountId}
    //     />
    //   )}
    // </>
  );
};

export default TenderProfilePage;
