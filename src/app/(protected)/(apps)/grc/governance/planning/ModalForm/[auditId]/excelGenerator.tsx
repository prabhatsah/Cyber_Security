// components/ExcelGenerator.js
"use client";

import * as XLSX from "xlsx";
import { Button } from "@/shadcn/ui/button";
import { toast } from "sonner";
import { Finding } from "../../../../(common-types)/types";

// importing for excelJs
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import conformityData from './meetingObservation'
import { useEffect, useState } from "react";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";


export default function ExcelGenerator({
  allFindings,
  loading,
  frameworkName,
  userIdNameMap,
}: {
  allFindings: Finding[];
  loading: boolean;
  frameworkName: string;
  userIdNameMap: { value: string; label: string }[];
}) {

  const [userMap, setUserMap] = useState<{ value: string; label: string, userId: string }[]>([]);
  useEffect(() => {
    const allUserDetailMap = async () => {
      try {
        const userDetailsMap = await getUserIdWiseUserDetailsMap();
        debugger
        const userMapObj = Object.values(userDetailsMap)
          .filter((user) => user.userActive)
          .map((activeUser) => {
            return ({
              label: activeUser.userName ?? "",
              value: activeUser.userLogin ?? "",
              userId: activeUser.userId ?? "",
            })
          });
        setUserMap(userMapObj);
      } catch (error) {
        console.log(error)
      } finally {
        console.log("User details fetced successfully login id wise", userMap);
      }
    }

    allUserDetailMap();
  }, [])

  const downloadExcel = () => {
    try {
      const uniqueCombinations = new Map();

      // Process findings to get unique combinations
      allFindings.forEach((finding: Finding) => {
        const key = `${finding.controlId}-${finding.controlObjId}`;
        if (!uniqueCombinations.has(key)) {
          uniqueCombinations.set(key, {
            Framework: frameworkName,
            "Control Policy ID": finding.controlId,
            "Control Policy Name": finding.controlName,
            "Control Objective ID": finding.controlObjId,
            "Control Objective": finding.controlObjective,
            "Observation ID": "",
            Observation: "",
            "Non Conformity": "",
            Recommendation: "",
            "Owner Name": "",
            "Due Date": "",
          });
        }
      });

      // Convert the map values to an array
      const excelData = Array.from(uniqueCombinations.values());
      debugger;
      console.log("Excel Data:", excelData);

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Findings");

      worksheet["!cols"] = [
        { wch: 15 }, // Framework
        { wch: 10 }, // Control Policy ID
        { wch: 25 }, // Control Policy Name
        { wch: 15 }, // Control Objective ID
        { wch: 35 }, // Control Objective
        { wch: 15 }, // Observation ID
        { wch: 35 }, // Observation
        { wch: 15 }, // Non Conformity
        { wch: 35 }, // Recommendation
        { wch: 15 }, // Owner Name
        { wch: 15 }, // Due Date
      ];

      // Generate Excel file
      XLSX.writeFile(workbook, "FindingsTemplate.xlsx");
      toast.success(
        "Excel template downloaded successfully for this finding!",
        {
          duration: 4000, // 4 seconds
        }
      );
    } catch (error) {
      toast.error("Error generating Excel!", {
        duration: 4000, // 4 seconds
      });
      console.error("Error generating Excel:", error);
    }
  };

  const downloadTestExcel2 = async () => {
    const uniqueCombinations = new Map();
    // Process findings to get unique combinations
    allFindings.forEach((finding: Finding) => {
      const key = `${finding.controlId}-${finding.controlObjId}`;
      if (!uniqueCombinations.has(key)) {
        uniqueCombinations.set(key, {
          Framework: frameworkName,
          "Control Policy ID": finding.controlId,
          "Control Policy Name": finding.controlName,
          "Control Objective ID": finding.controlObjId,
          "Control Objective": finding.controlObjective,
          "Observation ID": "",
          Observation: "",
          "Non Conformity": conformityData,
          Recommendation: "",
          "Due Date": "",
          "Owner Name": userIdNameMap,
        });
      }
    });

    // Convert the map values to an array
    const excelData = Array.from(uniqueCombinations.values());
    debugger;
    console.log("Excel Data:", excelData);
    // Sample JSON data
    const jsonData = [
      { name: "John", role: "Admin" },
      { name: "Jane", role: "User" },
      { name: "Doe", role: "Guest" }
    ];

    const dropdownOptions = ["Admin", "User", "Guest", "Super Admin"];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.addRow(["Name", "Role"]);

    // Add data rows
    jsonData.forEach(item => {
      worksheet.addRow([item.name, item.role]);
    });
    // Add dropdown for the Role column
    const totalRows = jsonData.length + 1;

    for (let i = 2; i <= totalRows; i++) {
      worksheet.getCell(`B${i}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${dropdownOptions.join(",")}"`], // Excel formula list as a string
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: "Invalid Role",
        error: "Please select a role from the list."
      };
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    saveAs(blob, "UsersTemplate.xlsx");
    toast.success("Excel template downloaded successfully!")
  }

  const downloadTestExcel = async () => {
    const uniqueCombinations = new Map();

    // Step 1: Build data rows for Excel
    allFindings.forEach((finding: Finding) => {
      const key = `${finding.controlId}-${finding.controlObjId}`;
      if (!uniqueCombinations.has(key)) {
        uniqueCombinations.set(key, {
          Framework: frameworkName,
          "Control Policy ID": finding.controlId,
          "Control Policy Name": finding.controlName,
          "Control Objective ID": finding.controlObjId,
          "Control Objective": finding.controlObjective,
          "Observation ID": "",
          Observation: "",
          "Non Conformity": "",
          Recommendation: "",
          "Due Date": "",
          "Owner Name": "" // dropdown column
        });
      }
    });

    const excelData = Array.from(uniqueCombinations.values());

    // Step 2: Setup workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Audit Data");

    // Step 3: Generate headers and add to worksheet
    const headers = Object.keys(excelData[0]);
    worksheet.addRow(headers);

    // we have to set the width of the columns
    worksheet.columns = [
      { header: "Framework", width: 20 },
      { header: "Control Policy ID", width: 20 },
      { header: "Control Policy Name", width: 30 },
      { header: "Control Objective ID", width: 20 },
      { header: "Control Objective", width: 30 },
      { header: "Observation ID", width: 20 },
      { header: "Observation", width: 30 },
      { header: "Non Conformity", width: 40 },
      { header: "Recommendation", width: 40 },
      { header: "Due Date", width: 20 },
      { header: "Owner Name", width: 50 },
    ];

    // do styling to the headers
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // white text
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '#ff264398' }, // blue fill
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });


    // Step 4: Add data rows safely to avoid ExcelJS errors
    excelData.forEach(item => {
      const rowValues = headers.map(header => {
        const val = item[header];
        if (val === undefined || val === null) return "";
        if (typeof val === "object") return JSON.stringify(val);
        return val;
      });
      worksheet.addRow(rowValues);
    });

    // add dropdown options to non comformity
    const conformityData = [
      { value: "Major Nonconformity", label: "Major Nonconformity" },
      { value: "Minor Nonconformity", label: "Minor Nonconformity" },
      { value: "Conforms", label: "Conforms" },
      { value: "Recommendation", label: "Recommendation" },
    ];
    const nonConformityColIndex = headers.indexOf("Non Conformity") + 1;
    const nonConformityOptions = conformityData.map((item) => item.label);
    for (let rowIndex = 2; rowIndex <= excelData.length + 1; rowIndex++) {
      worksheet.getCell(rowIndex, nonConformityColIndex).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${nonConformityOptions.join(",")}"`], // Excel formula list as a string
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: "Invalid Non Conformity",
        error: "Please select a non conformity from the list."
      };
    }


    const dropdownDisplayOptions = userMap.map((user: { label: string, value: string }) => {
      return user.label + "(" + user.value + ")";
    })
    const ownerColIndex = headers.indexOf("Owner Name") + 1;

    // Step 1: Create hidden sheet
    const hiddenSheet = workbook.addWorksheet("HiddenLists");
    hiddenSheet.state = 'veryHidden';

    // Step 2: Add dropdown values
    // dropdownDisplayOptions.forEach((val, index) => {
    //   hiddenSheet.getCell(`A${index + 1}`).value = val;
    // });

    hiddenSheet.getCell("A1").value = "label";
    hiddenSheet.getCell("B1").value = "value";

    userMap.forEach((user, index) => {
      hiddenSheet.getCell(`A${index + 2}`).value = `${user.label}(${user.value})`; // Label
      hiddenSheet.getCell(`B${index + 2}`).value = user.userId; // UserId
    });

    // Step 3: Set data validation using reference
    // const formulaRange = `=HiddenLists!$A$1:$A$${dropdownDisplayOptions.length}`;
    const formulaRange = `=HiddenLists!$A$1:$A$${userMap.length}`;

    for (let rowIndex = 2; rowIndex <= excelData.length + 1; rowIndex++) {
      worksheet.getCell(rowIndex, ownerColIndex).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [formulaRange],
        showErrorMessage: true,
        errorStyle: "error",
        errorTitle: "Invalid Selection",
        error: "Please select a valid owner from the list.",
      };
    }


    // Step 7: Generate Excel file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    debugger;
    saveAs(blob, "AuditTemplate.xlsx");
    toast.success("Excel template downloaded successfully!");
  };

  // This is the button to download the excel template
  return (
    <Button
      onClick={downloadTestExcel}
      variant="outline"
      className="ml-2"
      type="button"
      disabled={loading}
    >
      Download Excel Template
    </Button>
  );
}
