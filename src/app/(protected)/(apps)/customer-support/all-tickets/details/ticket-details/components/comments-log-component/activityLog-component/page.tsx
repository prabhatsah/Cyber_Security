"use client"
import { useEffect, useState } from "react";
import { Plus, Send, MessageCircle, Unlock } from "lucide-react";
import { TicketData, TicketDetails } from "@/app/(protected)/(apps)/customer-support/components/type";
import getDataOfGetMyInstance from "@/app/(protected)/(apps)/customer-support/getMyInstanceAPI";
import { ClipLoader } from "react-spinners"; // Import a spinner from the library
interface ActivityLog {
  actionString: string;
  dateOfAction: Date;
  userName: string;
}
export default function EachTicketActivityLog({
  ticketNo
}: {
  ticketNo: string;
}) {

  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [thisTicketDetails, setTicketDetails] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const data = await getDataOfGetMyInstance({ ticketNo });
        console.log("tyfcDataf..................:d from activityLog", data);

        // Assuming data is an array and the first item contains the ticket details
        if (data && data.ticketDetails.length > 0 && data.ticketDetails[0].data.activityLogsData) {
          setActivityLog(data.ticketDetails[0].data.activityLogsData);
        }
      } catch (error) {
        console.error("Failed to fetch ticket details:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched or if there's an error
      }
    };

    fetchTicketDetails();
  }, [ticketNo]);

  const formatDate = (date: Date | string) => {
    // Ensure `date` is a Date object
    const parsedDate = typeof date === "string" ? new Date(date) : date;

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const year = parsedDate.getFullYear();
    const month = months[parsedDate.getMonth()];
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };


  // const handleAddComment = () => {
  //   if (input.trim()) {
  //     setComments([...comments, input]);
  //     setInput("");
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <ClipLoader color="#3498db" size={40} /> {/* Spinner from react-spinners */}
      </div>
    );
  }

  return (
    <main>
      <div className="flex-1 flex flex-col overflow-y-auto h-[600px] space-y-2">
        {activityLog.map((activityLog, index) => (
          <div key={index} className="border-b p-2 rounded-lg shadow-sm">

            <p className="font-semibold">{activityLog.actionString}</p>
            <div className="flex justify-between w-full">

              <span className="text-gray-300">{activityLog.userName}</span>
              <span className="text-xs ">{formatDate(activityLog.dateOfAction)}{" "}</span></div>
          </div>
        ))}

      </div>
    </main>
  )
}