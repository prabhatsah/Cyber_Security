postComment: function(ticketNo,assigneeId){
    const allTicketsMlpRef = CustomerSupportAllTicketsModuleLandingPage1680676754032;
    const mainLpRef = LandingPage1679378634873;
    const mainPreLoaderRef= Globals.GlobalAPI.PreLoader1679563139444;
    const cssPreLoaderRef = Globals.GlobalAPI.PreLoader1626238716658;
    const pl289 = Globals.GlobalAPI.PreLoader1677493332289;

    let presentUserId = Globals.profile.value.USER_ID.value;
    let supportAdminMap = mainLpRef.supportTeamAdminMap;
    let supportNOCMap = mainLpRef.supportTeamLevel1Details;
    let supportLevel2Map = mainLpRef.supportTeamLevel2Map;
    let supportLevel3Map = mainLpRef.supportTeamLevel3Map;
    let supportTeamMap = mainLpRef.supportTeamDetailsMap;

    let level2MemberFilteredArray = []
    let accountDetails = mainPreLoaderRef.accountIdWiseAllProjectManagerMap[mainLpRef.allTicketIdWiseTicketDetails[ticketNo].companyId]
    for(let key in accountDetails){
        for(let each of accountDetails[key])
            if(!level2MemberFilteredArray.includes(each) && each != undefined && each != null){
                level2MemberFilteredArray.push(each)
            }
    }


    /*if((!(presentUserId in supportAdminMap) && !(presentUserId in supportNOCMap) && !level2MemberFilteredArray.includes(presentUserId)) && (mainLpRef.allTicketIdWiseTicketDetails[ticketNo].assigneeId && mainLpRef.allTicketIdWiseTicketDetails[ticketNo].assigneeId != presentUserId) && mainLpRef.allTicketIdWiseTicketDetails[ticketNo].creatorId != presentUserId ){
        bootstrapModalAlert("You dont't have any access . Please contact the administrator!")
    }
    else if((presentUserId in supportAdminMap) || (presentUserId in supportNOCMap) || level2MemberFilteredArray.includes(presentUserId) || mainLpRef.allTicketIdWiseTicketDetails[ticketNo].assigneeId == presentUserId || mainLpRef.allTicketIdWiseTicketDetails[ticketNo].creatorId == presentUserId ){*/
    
    if(!(presentUserId in supportAdminMap) && !(presentUserId in supportNOCMap) && !(presentUserId in supportLevel2Map) && (mainLpRef.allTicketIdWiseTicketDetails[ticketNo].assigneeId && mainLpRef.allTicketIdWiseTicketDetails[ticketNo].assigneeId != presentUserId) && mainLpRef.allTicketIdWiseTicketDetails[ticketNo].creatorId != presentUserId ){
        bootstrapModalAlert("You dont't have access to Post Comment on this ticket. Please contact the administrator!");
    }
    else if((presentUserId in supportAdminMap) || (presentUserId in supportNOCMap) || (presentUserId in supportLevel2Map) || mainLpRef.allTicketIdWiseTicketDetails[ticketNo].assigneeId == presentUserId || mainLpRef.allTicketIdWiseTicketDetails[ticketNo].creatorId == presentUserId ){
        let htmlTemplate = Handlebars.compile(allTicketsMlpRef.handlebarNameHtmlMap['Post_Comment_Template'])({
            allTicketsMlpRef : "CustomerSupportAllTicketsModuleLandingPage1680676754032",
            ticketNo: ticketNo
        });
        $('#viewCommentModalForm').html(htmlTemplate);
        $("#postCommentModal").modal('show') ;
        allTicketsMlpRef.selectAllFunction(ticketNo);
// 			allTicketsMlpRef.getFileData();



        // 			ref.commentQuill = new Quill("#writeComment-"+ticketNo, {
        // 				theme: "snow",
        // 				modules: {
        // 					toolbar: [
        // // 						[{ font: [] }, { size: ["small", false, "large", "huge"] }],
        // 						[{ font: [] }, { size: ["small", false, "large", "huge"] }],
        // 						["bold", "italic", "underline", "strike"],
        // 					]
        // 				},
        // 			});

        // 			$("#writeComment-" + ticketNo).siblings('.ql-toolbar').find('svg').css('position', 'relative');
    }
    else{
        bootstrapModalAlert("You dont't have access to Post Comment on this ticket. Please contact the administrator!");
    }

},
