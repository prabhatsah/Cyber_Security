// components/ExcelGenerator.js
"use client";

import * as XLSX from "xlsx";
import { Button } from "@/shadcn/ui/button";
import { toast } from "sonner";
import { Finding } from "../../../../(common-types)/types";

export default function ExcelGenerator({
  allFindings,
  loading,
  frameworkName,
}: {
  allFindings: Finding[];
  loading: boolean;
  frameworkName: string;
}) {
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

  return (
    <Button
      onClick={downloadExcel}
      variant="outline"
      className="ml-2"
      type="button"
      disabled={loading}
    >
      Download Excel Template
    </Button>
  );
}
