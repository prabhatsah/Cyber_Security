import { Card, CardContent } from "@/shadcn/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shadcn/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Controller } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { AspectRatio } from "@/shadcn/ui/aspect-ratio";
const screenShowImg: string[] = [
  "/assets/images/apps/resource-management.webp",
  "/assets/images/apps/ai.webp",
  "/assets/images/apps/digital-twin.webp",
  "/assets/images/apps/ccc.webp",
  "/assets/images/apps/itsm.webp",
];

export default function EnlargedPicture({ open, setOpen }: any) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full lg:w-auto max-w-full overflow-auto p-4">
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
        </DialogHeader>
        <div className="overflow-hidden flex items-center justify-center">
          <Swiper
            loop={true}
            navigation
            pagination={{ type: "fraction" }}
            modules={[Navigation, Pagination, Controller]}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <SwiperSlide key={index}>
                {/* <div className='flex h-full w-full items-center justify-center'>
                                    <Image
                                        src={screenShowImg[index] || '/assets/images/Slider-1-D.svg'}
                                        width={1200}
                                        height={800}
                                        alt="Swiper Image"
                                        className="rounded-lg object-cover"
                                    />
                                    
                                </div> */}
                <div className="w-[1200px] max-w-full">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      alt="Image"
                      src={
                        process.env.NEXT_BASE_PATH + screenShowImg[index] ||
                        "/assets/images/Slider-1-D.svg"
                      }
                      className="rounded-md object-cover"
                    />
                  </AspectRatio>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </DialogContent>
    </Dialog>
  );
}
