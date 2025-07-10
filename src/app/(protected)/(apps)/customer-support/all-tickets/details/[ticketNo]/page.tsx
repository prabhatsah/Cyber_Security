
//import { useParams } from "next/navigation";// Import Server Component
import EachTicketDetails from "./eachTicketDetails";
import TicketDetailsServer from "./eachTicketDetails";

// export default function TicketDetailsPage() {
//     const params = useParams();
//     console.log("Params received:", params);

//     const ticketId = Array.isArray(params.ticketNo) ? params.ticketNo[0] : params.ticketNo || "";



    export default async function TicketDetailsPage({ children, params }: { children: React.ReactNode, params: { ticketNo: string } }) {
        const ticketNo = params.ticketNo || "";
        console.log("ticketNooooooooooo ", ticketNo);
    return (
        <div>
            <EachTicketDetails ticketId={ticketNo} />
        </div>
    );
}
