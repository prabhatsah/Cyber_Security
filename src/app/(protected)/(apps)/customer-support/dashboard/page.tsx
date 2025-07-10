// import "../../../(protected)/layout.css";
//import { Button } from "@/shadcn/ui/button";
import Button from "../client-button-comp";
import { CarouselContent, CarouselItem } from "@/shadcn/ui/carousel";
import CustomerSupportImage from "../customer-support-img-1";
import CarouselAutoPlay from "@/app/(protected)/(base-app)/components/carousel-autoplay";

export default function CustomerSupportDashboard() {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 md:gap-[10rem] justify-center items-center h-full text-center relative overflow-hidden ">
        {/* Content Section */}
        <div className="flex flex-col justify-center md:items-start items-center md:w-1/2 px-4 md:px-6 py-6 md:py-8 z-10 text-left">
          <span className="login-left-text !w-[700px]">
            "Streamline customer interactions with an easy-to-use ticketing
            system. Prioritize, track, and resolve issues effortlessly."
          </span>

          {/* Buttons */}
          <div className="flex flex-wrap items-start gap-3 md:gap-4 mt-5">
            <Button
              variant={"outline"}
              className="w-36 md:w-40 py-2 px-3"
              href="all-tickets/open-tickets"
            >
              Open Ticket(s)
            </Button>
            <Button
              className="w-36 md:w-40 py-2 px-3"
              href="summary"
            >
              Summary
            </Button>
          </div>
        </div>

        {/* <div className="terminal-box">
          <Terminal />
        </div> */}
        {/* Graphics Section */}
        <div className="flex justify-center items-center md:w-1/2 px-4 md:px-6 py-6 md:py-8">
          <div className="w-full md:w-auto">
            <CarouselAutoPlay>
              <CarouselContent className="flex flex-row items-center">
                <CarouselItem>
                  <CustomerSupportImage />
                </CarouselItem>
                <CarouselItem>
                  <CustomerSupportImage />
                </CarouselItem>
              </CarouselContent>
            </CarouselAutoPlay>
          </div>
        </div>
      </div>
    </>
  );
}
