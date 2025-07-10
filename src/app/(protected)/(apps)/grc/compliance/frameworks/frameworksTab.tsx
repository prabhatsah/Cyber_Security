import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { frameworks } from "./data";
import { Card, CardHeader, CardTitle, CardContent } from "@/shadcn/ui/card";
import { FrameworkView } from "../../controls/framework/framework-view";
// import { controls } from "./data";
import { ImportControls } from "../../controls/framework/import/import-controls";
import { EvidenceManager } from "../../controls/framework/evidence/evidence-manager";
import { NewFrameworkForm } from "../../controls/framework/new-framework-form";
import { fetchControlsData } from "./(backend-calls)/getData";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

const Tab = () => {
  const [fetchedframeworkData, setfetchedframeworkData] = useState<any[]>([]);
  const [activeFramework, setActiveFramework] = useState();

  const fetchFrameworkData = async () => {
    try {
      const frameworkInsData = await getMyInstancesV2<any>({
        processName: "Add Framework",
        predefinedFilters: { taskName: "framework details" },
      });
      console.log("frameworkInsData", frameworkInsData);
      const frameworkData = frameworkInsData.map((e: any) => e.data);
      setfetchedframeworkData(frameworkData);
      if (frameworkData.length > 0) {
        setActiveFramework(frameworkData[0].id);
      }
    } catch (error) {
      console.error("Error fetching frameworkData data:", error);
    }
  };
  useEffect(() => {
    fetchFrameworkData();
  }, []);
  console.log("fetchedframeworkData from tab----", fetchedframeworkData);

  const [activeTab, setActiveTab] = useState("fetchedframeworkData");

  const [controls, setControls] = useState([]);
  const fetchControlsDataFunction = async () => {
    let data = await fetchControlsData();
    setControls(data);
  };
  useEffect(() => {
    fetchControlsDataFunction();
  }, []);
  console.log("controls data from tab----", controls);
  return (
    <div>
      <Tabs
        defaultValue="fetchedframeworkData"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList className="flex flex-row gap-3">
          {/* <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="new">New Framework</TabsTrigger> */}
        </TabsList>

        <TabsContent value="fetchedframeworkData">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Framework Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  {fetchedframeworkData.map((framework) => (
                    <button
                      key={framework.id}
                      onClick={() => setActiveFramework(framework.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${
                          activeFramework === framework.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80"
                        }`}
                    >
                      {framework.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            {fetchedframeworkData && fetchedframeworkData.length > 0 && (
              <FrameworkView
                framework={
                  fetchedframeworkData.find(
                    (f: any) => f.id === activeFramework
                  )!
                }
                controls={controls.filter((c) =>
                  c?.frameworks?.some((f: any) => f.id === activeFramework)
                )}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="import">
          <ImportControls />
        </TabsContent>

        <TabsContent value="evidence">
          <EvidenceManager controls={controls} />
        </TabsContent>

        <TabsContent value="new">
          <NewFrameworkForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tab;
