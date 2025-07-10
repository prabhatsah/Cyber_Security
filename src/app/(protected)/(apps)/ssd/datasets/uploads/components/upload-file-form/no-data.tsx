import { CircleAlert } from "lucide-react";

export default function NoDataComponentV2({ text }: { text?: string }) {
  return (
    <div className="flex flex-col h-full justify-center text-center gap-2">
      <CircleAlert className="text-gray-500 mx-auto" size={36} />
      <p className="text-gray-500">{text ? text : "No Data Available"}</p>
    </div>
  );
}
