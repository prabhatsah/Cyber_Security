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

export default function InfoWidget({
  widgetData,
  queryUrl,
}: {
  widgetData: HarvesterData;
  queryUrl: string;
}) {
  const categoriesObj: Record<string, string> =
    widgetData.attributes.categories ?? {};

  const categoriesLabelArray: Array<string> = Object.values(categoriesObj);

  const last_dns_records: LastDnsRecords[] =
    widgetData.attributes.last_dns_records ?? [];
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
    validFrom: format(lastHttpsCertificate.validity.not_before, "yyyy-MMM-dd"),
    validTill: format(lastHttpsCertificate.validity.not_after, "yyyy-MMM-dd"),
    size: lastHttpsCertificate.size,
    version: lastHttpsCertificate.version,
    publicKeyAlgorithm: lastHttpsCertificate.public_key.algorithm,
    issuer: Object.values(lastHttpsCertificate.issuer),
  };

  return (
    <>
      <Card className="col-span-3 rounded-md">
        <div className="flex justify-between">
          <div className="flex gap-5">
            <h3 className=" font-semibold text-gray-700 ">{queryUrl}</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {categoriesLabelArray.map((tag) => (
                <span className="inline-flex items-center gap-x-1 rounded-md bg-gray-200/50 px-2 py-1 text-xs font-semibold text-gray-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {selectedUrlIPRecords && (
            <span className="inline-flex items-center gap-x-1 rounded-md font-semibold bg-success text-stone-100 px-2 text-xs dark:bg-gray-500/30 dark:text-gray-300">
              {selectedUrlIPRecords.value}
            </span>
          )}
        </div>
        <div className="flex gap-5 mt-2">
          {registrar && (
            <p className="text-sm text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
              Registrar:&nbsp;
              <span className="font-semibold text-gray-700 text-xs">
                {registrar}
              </span>
            </p>
          )}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* <div key="totalVotes" className=" dark:border-blue-400/10">
            <p className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Total Votes
            </p>
            <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
              <Badge
                className={`rounded-md text-sm px-2 font-bold ring-0 ${voteMsgObj.cssVariant}`}
              >
                {voteMsgObj.iconHTML}
                {voteMsgObj.fraction}
              </Badge>{" "}
              security vendors flagged this URL as {voteMsgObj.flagText}
            </p>
          </div> */}

          <div key="lastHttpsCertificate" className="col-span-2 ">
            <p className="text-sm font-medium">Last HTTPS Certificate</p>

            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                <strong>Validity:</strong>&nbsp;
                {`${lastHttpsCertificateObj.validFrom} to ${lastHttpsCertificateObj.validTill}`}
              </p>

              <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                <strong>Size:</strong>&nbsp;
                {lastHttpsCertificateObj.size}
              </p>
              <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                <strong>Version:</strong>&nbsp;
                {lastHttpsCertificateObj.version}
              </p>
              <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                <strong>Public Key Algorithm:</strong>&nbsp;
                {lastHttpsCertificateObj.publicKeyAlgorithm}
              </p>

              <div className="flex gap-2 col-span-2">
                <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
                  <strong>Issuer:</strong>&nbsp;
                </p>
                <div className="flex flex-wrap justify-start gap-2">
                  {lastHttpsCertificateObj.issuer.map((eachAlternativeName) => (
                    <span className="inline-flex items-center gap-x-1 rounded-md bg-gray-200/50 px-2 py-1 text-xs font-semibold text-gray-700">
                      {eachAlternativeName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
