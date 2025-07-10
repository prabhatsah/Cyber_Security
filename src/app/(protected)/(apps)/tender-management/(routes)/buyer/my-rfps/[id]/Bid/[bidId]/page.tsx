"use client";

import { useState, useEffect, useRef } from "react";
import TenderColaborationSection from "@/app/(protected)/(apps)/tender-management/_components/buyer/my-rfps/tender-flow-components/tender-colaboration";
import TenderDetails from "@/app/(protected)/(apps)/tender-management/_components/buyer/my-rfps/tender-flow-components/tender-details";
import TenderWorkflow from "@/app/(protected)/(apps)/tender-management/_components/buyer/my-rfps/tender-flow-components/tender-workflow";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";

import { Button } from "@/shadcn/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { toast } from "sonner";
import { getMyProfileData } from "@/app/(protected)/(apps)/tender-management/_utils/profile/get-profile-data";
import SupplierProfile from "@/app/(protected)/(apps)/tender-management/_components/profile/profile-page/SupplierProfile";
import ReadOnlyEditor from "@/app/(protected)/(apps)/tender-management/_components/read-only-text-editor";
import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { CheckCheck } from "lucide-react";
import { getPublishedDraftById } from "@/app/(protected)/(apps)/tender-management/_utils/supplier/get-published-draft-data";

export default function BidPage({
  params,
}: {
  params: Promise<{ bidId: string }>;
}) {
  const [bidId, setBidId] = useState<string | null>(null);
  const [tenderDetails, setTenderDetails] = useState<any>(null);
  const [tenderId, setTenderId] = useState(null);
  const [draftDetails, setDraftDetails] = useState(null)
  const [bidData, setBidData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const ref = useRef<any>(null);

  // Unwrap the params Promise
  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params;
      setBidId(resolvedParams?.bidId || "");
    }
    fetchParams();
  }, [params]);

  useEffect(() => {
    async function fetchData() {
      if (!bidId) return;

      const response = await getMyInstancesV2({
        processName: "Tender Management",
        predefinedFilters: { taskName: "View Tender" },
        processVariableFilters: { bidId },
      });

      if (response.length > 0) {
        const bidInfo : any= response[0].data;
        console.log("bidInfo------------", bidInfo);
        setBidData(bidInfo);
        setTenderId(bidInfo.tenderId);

        const draftDetails = await getPublishedDraftById(bidInfo.tenderId);
        console.log("draftDetails", draftDetails);
        setDraftDetails(draftDetails);

        // const responseData: any = await getMyInstancesV2({
        //   processName: "Tender Management",
        //   predefinedFilters: { taskName: "View Tender" },
        //   processVariableFilters: {
        //     tenderId: (bidInfo as any).tenderId,
        //     accountId: (bidInfo as any).accountId,
        //   },
        // });

        // console.log("responseData------------", responseData);
        // if (responseData.length > 0) {


        //   setTenderDetails(responseData[0].data);
        // }

        try {
          const data: any = await getMyProfileData((bidInfo as any).accountId);
          setProfileData(data);
        } catch (error) {
          toast.error("Error in fetching data");
        }
      }
    }

    fetchData();
  }, [bidId]);

  // useEffect(() => {
  //   const fetchData =async () => {
  //     console.log('tenderId', tenderId)
      
  //   }
  
  //   fetchData()
    
  // }, [bidId])
  

  console.log("profiledata--------->", profileData);
  async function bidShortList() {
    if (!bidId) return;

    console.log("Shortlist");

    const softwareId = await getSoftwareIdByNameVersion(
      "Tender Management",
      "1"
    );
    const response = await getMyInstancesV2({
      processName: "Tender Management",
      predefinedFilters: { taskName: "Bidding Started" },
      processVariableFilters: { bidId },
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const taskData: any = response[0].data;
      const tenderFlow = {
        "Awarded Tender": "PENDING",
        "Contract Finalisation": "PENDING",
        "Supplier Negotiation": "IN PROGRESS",
        "Supplier Shortlisted": "COMPLETED",
      };

      await invokeAction({
        taskId: taskId,
        transitionName: "Go to Bid Shortlisting & Negotiations",
        data: {
          ...taskData,
          bidStatus: "shortlisted",
          tenderFlow: tenderFlow,
        },
        processInstanceIdentifierField: "bidId,tenderId",
        softwareId: softwareId,
      });
      toast.success("Shortlisted");
    }
  }

  if (!bidData) {
    return <p>Loading...</p>;
  }
  

  if (bidData.bidStatus == "shortlisted") {
    return (
      <>
        <div className="grid grid-cols-3 gap-4 h-full">
          <div className="col-span-1 h-full">
            <div className="flex justify-between flex-col items-center gap-4 h-full">
              <TenderDetails bidData={bidData} />
              {/* <Workflow
                      draftDetails={
                        draftDetails
                      } 
                    /> */}
              <TenderWorkflow bidData={bidData} />
            </div>
          </div>
          <div className="col-span-2">
            {/* <DraftView draftDetails={draftDetails} /> */}
            <TenderColaborationSection
              draftDetails={draftDetails}
              bidDetails={bidData}
            />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {/* Button above Tabs */}
        <div className="flex justify-end mb-4">
          {/* <Button
            onClick={bidShortList}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Shortlist Bid
          </Button> */}
          <IconTextButtonWithTooltip
            onClick={bidShortList}
            tooltipContent="Shortlist Bid"
          >
            <CheckCheck />
            Shortlist Bid
          </IconTextButtonWithTooltip>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="" variant="solid">
            <TabsTrigger value="tender">Tender Response</TabsTrigger>
            <TabsTrigger value="supplier">Supplier Details</TabsTrigger>
          </TabsList>

          <TabsContent value="tender">
            <ReadOnlyEditor
              value={bidData?.responseDraftContent || "No response available"}
              height={640}
              onChange={() => {}}
              ref={ref}
            />
          </TabsContent>

          <TabsContent value="supplier">
            <SupplierProfile
              supplierDetails={
                profileData && profileData.supplierDetails
                  ? profileData.supplierDetails
                  : null
              }
            />
          </TabsContent>
        </Tabs>
      </>
    );
  }
}
