import { Card } from "@tremor/react";
import {
  HarvesterData,
  LastDnsRecords,
  LastHttpsCertificate,
  VoteMsg,
} from "./type";
import { Badge, badgeVariants } from "@/components/Badge";
import { ReactNode } from "react";
import { RiInformationLine, RiShieldCheckLine } from "@remixicon/react";
import { format } from "date-fns";
import { Label } from "@radix-ui/react-label";
import { BasicInfoWidget } from "@/components/BasicInfoWidget";

interface WhoisData {
  admin: Record<string, string>;
  registrar: Record<string, string>;
  domain: Record<string, string>;
  nameServers: string[];
}

function parseWhois(whoisText: string): WhoisData {
  if (!whoisText) return { admin: {}, registrar: {}, domain: {}, nameServers: [] };

  const whoisLines = whoisText.split("\n").map((line) => line.trim());
  const whoisData: WhoisData = {
    admin: {},
    registrar: {},
    domain: {},
    nameServers: [],
  };

  whoisLines.forEach((line) => {
    if (!line.includes(": ")) return;

    const [key, value] = line.split(": ").map((part) => part.trim());
    if (!value) return;

    if (key.startsWith("Admin")) {
      const cleanKey = key.replace("Admin ", "");
      whoisData.admin[cleanKey] = value;
    } else if (key.startsWith("Registrar")) {
      const cleanKey = key.replace("Registrar ", "");
      whoisData.registrar[cleanKey] = value;

      // Format expiration date if found
      if (cleanKey.includes("Expiration")) {
        try {
          whoisData.registrar[cleanKey] = format(new Date(value), "yyyy-MMM-dd");
        } catch {
          whoisData.registrar[cleanKey] = value;
        }
      }
    } else if (key.startsWith("Domain")) {
      const cleanKey = key.replace("Domain ", "");
      whoisData.domain[cleanKey] = value;
    } else if (key.startsWith("Name Server")) {
      whoisData.nameServers.push(value);
    }
  });

  return whoisData;
}

export default function InfoWidget({
  widgetData,
  queryUrl,
}: {
  widgetData: HarvesterData;
  queryUrl: string;
}) {
  // Parse the whois data
  const rawWhois = widgetData?.attributes?.whois;
  const whoisData = typeof rawWhois === 'string'
    ? parseWhois(rawWhois)
    : rawWhois || { admin: {}, registrar: {}, domain: {}, nameServers: [] };

  // Get DNS records
  const last_dns_records: LastDnsRecords[] = widgetData.attributes.last_dns_records ?? [];
  const selectedUrlIPRecords: LastDnsRecords = last_dns_records
    ? last_dns_records.filter((eachRecord: LastDnsRecords) => {
      if (eachRecord.type === "A") {
        return eachRecord;
      }
    })[0]
    : "";

  const registrar = widgetData.attributes.registrar ?? undefined;

  const totalVotes: Record<string, number> =
    widgetData.attributes.total_votes ?? {};

  const votedHarmless = totalVotes["harmless"];
  const votedMalicious = totalVotes["malicious"];
  const totalVotesCount = votedHarmless + votedMalicious;
  const voteMsgObj: VoteMsg =
    votedMalicious >= totalVotesCount / 3
      ? {
        cssVariant: `bg-red-100 text-red-900`,
        iconHTML: <RiInformationLine className="-ml-0.5 size-4" />,
        fraction: `${votedMalicious}/${totalVotesCount}`,
        flagText: "malicious",
      }
      : {
        cssVariant: `bg-green-100 text-green-900`,
        iconHTML: <RiShieldCheckLine className="-ml-0.5 size-4" />,
        fraction: `${votedHarmless}/${totalVotesCount}`,
        flagText: "harmless",
      };

  const lastHttpsCertificate = widgetData.attributes.last_https_certificate;
  const lastHttpsCertificateObj: LastHttpsCertificate = {
    validFrom: lastHttpsCertificate.validity?.not_before
      ? format(lastHttpsCertificate.validity.not_before, "yyyy-MMM-dd")
      : "N/A",
    validTill: lastHttpsCertificate.validity?.not_after
      ? format(lastHttpsCertificate.validity.not_after, "yyyy-MMM-dd")
      : "N/A",
    size: lastHttpsCertificate.size || "N/A",
    version: lastHttpsCertificate.version || "N/A",
    publicKeyAlgorithm: lastHttpsCertificate.public_key?.algorithm || "N/A",
    issuer: lastHttpsCertificate.issuer
      ? Object.values(lastHttpsCertificate.issuer)
      : ["N/A"],
  };

  // Prepare basic info
  const basicInfo = [
    {
      name: "URL/IP address/domain",
      value: queryUrl || "N/A"
    },
    {
      name: "WHOIS Server",
      value: whoisData.registrar["WHOIS Server"] || whoisData.registrar["Whois Server"] || "N/A"
    },
    {
      name: "HTTPS Certificate Validity",
      value: `${lastHttpsCertificateObj.validFrom} to ${lastHttpsCertificateObj.validTill}`
    },
    {
      name: "Country",
      value: whoisData.admin["Country"] || "N/A"
    },
    {
      name: "IP Address",
      value: selectedUrlIPRecords.value || "N/A"
    },
    {
      name: "Registrar",
      value: whoisData.registrar["Registrar"] || whoisData.registrar["Name"] || "N/A"
    },
    {
      name: "Registration Expiration Date",
      value: whoisData.registrar["Registration Expiration Date"] || "N/A"
    },
    {
      name: "Organization",
      value: whoisData.admin["Organization"] || whoisData.admin["Organisation"] || "N/A"
    }
  ];

  return (
    <>
      <div className="col-span-3 space-y-2">
        <Label className="text-lg font-bold h-full text-widget-title text-widgetHeader">
          Basic Information
        </Label>

        {/* <Card className="rounded-md">
          <div className="h-full">
            <ul
              role="list"
              className="grid grid-cols-1 h-full gap-3 lg:mt-0 lg:grid-cols-4"
            >
              {basicInfo.map((item) => (
                <li
                  key={item.name}
                  className="px-0 py-3 lg:px-4 lg:py-2 lg:text-left max-w-[200px] lg:max-w-none" // Fixed width for mobile
                >
                  <div className="border-l-2 border-l-white/70 pl-2 w-full">
                    <p className="text-sm font-semibold text-widget-mainHeader truncate" title={item.value}>
                      {item.value}
                    </p>
                    <p className="text-sm text-widget-mainDesc truncate">
                      {item.name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card> */}
        <BasicInfoWidget items={basicInfo} />
      </div>
    </>
  );
}

