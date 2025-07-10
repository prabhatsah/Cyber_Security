import { getProfileData } from "@/ikon/utils/actions/auth";


interface CommentDetails {
  comment: string;
  commentId: number;
  creationDate: Date;
  userId: string;
  userName: string;
  userThumbnailUrl: string;
}

interface ImageCommentObj {
  commentIdList: number[];
  imageIdList: string[];
}

interface UploadedResource {
  inputControl: string;
  // Add other properties if needed
}

interface TicketDetails {
  commentsUsers?: CommentDetails[];
  linkUploadedImageToComments?: ImageCommentObj[];
  uploadedResources?: UploadedResource[];
  [key: string]: any; // Allow additional properties
}

interface GetCommentRelatedDetailsProps {
  ticketNo: string;
  ticketDetails?: TicketDetails;
  commentDivId?: string;
  uploadedResourceList?: UploadedResource[];
  commentValue?:string;
}

export const getCommentRelatedAllDetails = async ({
  ticketNo,
  ticketDetails,
  commentDivId,
  uploadedResourceList,
  commentValue
//   userThumbnailMap,
//   resources,
//   globalTicket,
//   downloadUrl,
//   presentUserId,
//   presentUserName,
}: GetCommentRelatedDetailsProps): Promise<TicketDetails | { commentsUsers?: CommentDetails; linkUploadedImageToComments?: ImageCommentObj; uploadedResources?: UploadedResource[]; }> => {
  
  //let commentDiv;
  // if(commentDivId == ""){
  //    commentDiv = "addComment"
  // }
  // else {
  //    commentDiv = commentDivId
  // }

  console.log("input value from getCommentRelatedAllDetails->--------", commentValue)
  const commentIdValue = (document.getElementById(`${commentDivId}`) as HTMLInputElement)?.value;

  const commentId = new Date().getTime();

//   let presentUserThumbnailUrl = "";
//   if (presentUserId in userThumbnailMap) {
//     const presentUserthumbnailDetails = userThumbnailMap[presentUserId];
//     presentUserThumbnailUrl = `${downloadUrl}?ticket=${globalTicket}&resourceId=${presentUserthumbnailDetails.resourceId}&resourceName=${presentUserthumbnailDetails.resourceName}&resourceType=${presentUserthumbnailDetails.resourceType}`;
//   } else {
//     const presentUserthumbnailDetails = resources[4];
//     presentUserThumbnailUrl = `${downloadUrl}?ticket=${globalTicket}&resourceId=${presentUserthumbnailDetails.resourceId}&resourceName=${presentUserthumbnailDetails.resourceName}&resourceType=${presentUserthumbnailDetails.resourceType}`;
//   }

  const profileData = await getProfileData();
  const userId = profileData.USER_ID;
  const userName = profileData.USER_NAME;
  
  let tempCommentsUsers: CommentDetails | undefined;
  let comment: string | "";
  //const commentIdValue = comment ? comment : commentValue;
  if(commentIdValue != ""){
    comment = commentIdValue;
  }
  else{
     comment = commentValue?commentValue : "";
  }
  if (commentIdValue || commentValue) {
    tempCommentsUsers = {
      comment,
      commentId,
      creationDate: new Date(),
      userId: userId,
      userName: userName,
      userThumbnailUrl: "",
    };
  }

  const uploadedResourceId = uploadedResourceList?.map((eachResource) =>
    eachResource.inputControl.substring(10)
  ) || [];

  const tempImageCommentObj: ImageCommentObj = {
    commentIdList: [commentId],
    imageIdList: uploadedResourceId,
  };

  if (!ticketDetails) {
    return {
      commentsUsers: tempCommentsUsers,
      linkUploadedImageToComments: tempImageCommentObj,
      uploadedResources: uploadedResourceList,
    };
  } else {
    if (tempCommentsUsers) {
      if (!ticketDetails.commentsUsers) {
        ticketDetails.commentsUsers = [];
      }
      ticketDetails.commentsUsers.push(tempCommentsUsers);
    }

    if (!ticketDetails.linkUploadedImageToComments) {
      ticketDetails.linkUploadedImageToComments = [];
    }
    ticketDetails.linkUploadedImageToComments.push(tempImageCommentObj);

    if (!ticketDetails.uploadedResources) {
      ticketDetails.uploadedResources = [];
    }
    if (uploadedResourceList) {
      ticketDetails.uploadedResources.push(...uploadedResourceList);
    }

    return ticketDetails;
  }
};