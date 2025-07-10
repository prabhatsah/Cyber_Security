import AppComponent from "./components/appComponent";
import Image from "next/image";
import AppStoreBreadcrumb from "./components/appStoreBreadcrumb";
import Link from "next/link";
import AllAppData from "../(apps-type)/components/data/all-app-data";

const appImagePath = process.env.NEXT_BASE_PATH + "/assets/images/apps/";
const imageMap = {
  "Document Management": appImagePath + "document-management.webp",
  "Sales CRM": appImagePath + "sales-crm.webp",
  "Resource Management": appImagePath + "resource-management.webp",
  "Task Management": appImagePath + "task-management.webp",
  "Customer Support": appImagePath + "customer-support.webp",
  "Deployment Management": appImagePath + "deployment-management.webp",
  ITSM: appImagePath + "itsm.webp",
  BMS: appImagePath + "bms_image.png",
  "Project Management": appImagePath + "project-management.webp",
  "Supplier Management": appImagePath + "supplier-management.webp",
  HCM: appImagePath + "hcm.webp",
  CCC: appImagePath + "ccc.webp",
  SSD: appImagePath + "ssd.webp",
  "Release Management": appImagePath + "release-management.webp",
  "AI-ML Workbench": appImagePath + "ai.webp",
  "Digital Twin": appImagePath + "digital-twin.webp",
};

async function page({ params }: { params: { softwareId: string } }) {
  const allApps = await AllAppData();
  return (
    <>
      <AppStoreBreadcrumb softwareId={params.softwareId} />
      {/* <div>{params.softwareId}</div> */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 overflow-y-scroll h-full">
        <div className="md:col-span-3 relative">
          <AppComponent params={params} />
        </div>
        <div className="md:col-span-1">
          <div className="top-0 sticky right-0">
            <h1 className="text-3xl font-semibold mb-3">People also View</h1>
            <div className=" flex flex-col gap-3 h-full overflow-y-auto pl-4">
              {allApps.map((item: any, index: number) =>
                [
                  "Base App",
                  "SSD NEW",
                  "Customer Support - Microservice",
                  "IKON DevZone",
                  "Water Management - TCS",
                ].includes(item.SOFTWARE_NAME) ? null : (
                  <div key={index}>
                    <Link
                      href={`/app-store/${
                        item.SOFTWARE_ID
                      }?name=${encodeURIComponent(
                        item.SOFTWARE_NAME.replace(/\s+/g, "-")
                      )}`}
                    >
                      <div className="flex flex-row gap-5">
                        <div className="self-center">
                          <div className="w-20 h-14">
                            <img
                              src={
                                imageMap[item.SOFTWARE_NAME] ||
                                "/assets/images/Slider-1-D.svg"
                              }
                              // width={100}
                              // height={100}
                              alt="Document Management"
                              className="rounded-lg w-full h-full"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <h1 className="text-xl font-semibold">
                            {item.SOFTWARE_NAME}
                          </h1>
                          <p className="text-lg">Free</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
