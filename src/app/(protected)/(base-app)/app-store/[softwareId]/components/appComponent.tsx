"use client";
import { useSearchParams } from "next/navigation";
import React, { use, useState } from "react";

import EnlargedPicture from "./enlargedPic";
import Image from "next/image";
import { Button } from "@/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shadcn/ui/carousel";
import { Badge } from "@/shadcn/ui/badge";
import { Progress } from "@/shadcn/ui/progress";
import {
  Check,
  ChevronRight,
  CircleCheck,
  Cog,
  Share2,
  Star,
} from "lucide-react";
import ShowReview from "./showReview";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import "./customeSwiper.css";

const appImagePath = process.env.NEXT_BASE_PATH + "/assets/images/apps/";

const imageMap = {
  "Document Management": appImagePath + "document-management.webp",
  "Sales CRM": appImagePath + "sales-crm.webp",
  BMS: appImagePath + "bms_image.png",
  "Resource Management": appImagePath + "resource-management.webp",
  "Task Management": appImagePath + "task-management.webp",
  "Customer Support": appImagePath + "customer-support.webp",
  "Deployment Management": appImagePath + "deployment-management.webp",
  ITSM: appImagePath + "itsm.webp",
  "Project Management": appImagePath + "project-management.webp",
  "Supplier Management": appImagePath + "supplier-management.webp",
  HCM: appImagePath + "hcm.webp",
  CCC: appImagePath + "ccc.webp",
  SSD: appImagePath + "ssd.webp",
  "Release Management": appImagePath + "release-management.webp",
  "AI ML Workbench": appImagePath + "ai.webp",
  "Digital Twin": appImagePath + "digital-twin.webp",
};

const screenShowImg: string[] = [
  "/assets/images/apps/resource-management.webp",
  "/assets/images/apps/ai.webp",
  "/assets/images/apps/digital-twin.webp",
  "/assets/images/apps/ccc.webp",
  "/assets/images/apps/itsm.webp",
];

export default function AppComponent({
  params,
}: {
  params: { softwareId: string };
}) {
  const param = use(params);
  const searchParams = useSearchParams();
  const softwareName = searchParams.get("name")?.replace(/-/g, " ");
  const [showMoreDescription, setShowMoreDescription] = useState<boolean>(true);
  const [showMoreFeature, setShowMoreFeature] = useState<boolean>(true);
  const [showMoreRequirements, setShowMoreRequirements] =
    useState<boolean>(true);
  const [openReview, setOpenReview] = useState<boolean>(false);
  const [openScreenshot, setOpenScreenshot] = useState<boolean>(false);

  const ratings = [
    { stars: 5, percent: 70 },
    { stars: 4, percent: 20 },
    { stars: 3, percent: 5 },
    { stars: 2, percent: 3 },
    { stars: 1, percent: 2 },
  ];

  const features = [
    "Instant answers - Use the[Alt + Space] keyboard shortcut for faster access to ChatGPT",
    "Chat with your computer - Use Advanced Voice to chat with your computer in real - time and get hands - free advice and answers while you work",
    "Search the web - Get fast, timely answers with links to relevant web sources.",
    "Stay productive - Keep ChatGPT easily accessible next to your open apps with the companion window",
    "Take and share screenshots - Ask about anything on your screen",
    "Upload files and photos - Summarize and analyze multiple documents",
    "Get professional input - Brainstorm marketing copy or a business plan",
    "Creative inspiration - Get birthday gift ideas or create a personalized greeting card with DALL - E",
  ];

  const systemRequirements = [
    { "Available on": "PC" },
    { OS: "Windows 10 version 18362.0 or higher" },
    { Architecture: "x64, Arm64" },
  ];

  const additionalInformation = [
    { "Developed by": "OpenAl" },
    {
      "Published by": "OpenAl",
    },
    {
      "Release Date": "9/7/2024 ",
    },
    {
      Category: "Productivity",
    },
    {
      "Approximate size": "303.7 MB",
    },
    {
      Installation:
        "Get this app while signed in to your Microsoft account and install on up to ten Windows devices.",
    },
    {
      "This app can": [
        "Uses all system resources",
        "Use your webcam Use your microphone",
      ],
    },
    {
      "Supported languages": "English (United States)",
    },
    {
      "Publisher Info": ["ChatGPT website", "Contact information"],
    },
    {
      "Additional terms": [
        "ChatGPT privacy policy",
        "Terms of service & privacy policy: https://openai.com/policies/terms...",
      ],
    },
    {
      "Report this product": [
        "Report this product for violating Microsoft Store Policy ",
        "Report this product for illegal content",
      ],
    },
    {
      "Seizure warnings": "Photosensitive seizure warning",
    },
    {
      "Legal disclaimers":
        "This seller has certified that it will only offer products or services that comply with all applicable laws.",
    },
  ];
  return (
    <>
      <ShowReview open={openReview} setOpen={setOpenReview} />
      <EnlargedPicture open={openScreenshot} setOpen={setOpenScreenshot} />

      <div className="flex justify-between">
        <div className="flex flex-row gap-3">
          <div className="self-center">
            <Image
              // src='/assets/images/apps/document-management.webp'
              src={imageMap[softwareName] || "/assets/images/Slider-1-D.svg"}
              width={150}
              height={150}
              alt="Document Management"
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">{softwareName}</h1>
            <span>Keross</span>
            <div className="flex flex-row gap-3">
              <div className="flex flex-row gap-1">
                <p>4.2</p>
                <Star height={20} width={20} fill="grey" color="grey" />
              </div>

              <p>530 ratings</p>
              <p>Productivity</p>
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex flex-row gap-2">
            <Button variant="default">Subscribe</Button>
            <Button variant="default">Share</Button>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <p>The Official Keross App</p>
      </div>

      <div className="mt-3">
        <Card>
          <CardHeader className="border-b flex flex-row justify-between items-center gap-3 py-2">
            <CardTitle className="text-accent">Preview</CardTitle>
            <Button
              onClick={() => {
                setOpenScreenshot(true);
              }}
              size="sm"
            >
              <ChevronRight width={15} height={15} />
            </Button>
          </CardHeader>
          <CardContent>
            {/* <Carousel>
                                    <CarouselContent className="-ml-1">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                                                <div className="p-1 h-[250px]">
                                                    <CardContent className="flex flex-row p-6">
                                                        <Image
                                                            // src='/assets/images/apps/document-management.webp'
                                                            src={screenShowImg[index] || "/assets/images/Slider-1-D.svg"}
                                                            width={450}
                                                            height={600}
                                                            alt="Document Management"
                                                            className="rounded-lg"
                                                        />
                                                    </CardContent>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className='absolute left-[1rem]' />
                                    <CarouselNext className='absolute right-[1rem]' />
                                </Carousel> */}
            <div className="w-full mt-2">
              <Swiper
                loop={true}
                slidesPerView={3}
                spaceBetween={15}
                navigation={true}
                pagination={{
                  clickable: true,
                }}
                modules={[Navigation, Pagination]}
                onSwiper={(swiper) => console.log(swiper)}
                // className='w-full rounded-lg'
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex h-full w-full items-center justify-center">
                      <img
                        src={
                          process.env.NEXT_BASE_PATH + screenShowImg[index] ||
                          "/assets/images/Slider-1-D.svg"
                        }
                        alt="Swiper Image"
                        // width={450}
                        // height={600}
                        // className='h-full w-full object-cover'
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-3">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-accent">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 pt-2">
              <p>
                The official ChatGPT desktop app brings you the newest model
                improvements from OpenAI, including access to OpenAI o1-preview,
                our newest and smartest model.
              </p>
              <p>Do more on your PC with ChatGPT:</p>
              <div className="px-8">
                <ul className="list-disc">
                  <li>
                    Instant answers—Use the [Alt + Space] keyboard shortcut for
                    faster access to ChatGPT
                  </li>
                  <li>
                    Chat with your computer—Use Advanced Voice to chat with your
                    computer in real-time and get hands-free advice and answers
                    while you work.
                  </li>
                  <li>
                    Search the web—Get fast, timely answers with links to
                    relevant web sources.
                  </li>
                  <li>
                    Collaborate on writing and code—Use canvas to work with
                    ChatGPT on projects that require editing and revisions.
                  </li>
                  <li>
                    Stay productive—Keep ChatGPT easily accessible next to your
                    open apps with the companion window.
                  </li>
                  <div
                    className={`${showMoreDescription ? "hidden" : "block"}`}
                  >
                    <li>
                      Take and share screenshots—Ask about anything on your
                      screen
                    </li>
                    <li>
                      Upload files and photos—Summarize and analyze multiple
                      documents
                    </li>
                    <li>
                      Get professional input—Brainstorm marketing copy or a
                      business plan
                    </li>
                    <li>
                      Creative inspiration—Get birthday gift ideas or create a
                      personalized greeting card with DALL•E
                    </li>
                  </div>
                </ul>
              </div>

              <p className={`${showMoreDescription ? "hidden" : "block"}`}>
                Join hundreds of millions of users and download ChatGPT today.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => {
                setShowMoreDescription((prev) => !prev);
              }}
            >
              {showMoreDescription ? "Show More" : "Show Less"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-3">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-accent">Rating and Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-14 my-5">
                <div className="flex flex-col gap-2">
                  <p className="text-8xl">4.2</p>
                  <p className="text-center">530 Rating</p>
                </div>
                <div className="space-y-2 w-64">
                  {ratings.map((rating) => (
                    <div key={rating.stars} className="flex items-center gap-2">
                      <span
                        className={`flex items-center ${
                          rating.stars === 1 ? "gap-2" : "gap-1"
                        } text-sm font-medium`}
                      >
                        {rating.stars}{" "}
                        <Star height={18} width={18} fill="gold" color="gold" />
                      </span>
                      <Progress
                        value={rating.percent}
                        className="w-40 h-2 bg-orange-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <h2 className="font-semibold text-2xl my-3">
                Review Summary Based on 38 Reviews
              </h2>
              <p>
                Users rare about ChatGPT's sleek design, powerful search, and
                human-like Al. Despite minor performance issues, it's a
                must-have app for anyone who wants to keep up with technology.
              </p>
              <h3 className="font-semibold text-lg mb-3">
                Reviewers like this feature
              </h3>
              <div className="flex flex-row gap-3">
                <Badge>Sleek</Badge>
                <Badge>Powerful</Badge>
                <Badge>Human Like</Badge>
              </div>
              <p className="mt-3 text-sm">
                The above summary hase been generated by AI
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => {
                setOpenReview(true);
              }}
            >
              Show Review
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-3">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-accent">Features</CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            {features.map((feature, index) =>
              index >= 3 ? (
                <p
                  key={index}
                  className={`my-1 ${showMoreFeature ? "hidden" : "block"}`}
                >
                  {feature}
                </p>
              ) : (
                <p key={index} className="my-1">
                  {feature}
                </p>
              )
            )}
            {showMoreFeature && <p>. . .</p>}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowMoreFeature((prev) => !prev);
              }}
            >
              {showMoreFeature ? "Show More" : "Show Less"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-3">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-accent">System Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-3 my-3">
                <CircleCheck fill="green" />
                <p>
                  This product should work on your device. Items with a
                  checkmark meet the developers system requirements.
                </p>
              </div>
            </div>
            <div
              className={`flex flex-col gap-1 ${
                showMoreRequirements ? "hidden" : "block"
              } px-1`}
            >
              {systemRequirements.map((requirements, index) => (
                <div key={index} className="flex flex-row gap-3">
                  <Check
                    height={15}
                    width={15}
                    color="green"
                    className="self-center"
                  />
                  <p>
                    <span className="font-semibold">
                      {Object.keys(requirements)}
                    </span>{" "}
                    : {Object.values(requirements)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowMoreRequirements((prev) => !prev);
              }}
            >
              {showMoreFeature ? "Show More" : "Show Less"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-3">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-accent">
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-10 p-3">
              {additionalInformation.map((additionalInfo, index) => (
                <div key={index} className="flex flex-col">
                  <p className="text-md">{Object.keys(additionalInfo)}</p>
                  <div className="flex flex-col">
                    {Object.values(additionalInfo).map((infoVal, index) => (
                      <p key={index} className="text-lg">
                        {infoVal}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
