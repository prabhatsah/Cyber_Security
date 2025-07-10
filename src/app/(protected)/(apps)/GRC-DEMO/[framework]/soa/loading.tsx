import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2Icon className="animate-spin w-10 h-10" />
    </div>
  );
}