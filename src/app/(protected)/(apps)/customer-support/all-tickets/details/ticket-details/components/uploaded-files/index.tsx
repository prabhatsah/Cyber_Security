"use client"
import { getTicket } from "@/ikon/utils/actions/auth";
import { singleFileUpload } from "@/ikon/utils/api/file-upload";
import { DOWNLOAD_URL } from "@/ikon/utils/config/urls";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { ReactNode } from "react";
import { useEffect, useState } from "react";

type TicketDetails = {
  assignedTo: string;
  accountName: string;
  subject: string;
  priority: string;
  type: string;
  accountId: string;
  dateCreated: string;
  ticketNo: string;
  issueDate: string;
  status: string;
  clientUploadedResources: {
    url: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  }[];
};

export default function EachTicketUploadedFileComponent({
  ticketDetails,
}: {
  ticketDetails: TicketDetails;
}): ReactNode {
  // Update the state type to handle 'undefined' in addition to 'null' and 'string'
  const [ticket, setTicket] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    // Fetch the ticket value here (assuming getTicket() returns a promise)
    const fetchTicket = async () => {
      const ticketValue = await getTicket(); // Fetch the ticket value
      setTicket(ticketValue);  // ticketValue can be string or undefined
    };

    fetchTicket();
  }, []);

  if (ticket === undefined) {
    // You can show a loading spinner or some message while the ticket is being fetched
    return <div>Loading ticket...</div>;
  }

  return (
    <Card className="h-1/2 flex flex-col mt-3">
    <CardHeader className="flex flex-row justify-between items-center border-b">
      <CardTitle>Uploaded Files</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid gap-2 p-0 overflow-hidden">
        {/* Check if clientUploadedResources exists and has files */}
        {ticketDetails.clientUploadedResources && ticketDetails.clientUploadedResources.length > 0 ? (
          ticketDetails.clientUploadedResources.map((file, index) => (
            <div key={index} className="file-item">
              <a
                href={`${DOWNLOAD_URL}?ticket=${ticket}&resourceId=${file.resourceId}&resourceName=${file.resourceName}&resourceType=${file.resourceType}`}
                download={file.resourceName}
                className="text-blue-500 hover:underline"
              >
                {file.resourceName}
              </a>
            </div>
          ))
        ) : (
          <div className="text-sm mt-2 p-2">No Files Uploaded</div>
        )}
      </div>
    </CardContent>
  </Card>
  
  );
}
