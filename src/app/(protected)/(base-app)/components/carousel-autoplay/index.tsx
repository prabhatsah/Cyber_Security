"use client";
import { Carousel } from "@/shadcn/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

function CarouselAutoPlay({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        {children}
      </Carousel>
    </>
  );
}

export default CarouselAutoPlay;
