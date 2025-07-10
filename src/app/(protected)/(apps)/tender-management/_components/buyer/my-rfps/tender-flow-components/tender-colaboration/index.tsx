"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shadcn/ui/sheet";
import { MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import ReadOnlyEditor from "../../../../read-only-text-editor";
import { useRef } from "react";
import TenderDetailsComponent from "../../../../general/tender-details";
import CollaborationSection from "../../../../supplier/collaboration-section";

export default function TenderColaborationSection({ bidDetails, draftDetails } : { bidDetails: any; draftDetails: any }) {
  console.log("Bid Details", bidDetails);
  console.log("Draft Details", draftDetails);
  const ref = useRef<any>(null);
  return (
    <>
      {/* <Card className="w-full h-full">
          <CardHeader>
            <CardTitle className="flex justify-between">
              Collaboration
              <Sheet>
                <SheetTrigger>
                  <MessageCircle />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Comments</SheetTitle>
                    <SheetDescription></SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <CardDescription>
              <div className="">
                <h5>Draft Details will shown here</h5>
              </div>
            </CardDescription>
          </CardContent>
        </Card> */}

      <Tabs defaultValue="my-response">
        <TabsList variant="solid">
          <TabsTrigger value="my-response">Supplier Response</TabsTrigger>
          <TabsTrigger value="tender-documents">Tender documents</TabsTrigger>
          <TabsTrigger value="tender-details">Tender Details</TabsTrigger>
        </TabsList>
         {/* <Sheet>
          <SheetTrigger>
            <MessageCircle />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Comments</SheetTitle>
              <SheetDescription>
                <CollaborationSection
                  draftId={bidDetails.id}
                  supplierId={bidDetails.supplierId}
                />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>  */}
        <div className="">
          <TabsContent
            value="my-response"
            className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
          >
            <ReadOnlyEditor
              value={
                bidDetails && bidDetails.responseDraftContent
                  ? bidDetails.responseDraftContent
                  : ""
              }
              height={720}
              onChange={() => {}}
              ref={ref}
            />
          </TabsContent>
          <TabsContent
            value="tender-documents"
            className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
          >
            <ReadOnlyEditor
              value={
                draftDetails?.draftContent ? draftDetails.draftContent : "No Data"
              }
              height={720}
              onChange={() => {}}
              ref={ref}
            />
          </TabsContent>
          <TabsContent
            value="tender-details"
            className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
          >
            <TenderDetailsComponent data={draftDetails} />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
