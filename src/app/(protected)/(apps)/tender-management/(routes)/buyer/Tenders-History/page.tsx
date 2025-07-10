import { IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import FolderItem from "./components";
import { Import } from "lucide-react";
import Link from "next/link";
import departmentsData from "../../../_utils/common/departments";


export default function TendersHistory() {
  
  const data = departmentsData
  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="headerDiv w-full">
        <div className="w-full text-end">
          <IconTextButtonWithTooltip tooltipContent="Import Tenders">
            <Import />
            <Link href="./Tenders-History/Import-Tenders">Import Tenders</Link>
          </IconTextButtonWithTooltip>
        </div>
      </div>
      <div className="bodydiv w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.map((item, index) => (
            <div key={index} className="grid-col-span-1">
              <FolderItem item={item} />
            </div>
          ))}
          {/* <FolderItem />*/}
        </div>
      </div>
    </div>
  );
}
