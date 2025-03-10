import {
  RiAddBoxFill,
  RiAdminLine,
  RiGlobalLine,
  RiServerLine,
  RiUserSettingsLine,
} from "@remixicon/react";
import { WhoisData } from "./type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";
import { format } from "date-fns";

function parseWhois(whoisText: string): WhoisData {
  const whoisLines = whoisText.split("\n").map((line) => line.trim());
  const whoisData: WhoisData = {
    admin: {},
    registrar: {},
    domain: {},
    nameServers: [],
  };

  whoisLines.forEach((line) => {
    const [key, value] = line.split(": ").map((part) => part.trim());
    if (!value) return;

    if (key.startsWith("Admin")) {
      whoisData.admin[key.replace("Admin ", "")] = value;

      if (whoisData.admin["Email"]) delete whoisData.admin["Email"];
    } else if (key.startsWith("Registrar")) {
      whoisData.registrar[key.replace("Registrar ", "")] = value;

      if (whoisData.registrar["Registration Expiration Date"])
        whoisData.registrar["Registration Expiration Date"] = format(
          whoisData.registrar["Registration Expiration Date"],
          "yyyy-MMM-dd"
        );
    } else if (key.startsWith("Domain")) {
      whoisData.domain[key.replace("Domain ", "")] = value;
    } else if (key.startsWith("Name Server")) {
      whoisData.nameServers.push(value);
    }
  });

  return whoisData;
}

export default function WhoIs({ whoisText }: { whoisText: string }) {
  const whoisData = parseWhois(whoisText);
  console.log("Whois Data: ", whoisData);

  return (
    <>
      <h2 className="text-md font-semibold text-gray-900 ">Whois Lookup</h2>

      <div className="mt-2 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 text-sm border p-4 rounded-md">
        <div key="registrarInfo" className="flex flex-col gap-3">
          <div className="flex items-center gap-2 h-8">
            <div className="w-fit rounded-lg p-2 ring-1 ring-black/5 dark:ring-white/5">
              <RiUserSettingsLine
                aria-hidden="true"
                className="size-6 text-blue-600 dark:text-blue-400"
              />
            </div>
            Registrar Info
          </div>

          <div className="flex flex-col gap-2">
            {Object.entries(whoisData.registrar).map(([key, value]) => (
              <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        </div>

        <div key="adminInfo" className="flex flex-col gap-3">
          <div className="flex items-center gap-2 h-8">
            <div className="w-fit rounded-lg p-2 ring-1 ring-black/5 dark:ring-white/5">
              <RiAdminLine
                aria-hidden="true"
                className="size-6 text-blue-600 dark:text-blue-400"
              />
            </div>
            Admin Info
          </div>

          <div className="flex flex-col gap-2">
            {Object.entries(whoisData.admin).map(([key, value]) => (
              <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        </div>

        <div key="domainInfo" className="flex flex-col gap-3">
          <div className="flex items-center gap-2 h-8">
            <div className="w-fit rounded-lg p-2 ring-1 ring-black/5 dark:ring-white/5">
              <RiGlobalLine
                aria-hidden="true"
                className="size-6 text-blue-600 dark:text-blue-400"
              />
            </div>
            Domain Info
          </div>

          <div className="flex flex-col gap-2">
            {Object.entries(whoisData.domain).map(([key, value]) => (
              <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        </div>

        <div key="nameServers" className="flex flex-col gap-3 col-span-3">
          <div className="flex items-center gap-2 h-8">
            <div className="w-fit rounded-lg p-2 ring-1 ring-black/5 dark:ring-white/5">
              <RiServerLine
                aria-hidden="true"
                className="size-6 text-blue-600 dark:text-blue-400"
              />
            </div>
            Name Servers
          </div>

          <div className="flex flex-wrap justify-start gap-4">
            {whoisData.nameServers.map((eachServer) => (
              <span
                className="inline-flex items-center gap-x-1 rounded-md bg-gray-200/50 px-2 py-1 text-xs font-semibold text-gray-700
                dark:bg-gray-500/30 dark:text-gray-300"
              >
                {eachServer}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
