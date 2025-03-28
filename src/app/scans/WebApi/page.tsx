import PastScans from "@/components/PastScans";
import CurrentScan from "./components/CurrentScan";

export default function WebApi() {

  return (
    <div className="">
      <p className="font-bold text-widget-title text-pageheader">Web & API Security</p>
      <CurrentScan />
      {/* <PastScans /> */}
    </div >
  );
}

