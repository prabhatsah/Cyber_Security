import "./layout.css";
import { TextButton } from "@/ikon/components/buttons/index";
import { getActiveAccountId } from "@/ikon/utils/actions/account/index";
import { getAvailableSoftwaresForAccount } from "@/ikon/utils/api/softwareService/index";
import Image from "next/image";
import Terminal from "./components/terminal-home/Terminal";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
import SoftwareShowcase from "./components/app-carousel-home";

export default async function Home() {
  const activeAccountId = await getActiveAccountId();
  const softwareMap = await getAvailableSoftwaresForAccount({
    accountId: activeAccountId,
  });

  return (
    <>
      <RenderAppSidebar menuItems={[]} />
      <div className="flex flex-col gap-8 md:flex-row justify-center items-center h-full w-full relative overflow-hidden">
        {/* Content Section */}
        <div className="w-full md:w-1/3 pl-8">
          <div className="flex flex-col gap-8 justify-center md:items-start items-center z-10 text-left">
            {/* Logo */}
            <Image
              src={
                process.env.NEXT_BASE_PATH + "/assets/images/dark/ikon-logo.png"
              }
              alt="ikon-logo"
              height={56}
              width={190}
            />
            <span className="login-left-text">
              "Step into the future of Collaboration with our AI-Agent Domain
              Experts."
            </span>
            {/* Buttons */}
            <div className="flex flex-wrap items-start gap-3 md:gap-4">
              <TextButton className="py-6" size="lg">
                Subscribe the Apps
              </TextButton>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <Terminal />
        </div>
        {/* Graphics Section */}
        <div className="w-full md:w-1/3 flex justify-center items-center">
          <SoftwareShowcase softwareList={softwareMap} />
        </div>
      </div>
    </>
  );
}
