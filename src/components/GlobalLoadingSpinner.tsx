"use client";
import { useLoading } from "@/contexts/LoadingContext";
import { ShieldEllipsis, LoaderCircle } from "lucide-react";

const GlobalLoadingSpinner = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex items-center justify-center min-h-[50vh]  text-primary ">
        {/* <ShieldEllipsis className="h-12 w-12 " /> */}
        <LoaderCircle className="h-12 w-12 animate-spin duration-100" />
        {/* <p className="text-2xl ml-2 font-bold">Loading ...</p> */}
      </div>
    </div>
  );
};

export default GlobalLoadingSpinner;
