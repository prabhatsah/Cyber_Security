import React from 'react'
import EmployeeDetailsDataTable from './components/employeeDetailsTtable'
import { getSoftwareIdByNameVersion } from '@/ikon/utils/actions/software';
import { getMyInstancesV2, getParameterizedDataForTaskId } from '@/ikon/utils/api/processRuntimeService';




export default async function page() {


    const roleData = await getMyInstancesV2({
        processName: "HRMS - Roles",
        predefinedFilters: {
            taskName: "View",
        },
    });

    const gradeData = await getMyInstancesV2({
        processName: "Grade",
        predefinedFilters: {
            taskName: "View State",
        },
    });

    const softwareId = await getSoftwareIdByNameVersion("Base App", "1");

    console.log("software id ", softwareId);
    const empTableInstances = await getMyInstancesV2({
        softwareId: softwareId,
        processName: "API Connections",
        predefinedFilters: {
            taskName: "View Connection",
        },
        mongoWhereClause: `this.Data.connectorId == "1727779632823"`,
    });

    var taskId = empTableInstances[0]?.taskId;

    const empTableData = await getParameterizedDataForTaskId({
        taskId: taskId,
        parameters: {},
    });
    var empTableInstanceData = empTableData?.employeeDetails;

    console.log("employee table...", empTableInstanceData);

    const filteredEmpTableData = empTableInstanceData.filter(
        (instance: { state: string }) => instance.state === "Active"
    );

    const uploadedFileInstances = await getMyInstancesV2({
        processName: "File Upload For Employee Info Table",
        projections: ["Data.employeeDetailsObj"],
    });
    const uploadedEmployeeData = uploadedFileInstances[0]?.data?.employeeDetailsObj || {};
    const uploadedEmployeeArray = Object.values(uploadedEmployeeData);

    console.log("Uploaded Employee Array", uploadedEmployeeArray);

    const empMetadataInstances = await getMyInstancesV2({
        processName: "Employee Details Metadata",
        predefinedFilters: {
            taskName: "Edit Employee Details",
        },
    })
    let empInsMetadata = []

    if (empMetadataInstances.length > 0) {
        empInsMetadata =
            Object.values(empMetadataInstances[0]?.data?.employeeDetails) || {};
        console.log("Emp ins metadata.....", empInsMetadata);
    }


    return (
        <div className="w-full h-full">
            <EmployeeDetailsDataTable roleDatas={roleData} gradeDatas={gradeData} filteredEmpTableData={filteredEmpTableData} empInsMetadata={empInsMetadata} uploadedEmployeeArray={uploadedEmployeeArray}/>
        </div>
    )
}
