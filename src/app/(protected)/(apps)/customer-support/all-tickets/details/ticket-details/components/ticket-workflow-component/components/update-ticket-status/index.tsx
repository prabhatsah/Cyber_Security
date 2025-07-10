updateTicketStatus: function(ticketNo, args){
    const ref = LandingPage1679378634873;
    const mainPreLoaderRef= Globals.GlobalAPI.PreLoader1679563139444;
    const ticketDetailsModRef = CustomerSupportTicketViewModuleLandingPage1679554638202;
    
    let statesWithLock = mainPreLoaderRef.getStatesWithLockRequired();
    //CHANGED
    let activityObj = {};
/* 		if(!mainPreLoaderRef.commentValidation(ticketNo, "addComment")){
        bootstrapModalAlert("Comment can't be blank !");
        return;
    } */

    const commentId = "addComment-" + ticketNo;
    const comment = $("#" + commentId).val();
    ref.validateMessage(commentId, true);
    if(comment == undefined || comment == '' || comment == null  || comment =='-1'){
        ref.validateMessage(commentId, false, "Please add your comment!");
        return;
    }
        
    args = args.split(",");
    let transition = args[1];
    let state = args[2];

    $("#viewCommentModal").modal('hide');

    if(state == "Assign"){
        ref.assigneeTicket(ticketNo, ticketDetailsModRef.reloadModuleLandingPage);
        return;
    }

    var processName = "Customer Support Desk Ticket";
    var predefinedFilters = null;
    var processVariableFilters = null;
    var taskVariableFilters = null;
    var mongoWhereClause = `this.Data.ticketNo=="${ticketNo}"`;
    var projection = ["Data"];
    var isFetchAllInstances = false;
    loadSpinner("IkonMainContentDiv");
    IkonService.getMyInstancesV2(processName, globalAccountId, {includeSharedInstances: true}, processVariableFilters, taskVariableFilters, mongoWhereClause, projection, isFetchAllInstances, function(){
        console.log("Success");
        let taskId = arguments[0][0].taskId;
        let ticketDetails = arguments[0][0].data;

        let previousStatus = ticketDetails["status"];
        let newStatus = state;

        ticketDetails["activityLogsData"] = mainPreLoaderRef.makeActivityLogsData(ticketNo, "stateChange", previousStatus, newStatus);
        
        //NEW 
        activityObj = mainPreLoaderRef.makeActivityLogsDataGlobal(ticketNo, "stateChange", previousStatus, newStatus);
        mainPreLoaderRef.saveDataOfActivityLogGlobal(activityObj,()=>{
            if(previousStatus == "New" && newStatus == "In Progress"){
                activityObj = mainPreLoaderRef.makeActivityLogsDataGlobal(ticketNo, "lockAcquired", ticketDetails['assigneeId']);
                mainPreLoaderRef.saveDataOfActivityLogGlobal(activityObj);
            }
        });
        
        if(previousStatus == "New" && newStatus == "In Progress"){
            ticketDetails["activityLogsData"] = mainPreLoaderRef.makeActivityLogsData(ticketNo, "lockAcquired", ticketDetails['assigneeId']);
        }

        ticketDetails["previousStatus"] = ticketDetails["status"];
        ticketDetails["status"] = state;
        ticketDetails["isStatusChange"] = true;

        ticketDetails["pastStateList"] = ticketDetails["pastStateList"] ?? [];
        ticketDetails["pastStateList"].push(state);
        
        if(statesWithLock.includes(state)){
            ticketDetails["assigneeLockStatus"] = "locked";
        }

        ticketDetails = mainPreLoaderRef.getCommentRelatedAllDetails(ticketNo, ticketDetails);

        ticketDetails = mainPreLoaderRef.setTicketUpdateUserDetails(state, ticketDetails);
        ticketDetails = mainPreLoaderRef.resetTicketpastStateList(transition, ticketDetails);

        IkonService.invokeAction(taskId, transition, ticketDetails,"",function(){
            ref.getPriorityWiseTicketInfo(true, ticketDetails);

// 				ticketDetailsModRef.reloadModuleLandingPage(ticketNo);

            console.log("Data Updated");
            unloadSpinner("IkonMainContentDiv")
        },function(){
            console.log("Data Updation failed");
        });	
    }, function(){
        console.log("Failed");
    })
},
