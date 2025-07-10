"use client";
import React, { useEffect, useState, useRef } from "react";
import { Send, FileUp } from "lucide-react";
import {
  TicketData,
  TicketDetails,
} from "@/app/(protected)/(apps)/customer-support/components/type";
import getDataOfGetMyInstance from "@/app/(protected)/(apps)/customer-support/getMyInstanceAPI";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { saveComment } from "./saveComment";
import fetchTicketDetails from "@/app/(protected)/(apps)/customer-support/components/ticket-details";
import { multipleFileUpload } from "@/ikon/utils/api/file-upload"; // Import your multipleFileUpload function
import { getTicket } from "@/ikon/utils/actions/auth"; // Import getTicket
import { DOWNLOAD_URL } from "@/ikon/utils/config/urls"; // Import DOWNLOAD_URL
import { LoadingSpinner } from "@/ikon/components/loading-spinner";

interface Comment {
  comment: string;
  commentId: number;
  creationDate: Date;
  userId: string;
  userName: string;
  userThumbnailUrl: string;
  uploadedResources?: UploadedResource[]; // Update this to reflect the correct type
}

interface UploadedResource {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  resourceSize: number;
  uploadDate: string;
  username: string;
  userId: string;
  inputControl: string; // Add this property here
}
interface LinkUploadedImageToComments {
  commentIdList: any;
  commentId: [];
  imageIdList?: any[];
}

interface ImageCommentObj {
  commentIdList: number[]; // Assuming this is what you are using
  imageIdList: string[];
  // Add commentId if it is expected
  commentId?: number;
}

export default function EachTicketComments({
  initialTicketDetails,
  ticketNo,
  loadPage,
}: {
  initialTicketDetails: TicketDetails;
  ticketNo: string;
  loadPage:string;
}) {
  console.log("fytugyioupouhyguhujhgvhujijuhg", initialTicketDetails);
  const [comments, setComments] = useState<Comment[]>([]);
  const [linkUploadedImageToComments, setLinkUploadedImageToComments] =
    useState<LinkUploadedImageToComments[]>([]);
  const [uploadedResources, setUploadedResources] = useState<
    UploadedResource[]
  >([]);
  const [input, setInput] = useState("");
  const [currentUser, setcurrentUser] = useState("");
  const [assigneeId, setassigneeId] = useState("");
  const [isAssignee, setIsAssignee] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ticket, setTicket] = useState<string | null>(null); // State for the ticket

  const [thisTicketDetails, setTicketDetails] = useState<TicketData | null>(
    null
  );

  useEffect(() => {
    async function fetchProfileData() {
      const profileData = await getProfileData();
      setcurrentUser(profileData.USER_ID);
    }
    fetchProfileData();
  }, []);

  if(loadPage=="load" && initialTicketDetails){
    console.log("initialTicketDetails----???>>>",initialTicketDetails)

    if (initialTicketDetails && initialTicketDetails.commentsUsers) {
      setComments(initialTicketDetails.commentsUsers);
    }
    const ticketAssigneeId = initialTicketDetails.assigneeId?initialTicketDetails.assigneeId:"";
    setassigneeId(ticketAssigneeId);
    if (initialTicketDetails.linkUploadedImageToComments)
      setLinkUploadedImageToComments(
        initialTicketDetails
          .linkUploadedImageToComments as LinkUploadedImageToComments[]
      );
    if (initialTicketDetails.uploadedResources)
      if (initialTicketDetails.uploadedResources) {
        // Explicitly type the result here!
        const fetchedUploadedResources = initialTicketDetails
          .uploadedResources as UploadedResource[];
        setUploadedResources(fetchedUploadedResources || []);
      }
    console.log(
      "here we go for assigneeID ------------------------->>???",
      ticketAssigneeId
    );
    
  }else{
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const data = await getDataOfGetMyInstance({ ticketNo });
        console.log("tyfcDataf..................:d", data);

        if (
          data &&
          data.ticketDetails.length > 0 &&
          data.ticketDetails[0].data.commentsUsers
        ) {
          setComments(data.ticketDetails[0].data.commentsUsers);
        }
        const ticketAssigneeId = data.ticketDetails[0].data.assigneeId;
        if (data.ticketDetails[0].data.linkUploadedImageToComments)
          setLinkUploadedImageToComments(
            data.ticketDetails[0].data
              .linkUploadedImageToComments as LinkUploadedImageToComments[]
          );
        if (data.ticketDetails[0].data.uploadedResources)
          if (data.ticketDetails[0].data.uploadedResources) {
            // Explicitly type the result here!
            const fetchedUploadedResources = data.ticketDetails[0].data
              .uploadedResources as UploadedResource[];
            setUploadedResources(fetchedUploadedResources || []);
          }
        console.log(
          "here we go for assigneeID ------------------------->>???",
          ticketAssigneeId
        );
        setassigneeId(ticketAssigneeId);
      } catch (error) {
        console.error("Failed to fetch ticket details:", error);
      }
    };

    fetchTicketDetails();
  }, [ticketNo]);}

  const formatDate = (dateInput: any) => {
    console.log("Inside formatDate, dateInput:", dateInput);
    let date: Date;
    if (!dateInput) {
      return "";
    }
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "string") {
      date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        console.error("Invalid date string:", dateInput);
        return "Invalid Date";
      }
    } else {
      console.error("Unexpected dateInput type:", typeof dateInput, dateInput);
      return "Invalid Date";
    }
    console.log("After conversion/check, date:", date);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    try {
      return date.toLocaleDateString("en-GB", options).replace(/,/g, "");
    } catch (error) {
      console.error("Error in toLocaleDateString:", error, date);
      return "Formatting Error";
    }
  };

  useEffect(() => {
    console.log("creent user id ==============", currentUser);
    console.log("creent user id ==============", assigneeId);
    setIsAssignee(currentUser === assigneeId);
  }, [currentUser, assigneeId]);

  //const [comments, setComments] = useState<Comment[]>(ticketDetails.commentsUsers);

  // Function to map uploaded resources to comments based on imageIdList
  const mapUploadedResourcesToComments = () => {
    return comments.map((comment) => {
      // 1. Find all link entries that reference this comment's ID
      const relevantLinks = linkUploadedImageToComments.filter((link) =>
        link.commentIdList.includes(comment.commentId)
      );

      // 2. Extract all image IDs from these link entries
      const imageIds = relevantLinks.flatMap((link) => link.imageIdList);

      // 3. Find matching resources using inputControl values
      const resourcesForComment = uploadedResources.filter((resource) => {
        const resourceImageId = resource.inputControl.replace("fileUpload", "");
        return imageIds.includes(resourceImageId);
      });

      return {
        ...comment,
        resources: resourcesForComment,
      };
    });
  };

  const commentsWithResources = mapUploadedResourcesToComments();

  const handleSendComment = async () => {
    if (input.trim() || selectedFiles.length > 0) {
      try {
        console.log("from comment page----->>????>>>>>>>>??????", input);
        let uploadedResources: any[] = [];
        if (selectedFiles.length > 0) {
          const fileInfos = await multipleFileUpload(selectedFiles);
          console.log("Uploaded File Infos:", fileInfos);

          uploadedResources = fileInfos.map((fileInfo, index) => {
            const uploadDate = new Date();
            const formattedDate = uploadDate
              .toISOString()
              .replace("Z", "+0530");
            const dynamicId = crypto.randomUUID();
            const inputControlId = `fileUpload${dynamicId}`;

            return {
              resourceId: fileInfo.resourceId,
              resourceName: fileInfo.resourceName,
              resourceType: fileInfo.resourceType,
              resourceSize: selectedFiles[index].size,
              uploadDate: formattedDate,
              username: currentUser,
              userId: currentUser,
              inputControl: inputControlId,
            };
          });
        }

        await saveComment(ticketNo, input.trim(), uploadedResources);
        setInput("");
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        window.location.reload();
      } catch (error) {
        console.error("Failed to save comment:", error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  console.log("comments............,", comments);

  useEffect(() => {
    const fetchTicket = async () => {
      const ticketValue = await getTicket();
      if (ticketValue) {
        setTicket(ticketValue);
      } else {
        setTicket(null); // Or handle the case where there's no ticket value differently
      }
    };
    fetchTicket();
  }, []);

  if (ticket === undefined) {
    return <div>Loading download credentials...</div>;
  }

  if (ticket === null) {
    return <div>Loading.......</div>;
  }

  return (
<main>
  <div
    className={`flex-1 flex flex-col-reverse overflow-y-auto ${
      isAssignee ? "h-[60vh]" : "h-[600px]"
    } space-y-2 space-y-reverse`}
  >
    {/* 💾 FILE PREVIEW SECTION WITHIN SCROLL */}
    {isAssignee && selectedFiles.length > 0 && (
      <div className="px-2">
        <div
          className="flex flex-wrap gap-4 overflow-y-auto max-h-60" // Add max height and enable scroll
          style={{ maxHeight: "200px" }} // Set a specific height (adjust as needed)
        >
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="relative w-full max-w-[200px] border rounded-md p-3 bg-white shadow-sm dark:bg-[#1e1e1e] dark:border-gray-700"
            >
              <button
                type="button"
                className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                onClick={() => {
                  const updated = [...selectedFiles];
                  updated.splice(index, 1);
                  setSelectedFiles(updated);
                }}
              >
                ×
              </button>
              <div className="truncate text-sm font-medium text-gray-800 dark:text-white">
                📄 {file.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {(file.size / 1024).toFixed(2)} KB
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div className="bg-green-500 h-1.5 rounded-full w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* 🧾 COMMENT THREAD */}
    {commentsWithResources.map((comment, index) => (
      <div key={index} className="rounded-xl border p-4 shadow-sm space-y-3">
        {/* 💬 Comment Text */}
        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
          {comment.comment}
        </p>

        {/* 📎 Attached Files */}
        {comment.resources && comment.resources.length > 0 && (
          <div className="space-y-2">
            {comment.resources.map((resource, resIndex) => (
              <div key={resIndex} className="flex items-center gap-2 text-sm text-blue-600">
                📎
                <a
                  href={`${DOWNLOAD_URL}?ticket=${ticket}&resourceId=${resource.resourceId}&resourceName=${resource.resourceName}&resourceType=${resource.resourceType}`}
                  download={resource.resourceName}
                  className="hover:underline truncate max-w-[250px]"
                >
                  {resource.resourceName}
                </a>
              </div>
            ))}
          </div>
        )}
        {/* 🧾 Comment Header */}
        <div className="flex justify-between items-center">
          <span className="text-sm">{comment.userName}</span>
          <span className="text-xs text-gray-300">
            {formatDate(comment.creationDate)}
          </span>
        </div>
      </div>
    ))}
  </div>

  {/* ✅ INPUT FIELD + BUTTONS - FIXED AT THE BOTTOM */}
  {isAssignee && (
    <div className="sticky bottom-0 p-2 w-full bg-background flex items-center gap-2 border-t border-gray-700">
      <input
        id="commentForEachTicket"
        name="commentForEachTicket"
        type="text"
        className="flex-1 p-2 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-primary-900"
        placeholder="Enter comment"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <input
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          const newFiles = e.target.files ? Array.from(e.target.files) : [];
          setSelectedFiles((prev) => [...prev, ...newFiles]); // ✅ Add to existing
        }}
      />
      <button
        type="button"
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        onClick={handleFileUploadClick}
      >
        <FileUp />
      </button>
      <button
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        onClick={handleSendComment}
      >
        <Send />
      </button>
    </div>
  )}
</main>



  );
  
}
