"use client";
import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/ikon/components/data-table";
import {
  getMyInstancesV2,
  getParameterizedDataForTaskId,
} from "@/ikon/utils/api/processRuntimeService";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";

interface empData {
  id: string;
  employeeIdentifier: string;
  employeeName: string;
  role: string;
  grade: string;
  email: string;
  orgEmail: string;
}

function EmployeeDataTable() {
  const [empTableData, setEmpTableData] = useState<empData[]>([]);
  const [roleData, setRoleData] = useState({});
  const [gradeData, setGradeData] = useState({});
  const [startInsEmp, setStartInsEmp] = useState(false);

  const fetchEmpTableData = async () => {
    try {
      const softwareId = await getSoftwareIdByNameVersion("Base App", "1");

      console.log("software id ", softwareId);
      const empTableInstances = await getMyInstancesV2({
        softwareId: softwareId,
        processName: "API Connections",
        predefinedFilters: {
          taskName: "View Connection",
        },
        mongoWhereClause: `this.Data.connectorId == "1727680018153"`,
      });

      var taskId = empTableInstances[0]?.taskId;

      const empTableData = await getParameterizedDataForTaskId({
        taskId: taskId,
        parameters: {},
      });
      var empTableInstanceData = empTableData?.employeeDetails;
      console.log("employee table...", empTableInstanceData);

      const uploadedFileInstances = await getMyInstancesV2({
        processName: "File Upload For Employee Info Table",
        projections: ["Data.employeeDetailsObj"],
      });
      const uploadedEmployeeData =
        uploadedFileInstances[0]?.data?.employeeDetailsObj || {};
      const uploadedEmployeeArray = Object.values(uploadedEmployeeData);

      console.log("Uploaded Employee Array", uploadedEmployeeArray);

      if (uploadedEmployeeArray.length > 0) {
        setStartInsEmp(true);
      }

      const empMetadataInstances = await getMyInstancesV2({
        processName: "Employee Details Metadata",
        predefinedFilters: {
          taskName: "Edit Employee Details",
        },
      });
      let empInsMetadata: any[] = []
      if (empMetadataInstances.length > 0) {
        empInsMetadata =
          Object.values(empMetadataInstances[0]?.data?.employeeDetails) || {};
        console.log("Emp ins metadata.....", empInsMetadata);
      }

      const filteredEmpTableData = empTableInstanceData.filter(
        (instance: { state: string }) => instance.state === "Active"
      );

      console.log("Filtered Employee Table Data...", filteredEmpTableData);

      const mergedEmployeeData = [
        ...filteredEmpTableData,
        ...empInsMetadata,
      ].map((instance) => {
        return {
          id: instance.employeeIdentifier,
          employeeIdentifier: instance.employeeIdentifier,
          employeeName: instance.employeeName,
          role: instance.role,
          grade: instance.grade,
          email: instance.email,
          orgEmail: instance.orgEmail,
        };
      });

      console.log("new Table data", mergedEmployeeData);

      setEmpTableData(mergedEmployeeData);

      const roleData = await getMyInstancesV2({
        processName: "HRMS - Roles",
        predefinedFilters: {
          taskName: "View",
        },
      });

      console.log("Role Data ", roleData[0]?.data);
      setRoleData(roleData[0]?.data);

      const gradeData = await getMyInstancesV2({
        processName: "Grade",
        predefinedFilters: {
          taskName: "View State",
        },
      });

      console.log("Grade Data ", gradeData[0]?.data?.gradeDetails);
      setGradeData(gradeData[0]?.data?.gradeDetails);
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };

  const getRoleTitle = (role: string) => {
    return roleData[role]?.roleTitle || "Role not found";
  };

  const getGradeTitle = (grade: string) => {
    return gradeData[grade]?.grade || "Grade not found";
  };

  useEffect(() => {
    fetchEmpTableData();
  }, []);

  const columns: ColumnDef<empData>[] = [
    {
      accessorKey: "employeeIdentifier",
      header: () => <div style={{ textAlign: "center" }}>Employee ID</div>,
      cell: ({ row }) => (
        <span>{row.original?.employeeIdentifier || "n/a"}</span>
      ),
    },
    {
      accessorKey: "employeeName",
      header: () => <div style={{ textAlign: "center" }}>Employee Name</div>,
      cell: ({ row }) => <span>{row.original?.employeeName || "n/a"}</span>,
    },
    {
      accessorKey: "role",
      header: () => <div style={{ textAlign: "center" }}>Role</div>,
      cell: ({ row }) => {
        return <span>{getRoleTitle(row?.original?.role) || "n/a"}</span>;
      },
    },
    {
      accessorKey: "grade",
      header: () => <div style={{ textAlign: "center" }}>Grade</div>,
      cell: ({ row }) => {
        return <span>{getGradeTitle(row.original?.grade) || "n/a"}</span>;
      },
    },
    {
      accessorKey: "email",
      header: () => <div style={{ textAlign: "center" }}>Email</div>,
      cell: ({ row }) => {
        return <span>{row.original?.email || "n/a"}</span>;
      },
    },
    {
      accessorKey: "orgEmail",
      header: () => (
        <div style={{ textAlign: "center" }}>Organization Email</div>
      ),
      cell: ({ row }) => {
        return <span>{row.original?.orgEmail || "n/a"}</span>;
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={empTableData} />
    </>
  );
}

export default EmployeeDataTable;
