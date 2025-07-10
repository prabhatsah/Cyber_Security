"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { AddControlDialog } from "../components/controls/add-control-dialog";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import ControlDataTable from "../components/controls/control-datatable";
import ProgressForm from "../components/controls/ProgressForm";

export default function ControlsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState<any[]>([]); // State to hold the data for the table

  // Calculate status counts
  const statusCounts = tableData.reduce(
    (counts, control) => {
      if (control.status === "Published") counts.Published += 1;
      else if (control.status === "Review") counts.Review += 1;
      else if (control.status === "Approval") counts.Approval += 1;
      else if (control.status === "Draft") counts.Draft += 1;
      return counts;
    },
    { Published: 0, Review: 0, Approval: 0, Draft: 0 }
  );

  // Fetch data from the API
  const fetchProfileData = async () => {
    try {
      const controlObjInsData = await getMyInstancesV2<any>({
        processName: "Control Objective",
        predefinedFilters: { taskName: "view control objecitve" },
        projections: ["Data"],
      });

      const controlObjData = controlObjInsData.map((e: any) => e.data);

      console.log("Control Objective Data: ", controlObjData);
      setTableData(controlObjData); // Set the fetched data to the state
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData(); // Fetch data on component mount
  }, []);

  // Handle adding a new control
  const handleAddControl = (newControl: any) => {
    setTableData((prevData) => [...prevData, newControl]); // Append the new control to the existing data
  };
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex flex-col gap-3 h-full overflow-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          
        </h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Import Controls
          </Button>
          <AddControlDialog
            onAddControl={handleAddControl}
            tableData={tableData}
          />
          {/* <Button onClick={() => setIsOpen(true)}>Open Progress Form</Button>
          {isOpen && (
            <ProgressForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
          )} */}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tableData.length}</div>
            <p className="text-xs text-muted-foreground">
              All controls in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts.Published || 0}
            </div>
            <p className="text-xs text-muted-foreground">Active controls</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(statusCounts.Review || 0) + (statusCounts.Approval || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.Draft || 0}</div>
            <p className="text-xs text-muted-foreground">In development</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Control Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search controls..."
              className="w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-6 rounded-md border">
            <ControlDataTable controlData={tableData} />{" "}
            {/* Pass the updated tableData */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
