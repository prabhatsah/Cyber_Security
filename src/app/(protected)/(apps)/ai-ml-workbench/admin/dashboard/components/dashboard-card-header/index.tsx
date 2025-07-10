import { Button } from "@/shadcn/ui/button";
import { CardHeader } from "@/shadcn/ui/card";
import { ChevronRight, Plus } from "lucide-react";
import { ReactNode } from "react";

export default function DashboardCardHeader({
  mainHeaderId,
  mainHeaderText,
  viewAllHref,
  formOpenModal,
  children,
}: {
  mainHeaderId: string;
  mainHeaderText: string;
  viewAllHref: string;
  formOpenModal: ReactNode;
  children?: ReactNode;
}) {
  return (
    <CardHeader className="flex flex-row justify-between">
      <div className="flex flex-col justify-between gap-1">
        <span id={mainHeaderId}>{mainHeaderText}</span>
        <small className="">
          <a href={viewAllHref} className="flex" id="mlServer-link">
            View All <ChevronRight width={20} height={20} />
          </a>
        </small>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {formOpenModal}
      </div>
    </CardHeader>
  );
}
