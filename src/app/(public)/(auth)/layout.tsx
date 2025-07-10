import "./auth.css";
import { Info, Menu } from "lucide-react";
import Image from "next/image";
import Terminal from "./components/terminal/Terminal";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="h-dvh p-5 flex flex-col dark gradient-background-login">
        <div className="flex flex-row justify-between items-center">
          <Image
            src={
              process.env.NEXT_BASE_PATH + "/assets/images/dark/keross-logo.png"
            }
            alt="Keross"
            width={253}
            height={39}
          />
          {/* <span className='text-white'>Select Language</span> */}
        </div>
        <div className="flex flex-row justify-between items-center flex-grow">
          <div className="text-white flex flex-row gap-2">
            {/* <div className=''>
              <Image src='/assets/images/inverted-comma-1.png' alt="Comma" height='50' width='25' />
            </div> */}
            <span className="login-left-text">
              "Step into the future of Collaboration with our AI-Agent Domain
              Experts."
            </span>
            {/* <div className='flex flex-col-reverse mb-3'>
              <Image src='/assets/images/inverted-comma-2.png' alt="Comma" height='50' width='25' />
            </div> */}
          </div>
          <div className="terminal-box">
            <Terminal />
          </div>
          <div className="flex flex-col gap-5 pe-20 form-section">
            <Image
              src={
                process.env.NEXT_BASE_PATH + "/assets/images/dark/ikon-logo.png"
              }
              alt="Ikon"
              width={200}
              height={70}
            />
            <span className="ikon-sub-text mb-3">
              Harness the Power of Data
            </span>
            {children}
          </div>
        </div>
        <footer className="flex flex-row justify-between">
          <div className="flex gap-2 items-center justify-center lg:justify-start flex-grow">
            <a href="#">
              <Info size={18} />
            </a>
            <span className="text-white text-xs">Powered By </span>
            <a href="https://keross.com" target="_blank">
              <Image
                src={
                  process.env.NEXT_BASE_PATH +
                  "/assets/images/dark/keross-logo.png"
                }
                alt="Keross"
                width={85}
                height={15}
              />
            </a>
            <span className="text-white text-xs">| © </span>
            <span className="text-white text-xs">
              {new Date().getFullYear()}
            </span>
          </div>
          <div className="">
            <div className="hidden lg:flex gap-2 items-center">
              <a
                className="hover:underline text-white text-xs"
                href="http://keross.com/about"
                target="_blank"
              >
                About Us
              </a>
              <span className="text-white text-xs">|</span>
              <a
                className="hover:underline text-white text-xs"
                href="http://keross.com/contact"
                target="_blank"
              >
                Get in Touch
              </a>
              <span className="text-white text-xs">|</span>
              <a
                className="hover:underline text-white text-xs"
                href="http://keross.com/privacy-policy"
                target="_blank"
              >
                Privacy Policy
              </a>
            </div>
            <div className="lg:hidden">
              <Menu />
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
