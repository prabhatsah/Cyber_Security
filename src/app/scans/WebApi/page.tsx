import PastScans from "@/components/PastScans";
import CurrentScan from "./components/CurrentScan";

export default function WebApi() {

  return (
    <div className="p-4">
      <p className="font-bold text-gray-600">Web & API Security</p>
      <CurrentScan />
      <PastScans />
    </div >
  );
}

