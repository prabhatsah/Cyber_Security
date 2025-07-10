import ControlCards from "./individualSection/controlsCard";
import FirstFourCards from "./individualSection/fourCards";

export default function Overview() {
    return (
    <>
        {/* <p>Monitor your audit & compliance metrics in real time</p> */}
        <div className="h-full overflow-y-auto gap-3">
            <FirstFourCards />

            <ControlCards/>
        </div>
    </>
    )
}