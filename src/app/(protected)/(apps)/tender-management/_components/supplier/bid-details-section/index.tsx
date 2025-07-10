"use client";
import { getTicket } from "@/ikon/utils/actions/auth";
import { DOWNLOAD_URL } from "@/ikon/utils/config/urls";
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
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { MessageCircle } from "lucide-react";
import { useRef, useState } from "react";
import CollaborationSection from "../collaboration-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import ReadOnlyEditor from "../../read-only-text-editor";
import TenderDetailsComponent from "../../general/tender-details";
import PrerequisiteComponent from "../prerequisites-component";

export default function BidDetails({
  bidDetails,
  draftDetails,
}: {
  bidDetails: any;
  draftDetails: any;
}) {
  console.log("Bid Details", bidDetails);
  const [file, setfile] =
    bidDetails && bidDetails[0] && bidDetails[0].responseDraftResource
      ? useState(bidDetails[0].responseDraftResource)
      : useState(null);
  const [draftContent, setDraftContent] =
    bidDetails && bidDetails[0] && bidDetails[0].responseDraftContent
      ? useState(bidDetails[0].responseDraftContent)
      : useState(null);

  const draftRef = useRef(null);
  const responseRef = useRef(null);

  const viewFile = async (data: File) => {
    console.log("View File", data);
    const ticket = await getTicket();

    /* const url =
           `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
           `&resourceId=${encodeURIComponent(data.resourceId)}` +
           `&resourceName=${encodeURIComponent(data.resourceName)}` +
           `&resourceType=${encodeURIComponent(data.resourceType)}`;*/

    //window.open(encodeURI(url), "_blank");
    let link = "";
    if (
      data.resourceType == "image/jpeg" ||
      data.resourceType == "image/png" ||
      data.resourceType == "text/plain" ||
      data.resourceType == "application/pdf" ||
      data.resourceType == "video/mp4" ||
      data.resourceType == "image/gif"
    ) {
      var pdf_newTab = window.open();
      link =
        `${DOWNLOAD_URL}?ticket=${ticket}` +
        `&resourceId=${data.resourceId}` +
        `&resourceType=${data.resourceType}`;
      pdf_newTab.document.write(
        `<iframe id='viewdocId' width='100%' height='100%' src=''></iframe><script>var iframe = document.getElementById('viewdocId'); iframe.src = '${link}'</script>`
      );
    } else {
      link =
        `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
        `&resourceId=${encodeURIComponent(data.resourceId)}` +
        `&resourceName=${encodeURIComponent(data.resourceName)}` +
        `&resourceType=${encodeURIComponent(data.resourceType)}`;
      window.open(encodeURI(link), "_blank");
    }
  };

  return (
    <>
      {/* <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="flex justify-between">
            Details
            <Sheet>
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
            </Sheet>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <CardDescription>
            <div className="">
              {file ? (
                <>
                  <p>{file.resourceName}</p>{" "}
                  <p onClick={() => viewFile(file)}>Download</p>
                </>
              ) : (
                <>
                  <ScrollArea>
                    * <p>{draftContent}</p> *
                    <div dangerouslySetInnerHTML={{__html : draftContent}}></div>
                  </ScrollArea>
                </>
              )}
            </div>
          </CardDescription>
        </CardContent>
      </Card> */}

      <Tabs defaultValue="my-response">
        <TabsList variant="solid">
          <TabsTrigger value="tender-details">Tender details</TabsTrigger>
          <TabsTrigger value="prerequisite">Prerequisites</TabsTrigger>
          <TabsTrigger value="tender-documents">Tender documents</TabsTrigger>
          <TabsTrigger value="my-response">My Response</TabsTrigger>
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
        </Sheet> */}
        <div className="">
          <TabsContent
            value="my-response"
            className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
          >
            <ReadOnlyEditor
              value={
                bidDetails[0]?.responseDraftContent
                  ? bidDetails[0].responseDraftContent
                  : ""
              }
              height={720}
              onChange={() => {}}
              ref={responseRef}
            />
          </TabsContent>
          <TabsContent
            value="tender-documents"
            className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
          >
            <ReadOnlyEditor
              value={
                draftDetails?.draftContent ? draftDetails.draftContent : ""
              }
              height={720}
              onChange={() => {}}
              ref={draftRef}
            />
          </TabsContent>
          <TabsContent
            value="tender-details"
            className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
          >
            <TenderDetailsComponent data={draftDetails} />
          </TabsContent>
          <TabsContent
            value="prerequisite"
            className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500"
          >
            <PrerequisiteComponent data={bidDetails} />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
