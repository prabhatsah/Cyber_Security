 // import "../../../(protected)/layout.css";
//import { Button } from "@/shadcn/ui/button";
import { CarouselContent, CarouselItem } from "@/shadcn/ui/carousel";
import CustomerSupportImage from "./customer-support-img-1";
import CarouselAutoPlay from "../../(base-app)/components/carousel-autoplay";
import { redirect } from "next/navigation";

export default function CustomerSupportHome() {
 redirect("customer-support/dashboard")
}