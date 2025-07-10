import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { Pencil } from "lucide-react";
import moment from "moment";
import Link from "next/link";

export default function Details({ draftDetails }: { draftDetails: any }) {
  console.log("draftDetails", draftDetails.id);
  const momentObj = moment(draftDetails?.submissionDeadline);
  const isAfter = momentObj.isAfter(moment(), "day");
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between">
              <span>Details</span>
              {/* <IconButtonWithTooltip tooltipContent="Edit">
                <Link
                  href={{
                    pathname: "/tender-management/buyer/Tender",
                    query: { draftId: draftDetails.id },
                  }}
                  passHref
                >
                  <Pencil />
                </Link>
              </IconButtonWithTooltip> */}
              {!isAfter && (
                <>
                  <Badge variant="destructive">
                    Submission Deadline Crossed
                  </Badge>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            <div className="flex flex-col gap-4">
              <div>
                <span>Tender Name :</span>
                <span>&nbsp;{draftDetails?.title}</span>
              </div>
              <div>
                <span>Industry :</span>
                <span>
                  &nbsp;{draftDetails.tender_department ? draftDetails.tender_department : "N/A"}
                </span>
              </div>
              <div>
                <span>Budget :</span>
                <span>
                  &nbsp;{draftDetails.budget ? draftDetails.budget : "N/A"}
                </span>
              </div>
              <div>
                <span>Submission Deadline :</span>
                <span>
                  &nbsp;
                  {draftDetails.submissionDeadline
                    ? draftDetails.submissionDeadline
                    : "N/A"}
                </span>
              </div>
              <div>
                <span>Reference No :</span>
                <span>
                  &nbsp;
                  {draftDetails.referenceNumber
                    ? draftDetails.referenceNumber
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardDescription>
        </CardContent>
      </Card>
    </>
  );
}
