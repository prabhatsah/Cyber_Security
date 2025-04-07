import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function DivLoading() {
    return (
        <div className="z-10 bottom-0 inset-0 flex justify-center items-center">
            <AiOutlineLoading3Quarters className="animate-spin size-8" />
        </div>
    );
}
