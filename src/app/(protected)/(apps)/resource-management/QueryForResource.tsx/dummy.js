fetchDealDetails: function (obj_, callbackFunction) {
    let ref = LandingPage1675237049110;
    console.debug("fetchDealDetails() called..");
    if (Globals.SubscribedSoftwareNameMap["Sales CRM_1"]) {
        IkonService.getMyInstancesV4(
            "Deal",
            globalAccountId,
            Globals.SubscribedSoftwareNameMap["Sales CRM_1"].SOFTWARE_ID,
            { taskName: "View State" },
            null, null, null, ["Data"],
            false,
            function () {
                obj_.allDealDetails = [];
                obj_.allDealStatusMap = {};
                obj_.allDealBillingMap = {};

                if (arguments[0].length) {
                    arguments[0].forEach((dealInstance) => {
                        let dealData = dealInstance.data;
                        obj_.allDealDetails.push(dealData);
                        obj_.allDealStatusMap[dealData.dealIdentifier] = dealData.dealStatus;
                        obj_.allDealBillingMap[dealData.dealIdentifier] = dealData.isDebtRevenue ? "Non Billable" : "Billable";
                    });
                }

                if (callbackFunction) {
                    callbackFunction();
                }
            },
            function () {
                console.error(arguments);
            }
        );
    } else {
        obj_.allDealDetails = [];
        obj_.allDealStatusMap = {};
        obj_.allDealBillingMap = {};
        if (callbackFunction) {
            callbackFunction();
        }
    }
},

fetchProjectDetails: function (obj_, callbackFunction) {
    let ref = LandingPage1675237049110;
    console.debug("fetchProjectDetails() called..");
    if (Globals.SubscribedSoftwareNameMap["Project Management_1"]) {
        IkonService.getMyInstancesV4(
            "Project",
            globalAccountId,
            Globals.SubscribedSoftwareNameMap["Project Management_1"].SOFTWARE_ID,
            { taskName: "View State" },
            null, null, null, ["Data"],
            false,
            function () {
                obj_.allProjectDetails = [];
                obj_.allProjectStatusMap = {};
                if (arguments[0].length) {
                    arguments[0].forEach((projectInstance) => {
                        obj_.allProjectDetails.push(projectInstance.data);
                        obj_.allProjectStatusMap[projectInstance.data.projectIdentifier] = projectInstance.data.projectStatus;
                    });
                }
                if (callbackFunction) {
                    callbackFunction();
                }
            },
            function () {
                console.error(arguments);
            }
        );
    } else {
        obj_.allProjectDetails = [];
        obj_.allProjectStatusMap = {};
        if (callbackFunction) {
            callbackFunction();
        }
    }
},

fetchProductDetails: function (obj_, callbackFunction) {
    let ref = LandingPage1675237049110;
    let mainPreloaderRef = Globals.GlobalAPI.PreLoader1654244259362;
    console.debug("fetchProductDetails() called..");

    let mongoWhereClause = "(this.Data.productType == 'Professional Service')";
    if (obj_.allDealDetails.length) {
        mongoWhereClause += ` && (this.Data.dealIdentifier == '${obj_.allDealDetails.map((deal) => deal.dealIdentifier).join("' || this.Data.dealIdentifier == '")}')`;
    }

    if (Globals.SubscribedSoftwareNameMap["Sales CRM_1"]) {
        IkonService.getMyInstancesV4(
            "Product",
            globalAccountId,
            Globals.SubscribedSoftwareNameMap["Sales CRM_1"].SOFTWARE_ID,
            { taskName: "View State" },
            null, null, mongoWhereClause, ["Data"],
            false,
            function () {
                obj_.productDetails = [];
                obj_.allResourceAllocationDataForDeal = [];

                if (arguments[0].length) {
                    arguments[0].forEach((productInstance) => {
                        let productData = productInstance.data;
                        obj_.productDetails.push(productData);

                        if (productData.resourceDataWithAllocation && Array.isArray(productData.resourceDataWithAllocation)) {
                            let resourceAllocationMap = {};
                            productData.resourceDataWithAllocation.forEach((resource) => {
                                let resourceCopy = JSON.parse(JSON.stringify(resource));
                                for (let monthKey in resource.allocation) {
                                    resourceCopy[`${monthKey}_fte`] = parseFloat(resource.allocation[monthKey]);
                                }
                                resourceCopy.grade = mainPreloaderRef.gradeDetails[resource.gradeId]?.grade || null;
                                resourceCopy.projectOrProspectIdentifier = productData.dealIdentifier;
                                resourceCopy.projectOrProspectName = productData.dealName;
                                resourceCopy.projectOrProspect = productData.parentDealId ? "Change" : "Prospect";
                                resourceCopy.dealStatus = obj_.allDealStatusMap[productData.dealIdentifier] || productData.dealStatus;
                                resourceCopy.billableOrNonBillable = obj_.allDealBillingMap[productData.dealIdentifier] || "Billable";
                                resourceCopy.productIdentifier = productData.productIdentifier;
                                resourceCopy.customUniqueIdentifier = `${resource.resourceId}_${productData.productIdentifier}`;
                                delete resourceCopy.allocation;
                                resourceAllocationMap[resource.resourceId] = resourceCopy;
                            });
                            obj_.allResourceAllocationDataForDeal.push(...Object.values(resourceAllocationMap));
                        }
                    });
                }

                if (callbackFunction) {
                    callbackFunction();
                }
            },
            function () {
                console.error(arguments);
            }
        );
    } else {
        obj_.productDetails = [];
        obj_.allResourceAllocationDataForDeal = [];
        if (callbackFunction) {
            callbackFunction();
        }
    }
},

fetchProductOfProjectDetails: function (obj_, callbackFunction) {
    let ref = LandingPage1675237049110;
    let mainPreloaderRef = Globals.GlobalAPI.PreLoader1654244259362;
    console.debug("fetchProductOfProjectDetails() called..");

    let mongoWhereClause = null;
    if (obj_.allProjectDetails && obj_.allProjectDetails.length) {
        mongoWhereClause = `this.Data.projectIdentifier == '${obj_.allProjectDetails.map((project) => project.projectIdentifier).join("' || this.Data.projectIdentifier == '")}'`;
    }

    if (Globals.SubscribedSoftwareNameMap["Project Management_1"]) {
        IkonService.getMyInstancesV4(
            "Product of Project",
            globalAccountId,
            Globals.SubscribedSoftwareNameMap["Project Management_1"].SOFTWARE_ID,
            { taskName: "View State" },
            null, null, mongoWhereClause, ["Data"],
            false,
            function () {
                obj_.productOfProject = [];
                obj_.allResourceAllocationDataForProject = [];

                if (arguments[0].length) {
                    arguments[0].forEach((productInstance) => {
                        let productData = productInstance.data;
                        obj_.productOfProject.push(productData);

                        if (productData.resourceDataWithAllocation && Array.isArray(productData.resourceDataWithAllocation)) {
                            let resourceAllocationMap = {};
                            productData.resourceDataWithAllocation.forEach((resource) => {
                                let resourceCopy = JSON.parse(JSON.stringify(resource));
                                for (let monthKey in resource.allocation) {
                                    resourceCopy[`${monthKey}_fte`] = parseFloat(resource.allocation[monthKey]);
                                }
                                resourceCopy.grade = mainPreloaderRef.gradeDetails[resource.gradeId]?.grade || null;
                                resourceCopy.projectOrProspectIdentifier = productData.projectIdentifier;
                                resourceCopy.projectOrProspectName = productData.projectName;
                                resourceCopy.projectOrProspect = productData.parentDealId ? "Change" : "Project";
                                resourceCopy.projectStatus = obj_.allProjectStatusMap[productData.projectIdentifier] || productData.projectStatus;
                                resourceCopy.billableOrNonBillable = obj_.allDealBillingMap[productData.projectIdentifier] || "Billable";
                                resourceCopy.productIdentifier = productData.productIdentifier;
                                resourceCopy.customUniqueIdentifier = `${resource.resourceId}_${productData.productIdentifier}`;
                                delete resourceCopy.allocation;
                                resourceAllocationMap[resource.resourceId] = resourceCopy;
                            });
                            obj_.allResourceAllocationDataForProject.push(...Object.values(resourceAllocationMap));
                        }
                    });
                }

                if (callbackFunction) {
                    callbackFunction();
                }
            },
            function () {
                console.error(arguments);
            }
        );
    } else {
        obj_.productOfProject = [];
        obj_.allResourceAllocationDataForProject = [];
        if (callbackFunction) {
            callbackFunction();
        }
    }
},

setDataToLandingPageReference: function (obj_, callbackFunction) {
    let ref = LandingPage1675237049110;
    ref.allResourcesAllocationTable = [];

    for (var i = 0; i < obj_.allResourcesAllocationTable.length; i++) {
        if (obj_.allResourcesAllocationTable[i].projectOrProspectStatus != "Completed") {
            ref.allResourcesAllocationTable.push(obj_.allResourcesAllocationTable[i]);
        }
    }

    if (callbackFunction) {
        callbackFunction();
    }
},

renderAllFunctions: function () {
    let ref = LandingPage1675237049110;
    let obj_ = {};
    ref.fetchDealDetails(
        obj_,
        function () {
            ref.fetchProjectDetails(
                obj_,
                function () {
                    ref.fetchProductDetails(
                        obj_,
                        function () {
                            ref.fetchProductOfProjectDetails(
                                obj_,
                                function () {
                                    ref.setDataToLandingPageReference(obj_, function () {
                                        console.log("ref.allResourcesAllocationTable generated successfully!");
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
}



fetchProductOfProjectDetails: function (obj_, callbackFunction) {
    let ref = LandingPage1675237049110;
    let mainPreloaderRef = Globals.GlobalAPI.PreLoader1654244259362;
    let mongoWhereClause = null;
    obj_.allResourcesAllocationTable = [];
    if (obj_.allProjectDetails.length) {
        mongoWhereClause = `this.Data.projectIdentifier == '${obj_.allProjectDetails.map((project) => project.projectIdentifier).join("' || this.Data.projectIdentifier == '")}'`;
    }
    if (Globals.SubscribedSoftwareNameMap["Project Management_1"]) {
        IkonService.getMyInstancesV4(
            "Product of Project",
            globalAccountId,
            Globals.SubscribedSoftwareNameMap["Project Management_1"].SOFTWARE_ID,
            { taskName: "View State" },
            null, null, mongoWhereClause, ["Data"],
            false,
            function () {
                obj_.productOfProject = [];
                if (arguments[0].length) {
                    obj_.productOfProject = arguments[0].map((productInstance) => productInstance.data);
                }
                for (var i = 0; i < obj_.productOfProject.length; i++) {
                    if (obj_.productOfProject[i]["resourceDataWithAllocation"]) {
                        for (var j = 0; j < obj_.productOfProject[i]["resourceDataWithAllocation"].length; j++) {
                            if (obj_.dealIdWiseResource[obj_.productOfProject[i].projectIdentifier]) {
                                if (obj_.dealIdWiseResource[obj_.productOfProject[i].projectIdentifier][obj_.productOfProject[i]["resourceDataWithAllocation"][j]["resourceId"]] == undefined) {
                                    obj_.dealIdWiseResource[obj_.productOfProject[i].projectIdentifier][obj_.productOfProject[i]["resourceDataWithAllocation"][j]["resourceId"]] = obj_.allDealBillingMap[obj_.productOfProject[i].projectIdentifier];
                                }
                            } else {
                                obj_.dealIdWiseResource[obj_.productOfProject[i].projectIdentifier] = {};
                                obj_.dealIdWiseResource[obj_.productOfProject[i].projectIdentifier][obj_.productOfProject[i]["resourceDataWithAllocation"][j]["resourceId"]] = obj_.allDealBillingMap[obj_.productOfProject[i].projectIdentifier];
                            }
                        }
                    }
                }
                obj_.allResourceAllocationDataForProject = [];
                for (let eachProduct of obj_.productOfProject) {
                    let resourceAllocation = [];
                    if (eachProduct.resourceDataWithAllocation) {
                        let resourceAllocationMap = {};
                        for (let eachResource of eachProduct.resourceDataWithAllocation) {
                            let resource = (resourceAllocationMap[eachResource.resourceId]) ? (resourceAllocationMap[eachResource.resourceId]) : JSON.parse(JSON.stringify(eachResource));
                            for (let eachMonthKey in eachResource.allocation) {
                                if (resource[`${eachMonthKey}_fte`]) {
                                    resource[`${eachMonthKey}_fte`] += parseFloat(eachResource.allocation[eachMonthKey]);
                                } else {
                                    resource[`${eachMonthKey}_fte`] = parseFloat(eachResource.allocation[eachMonthKey]);
                                }
                            }
                            resource["grade"] = (mainPreloaderRef.gradeDetails[resource["gradeId"]]) ? (mainPreloaderRef.gradeDetails[resource["gradeId"]]["grade"]) : null;
                            resource["projectOrProspectIdentifier"] = eachProduct.projectIdentifier;
                            resource["projectOrProspectName"] = eachProduct.projectName;
                            if (eachProduct.parentDealId) {
                                resource["projectOrProspect"] = "Change";
                            } else {
                                resource["projectOrProspect"] = "Project";
                            }
                            resource["projectStatus"] = obj_.allProjectStatusMap[eachProduct.projectIdentifier];
                            resource["billableOrNonBillable"] = obj_.dealIdWiseResource[eachProduct.projectIdentifier][eachResource.resourceId];
                            resource["productIdentifier"] = eachProduct.productIdentifier;
                            resource["customUniqueIdentifier"] = `${resource.resourceId}_${eachProduct.productIdentifier}`;
                            delete resource.allocation;
                            resourceAllocationMap[resource.resourceId] = resource;
                        }
                        resourceAllocation = Object.values(resourceAllocationMap);
                    }
                    if (resourceAllocation.length) {
                        obj_.allResourceAllocationDataForProject.push(...resourceAllocation);
                    }
                }
                let mergedResourcesTable = [];
                for (let i = 0; i < obj_.allResourceAllocationDataForDeal.length; i++) {
                    if (obj_.allResourceAllocationDataForDeal[i].resourceType == "Generic") continue;
                    if (obj_.allResourceAllocationDataForDeal[i].resourceType == "Named" && mainPreloaderRef.globalEmployeeMap[obj_.allResourceAllocationDataForDeal[i].resourceId]) {
                        obj_.allResourceAllocationDataForDeal[i]["joiningDate"] = (mainPreloaderRef.globalEmployeeMap[obj_.allResourceAllocationDataForDeal[i].resourceId]?.basicData?.joiningDate) ? (moment(mainPreloaderRef.globalEmployeeMap[obj_.allResourceAllocationDataForDeal[i].resourceId].basicData.joiningDate).format("DD-MMM-YYYY")) : "n/a";
                        obj_.allResourceAllocationDataForDeal[i]["role"] = (mainPreloaderRef.globalEmployeeMap[obj_.allResourceAllocationDataForDeal[i].resourceId]?.basicData?.role) ? (Globals.GlobalAPI.PreLoader1665485117455.globalRolesMap[mainPreloaderRef.globalEmployeeMap[obj_.allResourceAllocationDataForDeal[i].resourceId].basicData.role].roleTitle) : "n/a";
                    } else {
                        obj_.allResourceAllocationDataForDeal[i]["joiningDate"] = "n/a";
                        obj_.allResourceAllocationDataForDeal[i]["role"] = "n/a";
                    }
                    mergedResourcesTable.push(obj_.allResourceAllocationDataForDeal[i]);
                }
                for (let i = 0; i < obj_.allResourceAllocationDataForProject.length; i++) {
                    if (obj_.allResourceAllocationDataForProject[i].resourceType == "Generic") continue;
                    if (obj_.allResourceAllocationDataForProject[i].resourceType == "Named" && mainPreloaderRef.globalEmployeeMap[obj_.allResourceAllocationDataForProject[i].resourceId]) {
                        obj_.allResourceAllocationDataForProject[i]["joiningDate"] = (mainPreloaderRef.globalEmployeeMap[obj_.allResourceAllocationDataForProject[i].resourceId]?.basicData?.joiningDate) ? (moment(mainPreloaderRef.globalEmployeeMap[obj_.allResourceAllocationDataForProject[i].resourceId].basicData.joiningDate).format("DD-MMM-YYYY")) : "n/a";
                        obj_.allResourceAllocationDataForProject[i]["role"] = (mainPreloaderRef.globalEmployeeMap[obj_.allResourceAllocationDataForProject[i].resourceId]?.basicData?.role) ? (Globals.GlobalAPI.PreLoader1665485117455.globalRolesMap[mainPreloaderRef.globalEmployeeMap[obj_.allResourceAllocationDataForProject[i].resourceId].basicData.role].roleTitle) : "n/a";
                    } else {
                        obj_.allResourceAllocationDataForProject[i]["joiningDate"] = "n/a";
                        obj_.allResourceAllocationDataForProject[i]["role"] = "n/a";
                    }
                    mergedResourcesTable.push(obj_.allResourceAllocationDataForProject[i]);
                }
                let currMonthFteKey = moment().format("MMM_YYYY") + "_fte";
                let queryForAllAssignedResourcesId = `SELECT DISTINCT resourcesTable.resourceId AS staffId FROM ? AS resourcesTable WHERE resourcesTable.resourceType = "Named" AND resourcesTable.${currMonthFteKey} IS NOT NULL`;

                alasql(queryForAllAssignedResourcesId, [mergedResourcesTable], function (assignedResourcesIdsList) {
                    let employeeIdsMap = obj_.employeeList.map((employee) => {
                        return {
                            staffId: employee.staffId
                        }
                    });
                    assignedResourcesIdsList = assignedResourcesIdsList.map((employee) => {
                        return {
                            staffId: employee.staffId
                        }
                    });
                    alasql(`SELECT allEmployeesTable.staffId FROM ? AS allEmployeesTable WHERE staffId NOT IN (SELECT alocatedEmployeesTable.staffId FROM ? AS alocatedEmployeesTable)`, [employeeIdsMap, assignedResourcesIdsList], function (unallocatedStaffs) {
                        unallocatedStaffs = unallocatedStaffs.map((eachRow) => eachRow.staffId);
                        console.log("*********************************");
                        console.log(unallocatedStaffs);
                        ref.unallocatedStaffsList = unallocatedStaffs;
                        ref.fillZeroForUndefinedFteMonths(mergedResourcesTable);
                        let queryForRemovingUnwantedColumns = "SELECT *, CASE WHEN projectOrProspect = 'Project' THEN projectStatus ELSE dealStatus END AS projectOrProspectStatus REMOVE COLUMNS customUniqueIdentifier, dealStatus, projectStatus FROM ? as allResourcesAllocationTable";
                        alasql(queryForRemovingUnwantedColumns, [mergedResourcesTable], function (allResourcesAllocationTable) {
                            let allResourcesAllocationTable_ = [];
                            for (var eachR = 0; eachR < allResourcesAllocationTable.length; eachR++) {
                                if (allResourcesAllocationTable[eachR].resourceType == "Named" && allResourcesAllocationTable[eachR].resourceId && mainPreloaderRef.globalEmployeeMap[allResourcesAllocationTable[eachR].resourceId] && mainPreloaderRef.globalEmployeeMap[allResourcesAllocationTable[eachR].resourceId].state == "Inactive") {
                                    continue;
                                } else {
                                    allResourcesAllocationTable_.push(allResourcesAllocationTable[eachR]);
                                }
                            }
                            obj_.allResourcesAllocationTable = allResourcesAllocationTable_;
                            if (callbackFunction) {
                                callbackFunction();
                            }
                        });
                    });
                });
            },
            function () {
                console.error(arguments);
            }
        );
    } else {
        obj_.productOfProject = [];
        obj_.allResourceAllocationDataForProject = [];
        if (callbackFunction) {
            callbackFunction();
        }
    }
},

renderResourceAllocationView : async function(){
    let ref = LandingPage1675237049110;

    ref.monthKeysList = [];
	let date = moment();
	date.subtract(3,"months");
	for(let i=0; i<14; i++){ // FTE for 12 months from current date + past 3 months from current date
		ref.monthKeysList.push(date.format("MMM_YYYY"));
		date.add(1, "month");
	}
    
    let query = `SELECT employeeName as staffName, grade, gradeId, projectOrProspect, projectOrProspectIdentifier, productIdentifier, projectOrProspectName, projectOrProspectStatus, billableOrNonBillable, resourceId, resourceType, role, joiningDate`;
    for(let eachMonthKey of ref.monthKeysList){
        query += `, ${eachMonthKey}_fte`;
    }
    query += ` FROM ? as resourcesTable WHERE ${moment().format("MMM_YYYY")+"_fte"}`;
    for(let i = 1; i < 6; i++){
        query += ` OR ${moment().add(i,"month").format("MMM_YYYY")+"_fte"}`;
    }
    query += ` <> 0 ORDER BY staffName`;
    alasql(query,[ref.allResourcesAllocationTable],function(output){
        
         for(let i = 0; i < output.length; i++){
            output[i].joiningDate = moment(output[i].joiningDate).format('DD-MMM-YYYY');
        }
        ref.allResourcesData = output;
    });
},





export async function renderResourceAllocationView_old() {
    try {
      const productOfProjectData = await fetchProductOfProjectDetails();
      const { allResourcesAllocationTable } = productOfProjectData;
        
      const monthKeysList: string[] = [];
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() - 3); // Subtract 3 months from the current date
  
      // Generate month keys for the next 14 months (including past 3 months)
      for (let i = 0; i < 14; i++) {
          const month = currentDate.toLocaleString("default", { month: "short" }); // e.g., "Oct"
          const year = currentDate.getFullYear(); // e.g., 2023
          monthKeysList.push(`${month}_${year}`); // e.g., "Oct_2023"
          currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
      }
  
      // Filter resources with non-zero FTE for the current and next 6 months
      const currentMonthKey = new Date().toLocaleString("default", { month: "short" }) + "_" + new Date().getFullYear(); // e.g., "Oct_2023"
      const nextSixMonthsKeys = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() + i + 1);
          return date.toLocaleString("default", { month: "short" }) + "_" + date.getFullYear(); // e.g., "Nov_2023"
      });
  
      const filteredResources = allResourcesAllocationTable.filter((resource) => {
          const hasNonZeroFTE =
              resource[`${currentMonthKey}_fte`] !== 0 ||
              nextSixMonthsKeys.some((monthKey) => resource[`${monthKey}_fte`] !== 0);
          return hasNonZeroFTE;
      });
  
      // Format the output
      const output = filteredResources.map((resource) => {
          const formattedResource: any = {
              staffName: resource.employeeName || "", // Provide a default value if employeeName is undefined
              grade: resource.grade,
              gradeId: resource.gradeId,
              projectOrProspect: resource.projectOrProspect,
              projectOrProspectIdentifier: resource.projectOrProspectIdentifier,
              productIdentifier: resource.productIdentifier,
              projectOrProspectName: resource.projectOrProspectName,
              projectOrProspectStatus: resource.projectOrProspectStatus,
              billableOrNonBillable: resource.billableOrNonBillable,
              resourceId: resource.resourceId,
              resourceType: resource.resourceType,
              role: resource.role,
              joiningDate: new Date(resource.joiningDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
              }), // Format as "DD-MMM-YYYY"
          };
  
          // Add FTE values for each month
          monthKeysList.forEach((monthKey) => {
              formattedResource[`${monthKey}_fte`] = resource[`${monthKey}_fte`] || 0;
          });
  
          return formattedResource;
      });
  
      // Filter out objects with undefined or null staffName
      const validOutput = output.filter((resource) => resource.staffName !== undefined && resource.staffName !== null);
  
      // Sort by staff name
      validOutput.sort((a, b) => a.staffName.localeCompare(b.staffName));
  
      console.log("Resource Allocation View:", validOutput);
      return validOutput;
    } catch (error) {
        console.error("Error rendering Resource Allocation View:", error);
        throw error;
    }
  }


  export async function fetchProductOfProjectDetails_old() {
      try {
          // Fetch project details
          const projectData = await fetchProjectDetails();
          const { allProjectDetails, allProjectStatusMap } = projectData;
  
          // Fetch deal details (if required)
          const dealData = await fetchDealDetails();
          const { allDealBillingMap } = dealData;
  
          const productData = await fetchProductDetails();
          const { allResourceAllocationDataForDeal } = productData
  
          if (!projectSoftwareId) {
              return {
                  productOfProject: [],
                  allResourceAllocationDataForProject: [],
                  allResourcesAllocationTable: [],
              };
          }
  
          // Build the MongoDB where clause
          let mongoWhereClause = null;
          if (allProjectDetails && allProjectDetails.length > 0) {
              const projectIdentifiers = allProjectDetails
                  .map((project) => project.projectIdentifier)
                  .join("' || this.Data.projectIdentifier == '");
              mongoWhereClause = `this.Data.projectIdentifier == '${projectIdentifiers}'`;
          }
  
          // Fetch product of project instances
          const productOfProjectInsData = await getMyInstancesV2({
              softwareId: projectSoftwareId,
              processName: "Product of Project",
              predefinedFilters: { taskName: "View State" },
              mongoWhereClause,
          });
  
          // Initialize objects to store product of project details
          const productOfProject = [];
          const allResourceAllocationDataForProject = [];
  
          // Process the fetched product of project data
          if (productOfProjectInsData && productOfProjectInsData.length > 0) {
              productOfProjectInsData.forEach((productInstance) => {
                  const productData = productInstance.data;
                  productOfProject.push(productData);
  
                  // Process resource allocation data
                  if (productData.resourceDataWithAllocation && Array.isArray(productData.resourceDataWithAllocation)) {
                      const resourceAllocationMap = {};
                      productData.resourceDataWithAllocation.forEach((resource) => {
                          const resourceCopy = JSON.parse(JSON.stringify(resource));
                          for (const monthKey in resource.allocation) {
                              resourceCopy[`${monthKey}_fte`] = parseFloat(resource.allocation[monthKey]);
                          }
                          resourceCopy.grade = gradeDetails[resource.gradeId]?.grade || null;
                          resourceCopy.projectOrProspectIdentifier = productData.projectIdentifier;
                          resourceCopy.projectOrProspectName = productData.projectName;
                          resourceCopy.projectOrProspect = productData.parentDealId ? "Change" : "Project";
                          resourceCopy.projectStatus = allProjectStatusMap[productData.projectIdentifier] || productData.projectStatus;
                          resourceCopy.billableOrNonBillable = allDealBillingMap[productData.projectIdentifier] || "Billable";
                          resourceCopy.productIdentifier = productData.productIdentifier;
                          resourceCopy.customUniqueIdentifier = `${resource.resourceId}_${productData.productIdentifier}`;
                          delete resourceCopy.allocation;
                          resourceAllocationMap[resource.resourceId] = resourceCopy;
                      });
                      allResourceAllocationDataForProject.push(...Object.values(resourceAllocationMap));
                  }
              });
          }
  
          // Merge resource allocation data from deals and projects
          //const mergedResourcesTable = [...allResourceAllocationDataForDeal, ...allResourceAllocationDataForProject];
          const mergedResourcesTable = [...allResourceAllocationDataForProject];
  
          // Filter out inactive or unwanted resources
          const allResourcesAllocationTable = mergedResourcesTable.filter((resource) => {
              return resource.resourceType !== "Generic" && !(resource.resourceType === "Named" && globalEmployeeMap[resource.resourceId]?.state === "Inactive");
          });
  
          // Return the processed data
          return {
              productOfProject,
              allResourceAllocationDataForProject,
              allResourcesAllocationTable,
          };
      } catch (error) {
          console.error("Error fetching Product of Project data:", error);
          throw error;
      }
  }