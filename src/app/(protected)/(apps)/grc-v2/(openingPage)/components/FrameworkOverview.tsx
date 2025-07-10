import React, { useState } from "react";
import {
  FrameworkMainContext,
  frameworkProps,
} from "./context/frameworkContext";
import { toast } from "sonner";
import {
  getMyInstancesV2,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { AlertCircle } from "lucide-react";
import NoDataComponent from "@/ikon/components/no-data";
import { Alert, AlertDescription } from "@/shadcn/ui/alert";
import DisplayFrameworkDetails from "./displayFrameworkDetails";
import router from "next/router";

type FrameworkEntry = {
  index: string;
  title: string;
  description: string;
  parentId: string | null;
  treatAsParent: boolean;
  id: string;
  childrenArray?: string[]; // only present in `parentEntries`
};

export type FrameworkData = {
  name: string;
  description: string;
  version: string;
  owners: string[];
  pricing: {
    type: string;
  };
  entries: Record<string, FrameworkEntry>;
  parentEntries: (FrameworkEntry & { childrenArray: string[] })[];
  id: string;
  title: string;
  category: string;
  score: number;
  status: "draft" | "published" | "archived"; // assuming possible statuses
  isFavorite: boolean;
};

export interface FrameworkCardProps {
  framework: frameworkProps;
  isSubscribed: boolean;
  onButtonClick?: () => void;
}

export function FrameworkCard({
  framework,
  isSubscribed,
  onButtonClick,
}: FrameworkCardProps) {
  const progressBarColor = isSubscribed ? "bg-blue-500" : "bg-gray-500";
  const buttonColor = isSubscribed
    ? "bg-blue-600 hover:bg-blue-700 text-white"
    : "bg-gray-700 hover:bg-gray-600 text-gray-300";
  const buttonText = isSubscribed ? "View Details" : "Subscribe to Framework";
  const readinessText = isSubscribed
    ? "Achieved Compliance"
    : "Current Estimated Readiness";
  const percentageTextColor = isSubscribed ? "text-blue-400" : "text-gray-400";

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {framework.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4">{framework.description}</p>
        <div className="mb-4">
          <div className="flex justify-between items-center text-sm font-medium text-gray-300 mb-1">
            <span>{readinessText}</span>
            <span className={percentageTextColor}>
              {framework.score}% {isSubscribed ? "" : "ready"}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className={`${progressBarColor} h-2.5 rounded-full`}
              style={{ width: `${framework.score}%` }}
            ></div>
          </div>
        </div>
      </div>
      {/* The button now uses the passed onButtonClick handler */}
      <button
        onClick={onButtonClick}
        className={`mt-6 w-full ${buttonColor} font-medium py-2 px-4 rounded-lg transition duration-300`}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default function FrameworkOverview({
  clientId,
  subscribedList,
  availableList,
}: {
  clientId: string;
  subscribedList: frameworkProps[];
  availableList: frameworkProps[];
}) {
  const { userId } = FrameworkMainContext();

  const [showFrameworkDetails, setShowFrameworkDetails] =
    useState<FrameworkData | null>(null);
  const [subscribePage, setSubscribePage] = useState<boolean>(false);

  async function handleSubscribe(frameworkId: string) {
    // if (!frameworkId) {
    //   toast.error("Framework ID is missing.", { duration: 2000 });
    //   return;
    // }
    // const finalData = {
    //   frameworkId: frameworkId,
    //   clientId: userId,
    // };

    // try {
    //   // toast.loading("Subscribing to framework...", { duration: 2000 });
    //   const customControlProcessId = await mapProcessName({ processName: "Subscribed Frameworks" });
    //   await startProcessV2({
    //     processId: customControlProcessId,
    //     data: finalData,
    //     processIdentifierFields: "",
    //   });
    //   toast.success("Successfully subscribed to the framework", { duration: 2000 });
    //   router.refresh();
    // } catch (error) {
    //   console.error("Failed to subscribe to framework:", error);
    //   toast.error("Failed to subscribe. Please try again.", { duration: 2000 });
    // }

    const frameworkInfo = await getMyInstancesV2({
      processName: "Framework Processes",
      predefinedFilters: { taskName: "Publish" },
      processVariableFilters: { id: frameworkId },
    });
    const frameworkInfoData =
      frameworkInfo.length > 0
        ? (frameworkInfo[0].data as FrameworkData)
        : null;
    setShowFrameworkDetails(frameworkInfoData);
    setSubscribePage(true);
  }

  function handleViewDetails(frameworkId: string) {
    // router.push(`/grc-v2/${frameworkId}/home`)
    router.push(`/grc-v2/${frameworkId}/${clientId}/home`);
  }

  return (
    <>
      <div>
        <section className="mb-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
            Your Subscribed Frameworks
          </h2>
          <p className="text-gray-400 mb-6">
            Track your progress against the compliance frameworks you are
            actively subscribed to.
          </p>
          <div
            id="subscribed-frameworks-container"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {subscribedList.length > 0 ? (
              subscribedList.map((framework) => (
                <FrameworkCard
                  key={framework.id}
                  framework={framework}
                  isSubscribed={true}
                  onButtonClick={() => handleViewDetails(framework.id || "")}
                />
              ))
            ) : (
              <div className="col-span-4 h-[10vh]">
                <NoDataComponent />
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
            Available Frameworks to Track
          </h2>
          <p className="text-gray-400 mb-6">
            Explore and track your potential readiness against frameworks not
            yet actively subscribed.
          </p>
          <div
            id="available-frameworks-container"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {availableList.length > 0 ? (
              availableList.map((framework) => (
                <FrameworkCard
                  key={framework.id}
                  framework={framework}
                  isSubscribed={false}
                  onButtonClick={() => handleSubscribe(framework.id || "")}
                />
              ))
            ) : (
              <div className="col-span-4 h-[10vh]">
                <NoDataComponent />
              </div>
            )}
          </div>
        </section>
      </div>

      {showFrameworkDetails && subscribePage && (
        <DisplayFrameworkDetails
          open={subscribePage}
          setOpen={setSubscribePage}
          showFrameworkDetails={showFrameworkDetails}
        />
      )}
    </>
  );
}
