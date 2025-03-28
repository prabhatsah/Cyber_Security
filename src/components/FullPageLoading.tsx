import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function FullPageLoading() {
  return (
    <div className="z-10 absolute inset-0 flex justify-center items-center">
      <AiOutlineLoading3Quarters className="animate-spin size-8" />
    </div>
  );
}
