import { getPublishedDraftById } from "@/app/(protected)/(apps)/tender-management/_utils/supplier/get-published-draft-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TenderDetails({bidData} : {bidData : any}) {
  // const tenderData = {
  //   tenderName: "RFP for IT Infrastructure",
  //   industry: "IT",
  //   budget: "$100,000",
  //   timeline: "6 months",
  //   additionalInfo: "Looking for a comprehensive IT infrastructure solution.",
  // };

  const [tenderId, setTenderId] = useState(bidData.tenderId);
  const [tenderData, setTenderData] = useState<any>({});

  useEffect(() =>{
    try {
      const fetchData = async () => {
        const response = await getPublishedDraftById(tenderId);
        setTenderData(response);
      }
      fetchData()
    }catch(error){
      toast.error('Failed to fetch data');
    }
  }, [])
  

  console.log("tenderData", tenderData);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <div className="flex flex-col gap-4">
            <div>
              <span>Draft Name :</span>
              <span>&nbsp;{tenderData?.title}</span>
            </div>
            <div>
              <span>Industry :</span>
              <span>
                &nbsp;{tenderData.industry ? tenderData.industry : "N/A"}
              </span>
            </div>
            <div>
              <span>Budget :</span>
              <span>
                &nbsp;{tenderData.budget ? tenderData.budget : "N/A"}
              </span>
            </div>
            <div>
              <span>Submission Deadline :</span>
              <span>
                &nbsp;
                {tenderData.submissionDeadline
                  ? tenderData.submissionDeadline
                  : "N/A"}
              </span>
            </div>
            <div>
              <span>Reference No :</span>
              <span>
                &nbsp;
                {tenderData.referenceNumber
                  ? tenderData.referenceNumber
                  : "N/A"}
              </span>
            </div>
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
