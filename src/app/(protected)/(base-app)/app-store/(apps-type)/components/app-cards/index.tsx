"use client";
import { AspectRatio } from "@/shadcn/ui/aspect-ratio";
import { Card, CardContent, CardHeader } from "@/shadcn/ui/card";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../app-context";
import { Button } from "@/shadcn/ui/button";
import {
  ChevronDown,
  ChevronRight,
  SquareChevronDown,
  SquareChevronRight,
} from "lucide-react";
const appImagePath = process.env.NEXT_BASE_PATH + "/assets/images/apps/";
const imageMap = {
  "Document Management": appImagePath + "document-management.webp",
  "Sales CRM": appImagePath + "sales-crm.webp",
  BMS: appImagePath + "bms_image.png",
  "Resource Management": appImagePath + "resource-management.webp",
  "Task Management": appImagePath + "task-management.webp",
  "Customer Support": appImagePath + "customer-support.webp",
  "Deployment Management": appImagePath + "deployment-management.webp",
  ITSM: appImagePath + "itsm.webp",
  "Project Management": appImagePath + "project-management.webp",
  "Supplier Management": appImagePath + "supplier-management.webp",
  HCM: appImagePath + "hcm.webp",
  CCC: appImagePath + "ccc.webp",
  SSD: appImagePath + "ssd.webp",
  "Release Management": appImagePath + "release-management.webp",
  "AI-ML Workbench": appImagePath + "ai.webp",
  "Digital Twin": appImagePath + "digital-twin.webp",
};

const mobileItems = [
  {
    SOFTWARE_ID: "04da3f30-117a-4d2c-986d-9342849eb458",
    SOFTWARE_NAME: "Document Management",
    SOFTWARE_DESCRIPTION:
      "It refers to the process of storing, organizing, and tracking digital documents. It often involves the use of Document Management Systems (DMS), which provide tools to manage the lifecycle of documents, ensuring that they are securely stored, easily accessible, and can be shared or retrieved as needed.",
    SOFTWARE_VERSION: 1,
    SOFTWARE_STATUS: "PROD_DEPLOYEMENT_PENDING",
    SOFTWARE_OWNER: "b8bbe5c9-ad0d-4874-b563-275a86e4b818",
    SOFTWARE_OWNER_ACCOUNT_NAME: "Keross",
    SOFTWARE_DEVELOPER: "b8bbe5c9-ad0d-4874-b563-275a86e4b818",
    SOFTWARE_ACCESSIBILITY: "DEFAULT",
    ACTIVE: true,
    REQUEST_TYPE: null,
    REQUEST_STATUS: null,
    REQUEST_ID: null,
  },
  {
    SOFTWARE_ID: "efaa4f48-626c-4a92-8e72-8ea3f37b0502",
    SOFTWARE_NAME: "SSD",
    SOFTWARE_DESCRIPTION:
      "Create personalized dashboards to visualize your data the way you need it with our custom dashboard app. Track key metrics, monitor performance, and generate real-time insights, all in one place. With flexible layouts and customizable widgets, you can tailor your dashboard to fit your unique business goals and stay on top of what matters most.",
    SOFTWARE_VERSION: 1,
    SOFTWARE_STATUS: "UNDER_DEVELOPEMENT",
    SOFTWARE_OWNER: "b8bbe5c9-ad0d-4874-b563-275a86e4b818",
    SOFTWARE_OWNER_ACCOUNT_NAME: "Keross",
    SOFTWARE_DEVELOPER: "b8bbe5c9-ad0d-4874-b563-275a86e4b818",
    SOFTWARE_ACCESSIBILITY: "PUBLIC",
    ACTIVE: true,
    REQUEST_TYPE: null,
    REQUEST_STATUS: null,
    REQUEST_ID: null,
  },
];

function AppCards({ items }: { items: any[] }) {
  console.log(items);
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppCards must be used within a AppProvider");
  }
  const {
    searchQuery,
    setSearchQuery,
    setCurrentSelectedAppData,
    filterData,
    setFilterData,
  } = context;

  useEffect(() => {
    setCurrentSelectedAppData(items);
    setSearchQuery("");
    console.log(filterData);
  }, []);
  const areAllArraysEmpty = () => {
    return Object.values(filterData).every(
      (arr) => Array.isArray(arr) && arr.length === 0
    );
  };

  const [seeAllWebApp, setSeeAllWebApp] = useState<boolean>(false);
  const [seeAllMobileApp, setSeeAllMobileApp] = useState<boolean>(false);

  return (
    <>
      <div
        className={`${
          seeAllMobileApp ? "hidden" : "block"
        } flex flex-row gap-3 items-center my-3`}
      >
        {/* <h1 className='text-md font-bold'></h1> */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSeeAllWebApp((prev) => !prev);
          }}
        >
          Web Application {seeAllWebApp ? <ChevronDown /> : <ChevronRight />}
        </Button>
      </div>
      <div
        className={`${seeAllWebApp ? "h-[90%]" : "h-[45%]"} ${
          seeAllMobileApp ? "hidden" : "block"
        } overflow-y-auto`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
          {items
            // .filter(item => {
            //     // Loop through each key in fobj
            //     if (Object.keys(filterData).length === 0) {
            //         return true; // Return all objects
            //     }
            //     // if (areAllArraysEmpty()) {
            //     //     return true;
            //     // }
            //     return Object.keys(filterData).every(key => {
            //         if (filterData[key].length === 0) {
            //             return true; // If the array is empty, include all items
            //           }
            //         return filterData[key].includes(item[key])
            //     })
            // })
            .filter((item) => {
              return item.SOFTWARE_NAME.toLowerCase()?.includes(searchQuery);
            })
            .map((item, index) =>
              [
                "Base App",
                "SSD NEW",
                "Customer Support - Microservice",
                "IKON DevZone",
                "Water Management - TCS",
              ].includes(item.SOFTWARE_NAME) ||
              (index > 4 && !seeAllWebApp) ? null : ( // <NoDataComponent />
                <Card key={item.SOFTWARE_ID}>
                  <Link
                    href={`/app-store/${
                      item.SOFTWARE_ID
                    }?name=${encodeURIComponent(
                      item.SOFTWARE_NAME.replace(/\s+/g, "-")
                    )}`}
                  >
                    <CardHeader>
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={
                            imageMap[item.SOFTWARE_NAME] ||
                            "/assets/images/Slider-1-D.svg"
                          }
                          alt="App"
                          className="rounded-md h-full w-full"
                        />
                      </AspectRatio>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <h1 className="truncate">{item.SOFTWARE_NAME}</h1>
                        <small>(V{item.SOFTWARE_VERSION})</small>
                      </div>
                      <div className="truncate">
                        <small title={item.SOFTWARE_DESCRIPTION}>
                          {item.SOFTWARE_DESCRIPTION}
                        </small>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            )}
        </div>
      </div>

      <div
        className={`${
          seeAllWebApp ? "hidden" : "block"
        } flex flex-row gap-3 items-center my-3`}
      >
        {/* <h1 className='text-md font-bold'>Mobile Application</h1> */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSeeAllMobileApp((prev) => !prev);
          }}
        >
          Mobile Application{" "}
          {seeAllMobileApp ? <ChevronDown /> : <ChevronRight />}
        </Button>
      </div>
      <div
        className={`${seeAllMobileApp ? "h-[90%]" : "h-[45%]"} ${
          seeAllWebApp ? "hidden" : "block"
        } overflow-y-auto`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
          {mobileItems
            .filter((item) => {
              return item.SOFTWARE_NAME.toLowerCase()?.includes(searchQuery);
            })
            .map((item, index) =>
              [
                "Base App",
                "SSD NEW",
                "Customer Support - Microservice",
                "IKON DevZone",
                "Water Management - TCS",
              ].includes(item.SOFTWARE_NAME) ||
              (index > 4 && !seeAllMobileApp) ? null : (
                <Card key={item.SOFTWARE_ID}>
                  <Link
                    href={`/app-store/${
                      item.SOFTWARE_ID
                    }?name=${encodeURIComponent(
                      item.SOFTWARE_NAME.replace(/\s+/g, "-")
                    )}`}
                  >
                    <CardHeader>
                      <AspectRatio ratio={16 / 9}>
                        <img
                          src={
                            imageMap[item.SOFTWARE_NAME] ||
                            "/assets/images/Slider-1-D.svg"
                          }
                          alt="App"
                          className="rounded-md h-full w-full"
                        />
                      </AspectRatio>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <h1 className="truncate">{item.SOFTWARE_NAME}</h1>
                        <small>(V{item.SOFTWARE_VERSION})</small>
                      </div>

                      <div className="truncate">
                        <small title={item.SOFTWARE_DESCRIPTION}>
                          {item.SOFTWARE_DESCRIPTION}
                        </small>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            )}
        </div>
      </div>
    </>
  );
}

export default AppCards;
