import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { gradeDetailsMap } from "../utils/createGradeMap/gradeDetails";
import { createEmployeeMap } from "../utils/createEmployeeMap/globalEmployeeMap";
import { getAccountIdWiseAccountDetails } from "../utils/accountIdWiseMap/accountMap";
import moment from "moment";

const projectSoftwareId = await getSoftwareIdByNameVersion("Project Management", "1");
const salesSoftwareId = await getSoftwareIdByNameVersion("Sales CRM", "1");
const gradeDetails = await gradeDetailsMap();
const globalEmployeeMap = await createEmployeeMap();
const accountIdWiseAccountMap = await getAccountIdWiseAccountDetails();

export async function fetchHeadcountDetails() {
  const headcountsMap: Record<string, number> = {};
  let date = moment();
  for (let i = 0; i < 12; i++) {
    headcountsMap[date.format("MMM_YYYY")] = Object.keys(globalEmployeeMap).length;
    date.add(1, "month");
  }
  
  return headcountsMap;
}


export async function getEmployeesDetails() {
  const filterEmployees = new Set([
    "KD130602", // Farouk Said
    "KA071101", // Nirupam Patra
    "K2002053", // Mukul Dey
    "K2002052", // Ujjal Sardar
    "K2207076", // Debasish Hens
  ]);

  // Filter employees who are "Active" and NOT in filterEmployees list
  const allActiveEmployeesList = Object.values(globalEmployeeMap).filter(
    (employee) => employee.state === "Active" && !filterEmployees.has(employee.employeeIdentifier)
  );
  const activeEmployeesSet = new Set<string>();

  const employeeList = allActiveEmployeesList.map((eachEmpData) => {
    activeEmployeesSet.add(eachEmpData.employeeIdentifier);

    return {
      fullName: eachEmpData.employeeName,
      email: eachEmpData.email,
      orgEmail: eachEmpData.orgEmail,
      staffId: eachEmpData.employeeIdentifier,
      state: eachEmpData.state,
    };
  });
  return { employeeList, activeEmployeesSet };
}


export async function fetchLeadDetails() {
  try {
    if (!salesSoftwareId) {
      return {
        leadDetails: {},
      };
    }

    const leadInsData = await getMyInstancesV2<any>({
      softwareId: salesSoftwareId,
      processName: "Leads Pipeline",
      predefinedFilters: { taskName: "View State" },
    });

    const leadDetails: Record<string, any> = {};
    if (Array.isArray(leadInsData) && leadInsData.length > 0) {
      leadInsData.forEach((leadInstance) => {
        if (leadInstance?.data?.leadIdentifier) { // this particular condition is added 
          leadDetails[leadInstance.data.leadIdentifier] = leadInstance.data;
        }
      });
    }

    return { leadDetails };
  } catch (error) {
    console.error("Error fetching Lead data:", error);
    throw error;
  }
}


export async function fetchDealDetails() {
  try {
    if (!salesSoftwareId) {
      return {
        allDealDetails: [],
        dealIdWiseDetailsMap: {},
        allDealStatusMap: {},
        allDealBillingMap: {},
        inProgressDealDetails: [],
      };
    }

    // Fetch lead details
    const leadData = await fetchLeadDetails();
    const { leadDetails } = leadData;

    // Fetch deal instances
    const dealInsData = await getMyInstancesV2<any>({
      softwareId: salesSoftwareId,
      processName: "Deal",
      predefinedFilters: { taskName: "View State" },
    });

    // Initialize data structures
    const allDealDetails: any[] = [];
    const dealIdWiseDetailsMap = {};
    const allDealStatusMap = {};
    const allDealBillingMap = {};
    const inProgressDealDetails: any[] = [];

    // Process the fetched deal data
    if (Array.isArray(dealInsData) && dealInsData.length > 0) {
      dealInsData.forEach((dealInstance) => {
        const dealData = dealInstance.data;

        // Determine account name
        if (dealData.accountIdentifier) {
          dealData.accountName = accountIdWiseAccountMap[dealData.accountIdentifier]?.accountName ?? "n/a";
        } else if (dealData.accountDetails) {
          dealData.accountName = dealData.accountDetails?.accountName ?? "n/a";
        } else {
          dealData.accountName = "n/a";
        }

        // Determine client name and country
        if (dealData.leadIdentifier && leadDetails[dealData.leadIdentifier]) {
          dealData.clientName = leadDetails[dealData.leadIdentifier].organisationDetails?.organisationName ?? "n/a";
          dealData.country = leadDetails[dealData.leadIdentifier].organisationDetails?.country ?? "n/a";
        } else if (dealData.dealStatus === "Won" && dealData.accountDetails) {
          dealData.clientName = dealData.accountDetails?.accountName ?? "n/a";
        } else {
          dealData.clientName = "n/a";
        }

        // Track in-progress deals
        if (dealData.dealStatus !== "Won" && dealData.dealStatus !== "Lost") {
          if (dealData && typeof dealData === "object") {
            inProgressDealDetails.push({ ...dealData });
          }
        }

        // Store deal data
        allDealDetails.push(dealData);
        allDealStatusMap[dealData.dealIdentifier] = dealData.dealStatus;
        allDealBillingMap[dealData.dealIdentifier] = dealData.isDebtRevenue ? "Non Billable" : "Billable";
        dealIdWiseDetailsMap[dealData.dealIdentifier] = dealData;
      });
    }

    return { allDealDetails, dealIdWiseDetailsMap, allDealStatusMap, allDealBillingMap, inProgressDealDetails };
  } catch (error) {
    console.error("Error fetching Deal data:", error);
    throw error;
  }
}


export async function fetchProductDetails() {
  try {
      const dealData = await fetchDealDetails();
      const { allDealDetails, allDealStatusMap, allDealBillingMap } = dealData;

      if (!salesSoftwareId) {
          return {
              productDetails: [],
              dealIdWiseResource: {},
              allResourceAllocationDataForDeal: [],
          };
      }

      // Build the MongoDB where clause
      let mongoWhereClause = "(this.Data.productType == 'Professional Service')";
      if (allDealDetails?.length > 0) {
          const dealIdentifiers = allDealDetails
              .map((deal) => deal.dealIdentifier)
              .join("' || this.Data.dealIdentifier == '");
          mongoWhereClause += ` && (this.Data.dealIdentifier == '${dealIdentifiers}')`;
      }

      // Fetch product instances
      const productInsData = await getMyInstancesV2<any>({
          softwareId: salesSoftwareId,
          processName: "Product",
          predefinedFilters: { taskName: "View State" },
          mongoWhereClause: mongoWhereClause,
      });

      // Initialize objects to store product details and allocations
      const productDetails: any[] = [];
      const allResourceAllocationDataForDeal: any[] = [];
      const dealIdWiseResource = {};

      // Process fetched product data
      productInsData?.forEach((productInstance) => {
          const productData = productInstance.data;
          productDetails.push(productData);

          // Initialize dealIdWiseResource mapping
          if (!dealIdWiseResource[productData.dealIdentifier]) {
              dealIdWiseResource[productData.dealIdentifier] = {};
          }

          // Process resource allocation data
          if (Array.isArray(productData.resourceDataWithAllocation)) {
              const resourceAllocationMap = {};

              productData.resourceDataWithAllocation.forEach((resource) => {
                  // Store billable status
                  dealIdWiseResource[productData.dealIdentifier][resource.resourceId] = allDealBillingMap[productData.dealIdentifier] ?? "Billable";

                  let resourceCopy = resourceAllocationMap[resource.resourceId] || { ...resource };

                  // Sum up FTE values for each month
                  for (const monthKey in resource.allocation) {
                      resourceCopy[`${monthKey}_fte`] = (resourceCopy[`${monthKey}_fte`] || 0) + parseFloat(resource.allocation[monthKey]);
                  }

                  // Add additional fields
                  resourceCopy.grade = gradeDetails[resource.gradeId]?.grade || null;
                  resourceCopy.projectOrProspectIdentifier = productData.dealIdentifier;
                  resourceCopy.projectOrProspectName = productData.dealName;
                  resourceCopy.projectOrProspect = productData.parentDealId ? "Change" : "Prospect";
                  resourceCopy.dealStatus = allDealStatusMap[productData.dealIdentifier] ?? productData.dealStatus;
                  resourceCopy.billableOrNonBillable = allDealBillingMap[productData.dealIdentifier] ?? "Billable";
                  resourceCopy.productIdentifier = productData.productIdentifier;
                  resourceCopy.customUniqueIdentifier = `${resource.resourceId}_${productData.productIdentifier}`;

                  delete resourceCopy.allocation;
                  resourceAllocationMap[resource.resourceId] = resourceCopy;
              });

              // Exclude deals with status "Won" or "Lost"
              if (allDealStatusMap[productData.dealIdentifier] !== "Won" && allDealStatusMap[productData.dealIdentifier] !== "Lost") {
                  allResourceAllocationDataForDeal.push(...Object.values(resourceAllocationMap));
              }
          }
      });

      return {
          productDetails,
          dealIdWiseResource,
          allResourceAllocationDataForDeal,
      };
  } catch (error) {
      console.error("Error fetching Product data:", error);
      throw error;
  }
}


export async function fetchProjectDetails() {
    try {
        if (!projectSoftwareId) {
            return {
                allProjectDetails: [],
                allProjectStatusMap: {},
            };
        }

        // Fetch project instances
        const projectInsData = await getMyInstancesV2<any>({
            softwareId: projectSoftwareId,
            processName: "Project",
            predefinedFilters: { taskName: "View State" },
        });

        // Initialize objects to store project details
        const allProjectDetails: any[] = [];
        const allProjectStatusMap = {};

        // Process the fetched project data
        projectInsData?.forEach((projectInstance) => {
            const projectData = projectInstance.data;

            // Add project data to the array
            allProjectDetails.push(projectData);

            // Map project status
            allProjectStatusMap[projectData.projectIdentifier] = projectData.projectStatus;
        });

        // Return the processed data
        return {
            allProjectDetails,
            allProjectStatusMap,
        };
    } catch (error) {
        console.error("Error fetching Project data:", error);
        throw error;
    }
}

export async function fetchProductOfProjectDetails() {
  try {
      // Fetch required data
      const projectData = await fetchProjectDetails();
      const { allProjectDetails, allProjectStatusMap } = projectData;
      const employeeDetails = await getEmployeesDetails();
      const { employeeList } = employeeDetails;
      const dealData = await fetchDealDetails();
      const { allDealBillingMap } = dealData;
      const productData = await fetchProductDetails();
      const { allResourceAllocationDataForDeal } = productData;

      if (!projectSoftwareId) {
          return {
              productOfProject: [],
              allResourceAllocationDataForProject: [],
              allResourcesAllocationTable: [],
              unallocatedStaffsList: []
          };
      }

      // Construct MongoDB where clause
      let mongoWhereClause = null;
      if (allProjectDetails.length) {
          mongoWhereClause = `this.Data.projectIdentifier == '${allProjectDetails.map((project) => project.projectIdentifier).join("' || this.Data.projectIdentifier == '")}'`;
      }

      // Fetch product of project instances
      const productOfProjectInsData = await getMyInstancesV2<any>({
          softwareId: projectSoftwareId,
          processName: "Product of Project",
          predefinedFilters: { taskName: "View State" },
          mongoWhereClause: mongoWhereClause,
      });

      const productOfProject = productOfProjectInsData?.length
          ? productOfProjectInsData.map((productInstance) => productInstance.data)
          : [];

      let allResourceAllocationDataForProject = [];

      for (const eachProduct of productOfProject) {
          if (eachProduct.resourceDataWithAllocation) {
              let resourceAllocationMap = {};
              for (const eachResource of eachProduct.resourceDataWithAllocation) {
                  let resource = resourceAllocationMap[eachResource.resourceId] || { ...eachResource };

                  for (const eachMonthKey in eachResource.allocation) {
                      resource[`${eachMonthKey}_fte`] =
                          (resource[`${eachMonthKey}_fte`] || 0) + parseFloat(eachResource.allocation[eachMonthKey]);
                  }

                  resource.projectOrProspectIdentifier = eachProduct.projectIdentifier;
                  resource.projectOrProspectName = eachProduct.projectName;
                  resource.projectOrProspect = eachProduct.parentDealId ? "Change" : "Project";
                  resource.projectStatus = allProjectStatusMap[eachProduct.projectIdentifier];
                  resource.billableOrNonBillable = allDealBillingMap[eachProduct.projectIdentifier]?.[eachResource.resourceId];
                  resource.productIdentifier = eachProduct.productIdentifier;
                  resource.customUniqueIdentifier = `${resource.resourceId}_${eachProduct.productIdentifier}`;

                  delete resource.allocation;
                  resourceAllocationMap[resource.resourceId] = resource;
              }
              allResourceAllocationDataForProject.push(...Object.values(resourceAllocationMap));
          }
      }

      let mergedResourcesTable = [...allResourceAllocationDataForDeal, ...allResourceAllocationDataForProject].filter(resource => {
          if (resource.resourceType === "Generic") return false;
          if (resource.resourceType === "Named" && globalEmployeeMap[resource.resourceId]) {
              resource.joiningDate = globalEmployeeMap[resource.resourceId]?.basicData?.joiningDate
                  ? new Date(globalEmployeeMap[resource.resourceId].basicData.joiningDate).toISOString().split('T')[0]
                  : "n/a";
          } else {
              resource.joiningDate = "n/a";
          }
          return !(globalEmployeeMap[resource.resourceId]?.state === "Inactive"); // Ensure inactive employees are removed
      });

      // Identify unallocated staff
      const currMonthFteKey = new Date().toLocaleString('default', { month: 'short', year: 'numeric' }).replace(' ', '_') + "_fte";
      const assignedResourcesIds = mergedResourcesTable
          .filter(resource => resource.resourceType === "Named" && resource[currMonthFteKey] !== undefined)
          .map(resource => resource.resourceId);

      const allEmployeeIds = employeeList.map(emp => emp.staffId);
      const unallocatedStaffsList = allEmployeeIds.filter(empId => !assignedResourcesIds.includes(empId));

      // Fill zero for undefined FTE months
      mergedResourcesTable.forEach(resource => {
          if (!resource[currMonthFteKey]) {
              resource[currMonthFteKey] = 0;
          }
      });

      // Remove unwanted columns
      mergedResourcesTable = mergedResourcesTable.map(resource => {
          const { customUniqueIdentifier, dealStatus, projectStatus, ...filteredResource } = resource;
          filteredResource.projectOrProspectStatus = filteredResource.projectOrProspect === "Project"
              ? projectStatus
              : dealStatus;
          return filteredResource;
      });

      // Filter out completed projects
      let allResourcesAllocationTable = mergedResourcesTable.filter(resource => resource.projectOrProspectStatus !== "Completed");

      return {
          productOfProject,
          allResourceAllocationDataForProject,
          allResourcesAllocationTable,
          unallocatedStaffsList,
      };
  } catch (error) {
      console.error("Error fetching Product of Project data:", error);
      throw error;
  }
}


export async function renderResourceAllocationView() {
  const productOfProjectData = await fetchProductOfProjectDetails();
  const { allResourcesAllocationTable } = productOfProjectData;
  console.log("allResourcesAllocationTable ---- ", allResourcesAllocationTable);         //431

  const monthKeysList: string[] = [];
  let date = new Date();
  date.setMonth(date.getMonth() - 3);
  
  for (let i = 0; i < 14; i++) { // FTE for 12 months from current date + past 3 months
      monthKeysList.push(date.toLocaleString('en-US', { month: 'short', year: 'numeric' }).replace(' ', '_'));
      date.setMonth(date.getMonth() + 1);
  }
  
  let currentMonthFteKey = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }).replace(' ', '_') + "_fte";
  let filterKeys = [currentMonthFteKey];
  
  for (let i = 1; i < 6; i++) {
      let futureMonthKey = new Date();
      futureMonthKey.setMonth(futureMonthKey.getMonth() + i);
      filterKeys.push(futureMonthKey.toLocaleString('en-US', { month: 'short', year: 'numeric' }).replace(' ', '_') + "_fte");
  }
  
  let filteredData = allResourcesAllocationTable.filter(resource => 
      filterKeys.some(key => resource[key] && resource[key] !== 0)
  );
  
  for (let resource of filteredData) {
      resource.joiningDate = resource.joiningDate ? new Date(resource.joiningDate).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric'
      }) : "n/a";
  }
  
  return { filteredData, monthKeysList };
}

export async function getUploadedData() {
    const upldResourceInsData = await getMyInstancesV2<any>({
      processName: "Uploaded Resource Data",
      predefinedFilters: { taskName: "View Resource" },
  });
  const uploadResouceData = upldResourceInsData[0].data.resourceDetailsObj;
  return uploadResouceData;
}
