import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import PastScans from "@/components/PastScans";
import CurrentScan from "./components/CurrentScan";

export default function WebApi() {

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Web & API Security",
          href: "/scans/WebApi",
        }}
      />
      <div className="">
        <p className="font-bold ">Web & API Security</p>
        <CurrentScan />
        <PastScans />
      </div >
    </>
  );
}

